import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../../core/services/article.service';
import { CommentService } from '../../../core/services/comment.service';
import { AdminArticle, SubmittedComment } from '../../../core/models';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-admin-approvals',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './approvals.component.html',
})
export class ApprovalsComponent implements OnInit {
  private articleService = inject(ArticleService);
  private commentService = inject(CommentService);
  public ts: TranslationService = inject(TranslationService);

  // State Management
  activeTab = signal<'articles' | 'comments'>('articles');
  isLoading = signal(false);
  successMessage = signal('');
  
  // Data Signals
  articles = signal<AdminArticle[]>([]);
  comments = signal<SubmittedComment[]>([]);
  
  // Modals/UI State
  confirmDeleteCommentId = signal<number | null>(null);
  detailedComment = signal<SubmittedComment | null>(null);
  isViewingComment = signal(false);

  // Pagination (Keeping for articles, comments use simple list for now)
  pageNumber = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);
  totalPages = signal(0);

  ngOnInit(): void {
    this.loadSubmittedArticles();
    this.loadSubmittedComments();
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

  loadSubmittedComments() {
    this.commentService.getSubmittedComments().subscribe({
      next: (data) => {
        this.comments.set(data)
        // console.log("loadSubmittedComments",data);
        
      },
      error: (err) => console.error('Error fetching comments:', err)
    });
  }

  onPageChange(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.pageNumber.set(newPage);
      this.loadSubmittedArticles();
    }
  }

  // --- Article Actions ---
  acceptArticle(id: number) {
    this.isLoading.set(true);
    this.articleService.acceptArticle(id).subscribe({
      next: (success) => {
        if (success) {
          this.articles.update(list => list.filter(a => a.id !== id));
          this.successMessage.set(this.ts.t('admin.articleForm.successAdd')); // Reusing similar success key
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

  // --- Comment Actions ---
  acceptComment(id: number) {
    this.isLoading.set(true);
    this.commentService.acceptComment(id).subscribe({
      next: () => {
        this.comments.update(list => list.filter(c => c.id !== id));
        this.successMessage.set(this.ts.t('admin.approvals.systemUpdated'));
        this.isLoading.set(false);
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  toggleDeleteComment(id: number, event: Event) {
    event.stopPropagation();
    this.confirmDeleteCommentId.set(this.confirmDeleteCommentId() === id ? null : id);
  }

  confirmDeleteComment(id: number, event: Event) {
    event.stopPropagation();
    this.isLoading.set(true);
    this.commentService.deleteComment(id).subscribe({
      next: () => {
        this.comments.update(list => list.filter(c => c.id !== id));
        this.successMessage.set(this.ts.t('admin.approvals.systemUpdated'));
        this.confirmDeleteCommentId.set(null);
        this.isLoading.set(false);
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
        this.confirmDeleteCommentId.set(null);
      }
    });
  }

  viewCommentDetails(id: number) {
    this.isLoading.set(true);
    // Find local data for fallback articleId/articleTitle
    const localData = this.comments().find(c => c.id === id);
    
    this.commentService.getComment(id).subscribe({
      next: (data) => {
        // Fallback to local data if API returns null/missing IDs
        if (localData && !data.articleId) {
           data.articleId = localData.articleId;
        }
        if (localData && !data.articleTitle) {
          data.articleTitle = localData.articleTitle;
        }
        
        this.detailedComment.set(data);
        this.isViewingComment.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  closeCommentModal() {
    this.isViewingComment.set(false);
    setTimeout(() => this.detailedComment.set(null), 200);
  }
}
