import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArticleService } from '../../../core/services/article.service';
import { AdminArticle } from '../../../core/models';

@Component({
  selector: 'app-admin-articles-manage',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './articles-manage.component.html',
})
export class ArticlesManageComponent implements OnInit {
  private articleService = inject(ArticleService);

  confirmDeleteId = signal<number | null>(null);
  articles = signal<AdminArticle[]>([]);
  
  // Pagination Signals
  pageNumber = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);
  totalPages = signal(0);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles() {
    this.isLoading.set(true);
    this.articleService.getAllArticlesAdmin(this.pageNumber(), this.pageSize())
      .subscribe({
        next: (response) => {
          this.articles.set(response.data);
          this.totalItems.set(response.totalItems);
          this.totalPages.set(response.totalPages);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
        }
      });
  }

  onPageChange(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.pageNumber.set(newPage);
      this.loadArticles();
    }
  }

  toggleDelete(id: number, event: Event) {
    event.stopPropagation();
    if (this.confirmDeleteId() === id) {
      this.confirmDeleteId.set(null);
    } else {
      this.confirmDeleteId.set(id);
    }
  }

  confirmDelete(id: number, event: Event) {
    event.stopPropagation();
    // For now we just remove from local list as the API was not provided
    this.articles.update(articles => articles.filter(a => a.id !== id));
    this.confirmDeleteId.set(null);
  }
}
