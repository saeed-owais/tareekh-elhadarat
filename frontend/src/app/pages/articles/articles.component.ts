import { Component, inject, OnInit, OnDestroy, signal, ViewChild, ElementRef } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../core/services/article.service';
import { CategoryService } from '../../core/services/category.service';
import { Article } from '../../core/models/article.model';
import { Category } from '../../core/models/category.model';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.css'
})
export class ArticlesComponent implements OnInit, OnDestroy {
  private articleService = inject(ArticleService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  articles = signal<Article[]>([]);
  categories = signal<Category[]>([]);
  selectedCategoryId = signal<number | null>(null);
  isLoading = signal(true);
  activeSearchQuery = signal('');

  @ViewChild('categorySlider') categorySlider!: ElementRef<HTMLDivElement>;

  private queryParamsSub!: Subscription;

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats.filter(c => c.isAvailable));

        // Subscribe to query param changes (fires on every navigation, even same route)
        this.queryParamsSub = this.route.queryParams.subscribe(params => {
          const search = params['search'];
          const category = params['category'];

          if (search) {
            this.searchArticles(search);
          } else if (category) {
            this.filterByCategory(Number(category));
          } else {
            // Only reload all if we're not already showing all
            if (this.activeSearchQuery() || this.selectedCategoryId() !== null || this.articles().length === 0) {
              this.activeSearchQuery.set('');
              this.selectedCategoryId.set(null);
              this.isLoading.set(true);
              this.loadAllArticles();
            }
          }
        });
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.queryParamsSub?.unsubscribe();
  }

  private loadAllArticles(): void {
    if (this.categories().length === 0) {
      this.isLoading.set(false);
      return;
    }

    const requests = this.categories().map(c => this.articleService.getArticlesByCategory(c.id));
    forkJoin(requests).subscribe({
      next: (results) => {
        const all = results.flat();
        const unique = new Map<number, Article>();
        all.forEach(a => unique.set(a.id, a));
        this.articles.set(Array.from(unique.values()));
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  filterByCategory(categoryId: number | null): void {
    this.selectedCategoryId.set(categoryId);
    this.activeSearchQuery.set('');
    this.isLoading.set(true);

    if (categoryId === null) {
      this.loadAllArticles();
    } else {
      this.articleService.getArticlesByCategory(categoryId).subscribe({
        next: (articles) => {
          this.articles.set(articles);
          this.isLoading.set(false);
        },
        error: () => {
          this.articles.set([]);
          this.isLoading.set(false);
        }
      });
    }
  }

  private searchArticles(query: string): void {
    this.activeSearchQuery.set(query);
    this.selectedCategoryId.set(null);
    this.isLoading.set(true);

    this.articleService.searchArticles(query).subscribe({
      next: (articles) => {
        this.articles.set(articles);
        this.isLoading.set(false);
      },
      error: () => {
        this.articles.set([]);
        this.isLoading.set(false);
      }
    });
  }

  clearSearch(): void {
    this.activeSearchQuery.set('');
    this.router.navigate(['/articles']);
  }

  scrollCategories(direction: 'left' | 'right'): void {
    const el = this.categorySlider?.nativeElement;
    if (!el) return;
    el.scrollBy({
      left: direction === 'left' ? -200 : 200,
      behavior: 'smooth'
    });
  }
}
