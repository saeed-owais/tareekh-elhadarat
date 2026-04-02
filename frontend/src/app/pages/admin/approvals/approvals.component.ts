import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../../core/services/article.service';
import { AdminArticle } from '../../../core/models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-approvals',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './approvals.component.html',
})
export class ApprovalsComponent implements OnInit {
  private articleService = inject(ArticleService);

  articles = signal<AdminArticle[]>([]);
  isLoading = signal(false);
  successMessage = signal('');
  
  // Pagination
  pageNumber = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);
  totalPages = signal(0);

  ngOnInit(): void {
    this.loadSubmittedArticles();
  }

  loadSubmittedArticles() {
    this.isLoading.set(true);
    this.articleService.getSubmittedArticles(this.pageNumber(), this.pageSize())
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
      this.loadSubmittedArticles();
    }
  }

  acceptArticle(id: number) {
    this.isLoading.set(true);
    this.articleService.acceptArticle(id).subscribe({
      next: (success) => {
        if (success) {
          // Remove from list
          this.articles.update(list => list.filter(a => a.id !== id));
          this.successMessage.set('تم قبول ونشر المقال بنجاح!');
          setTimeout(() => this.successMessage.set(''), 3000);
        }
        this.isLoading.set(false);
      },
      error: (errorMessage) => {
        alert(errorMessage);
        this.isLoading.set(false);
      }
    });
  }
}
