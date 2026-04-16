import { Component, inject, OnInit, OnDestroy, signal, ViewChild, ElementRef } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../core/services/article.service';
import { CategoryService } from '../../core/services/category.service';
import { Article } from '../../core/models/article.model';
import { Category } from '../../core/models/category.model';
import { forkJoin, Subscription } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { TranslationService } from '../../core/services/translation.service';
import { SeoService } from '../../core/services/seo.service';

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
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seoService = inject(SeoService);
  public ts = inject(TranslationService);

  articles = signal<Article[]>([]);
  categories = signal<Category[]>([]);
  selectedCategoryId = signal<number | null>(null);
  isLoading = signal(true);
  
  // Favorites
  savedArticleIds = signal<number[]>([]);
  isLoggedIn = signal(false);

  @ViewChild('categorySlider') categorySlider!: ElementRef<HTMLDivElement>;

  private queryParamsSub!: Subscription;

  ngOnInit(): void {
    this.isLoggedIn.set(this.authService.isLoggedIn());
    if (this.isLoggedIn()) {
      this.loadSavedArticles();
    }

    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        const activeCats = cats.filter(c => c.isAvailable);
        this.categories.set(activeCats);

        // Subscribe to query param changes
        this.queryParamsSub = this.route.queryParams.subscribe(params => {
          const categoryId = params['category'];

          if (categoryId) {
            const catId = Number(categoryId);
            this.filterByCategory(catId);
            
            // Update SEO for category
            const cat = activeCats.find(c => c.id === catId);
            if (cat) {
              const baseTitle = this.ts.t('articles.title');
              this.seoService.updateMetadataByKey('articles', {
                title: `${baseTitle}: ${cat.name}`
              });
            }
          } else {
            if (this.selectedCategoryId() !== null || this.articles().length === 0) {
              this.selectedCategoryId.set(null);
              this.isLoading.set(true);
              this.loadAllArticles();
            }
            this.seoService.updateMetadataByKey('articles');
          }
        });
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  private loadSavedArticles(): void {
    this.profileService.getSavedArticles().subscribe({
      next: (articles) => {
        this.savedArticleIds.set(articles.map(a => a.articleId));
      }
    });
  }

  toggleHeart(articleId: number, event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (!this.isLoggedIn()) return;

    if (this.savedArticleIds().includes(articleId)) {
      this.profileService.removeSavedArticle(articleId).subscribe({
        next: () => {
          this.savedArticleIds.update(ids => ids.filter(id => id !== articleId));
        }
      });
    } else {
      this.profileService.saveArticle(articleId).subscribe({
        next: () => {
          this.savedArticleIds.update(ids => [...ids, articleId]);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.queryParamsSub?.unsubscribe();
  }

  private loadAllArticles(): void {
    if (this.categories().length === 0) {
      this.isLoading.set(false);
      return;
    }

    const requests = this.categories().map(c => this.articleService.getArticlesByCategory(c.id, 1, 100));
    forkJoin(requests).subscribe({
      next: (results) => {
        const all = results.map(r => r.data).flat();
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
    this.isLoading.set(true);

    if (categoryId === null) {
      this.loadAllArticles();
    } else {
      this.articleService.getArticlesByCategory(categoryId, 1, 100).subscribe({
        next: (response) => {
          this.articles.set(response.data);
          this.isLoading.set(false);
        },
        error: () => {
          this.articles.set([]);
          this.isLoading.set(false);
        }
      });
    }
  }

  scrollCategories(direction: 'left' | 'right'): void {
    const el = this.categorySlider?.nativeElement;
    if (!el) return;
    const isRtl = this.ts.isRtl();
    const scrollAmount = 200;
    
    // Start with physical direction
    let amount = direction === 'left' ? -scrollAmount : scrollAmount;
    
    // Explicitly reverse for Arabic as requested
    if (isRtl) {
      amount = -amount;
    }

    el.scrollBy({
      left: amount,
      behavior: 'smooth'
    });
  }
}
