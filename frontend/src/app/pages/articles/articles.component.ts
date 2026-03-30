import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../core/services/article.service';
import { CategoryService } from '../../core/services/category.service';
import { Article } from '../../core/models/article.model';
import { Category } from '../../core/models/category.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.css'
})
export class ArticlesComponent implements OnInit {
  private articleService = inject(ArticleService);
  private categoryService = inject(CategoryService);

  articles = signal<Article[]>([]);
  categories = signal<Category[]>([]);
  selectedCategoryId = signal<number | null>(null);
  isLoading = signal(true);
  searchQuery = '';

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats.filter(c => c.isAvailable));
        // Load articles from all categories
        this.loadAllArticles();
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  private loadAllArticles(): void {
    if (this.categories().length === 0) {
      this.isLoading.set(false);
      return;
    }

    const requests = this.categories().map(c => this.articleService.getArticlesByCategory(c.id));
    forkJoin(requests).subscribe({
      next: (results) => {
        // Merge all and remove duplicates by id
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

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.selectedCategoryId.set(null);
      this.loadAllArticles();
      return;
    }

    this.isLoading.set(true);
    this.selectedCategoryId.set(null);
    this.articleService.searchArticles(this.searchQuery).subscribe({
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
