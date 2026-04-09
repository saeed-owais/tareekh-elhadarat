import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommentService } from '../../../core/services/comment.service';
import { SubmittedComment } from '../../../core/models/comment.model';

@Component({
  selector: 'app-admin-comments-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './comments-manage.component.html',
})
export class CommentsManageComponent implements OnInit {
  private commentService = inject(CommentService);

  comments = signal<SubmittedComment[]>([]);
  isLoading = signal(false);
  successMessage = signal('');
  searchQuery = signal('');

  // Modals/UI State
  confirmDeleteCommentId = signal<number | null>(null);
  detailedComment = signal<SubmittedComment | null>(null);
  isViewingComment = signal(false);

  // Sort State
  sortKey = signal<keyof SubmittedComment | null>('createdAt');
  sortDirection = signal<'asc' | 'desc'>('desc');

  filteredComments = computed(() => {
    let data = [...this.comments()];
    const query = this.searchQuery().toLowerCase().trim();

    // 1. Filter
    if (query) {
      data = data.filter(c => 
        c.userName.toLowerCase().includes(query) || 
        c.text.toLowerCase().includes(query) || 
        c.articleTitle.toLowerCase().includes(query)
      );
    }

    // 2. Sort
    const key = this.sortKey();
    if (key) {
      const dir = this.sortDirection() === 'asc' ? 1 : -1;
      data.sort((a, b) => {
        const valA = a[key] ?? '';
        const valB = b[key] ?? '';
        
        if (typeof valA === 'string' && typeof valB === 'string') {
          return valA.localeCompare(valB) * dir;
        }
        
        if (valA < valB) return -1 * dir;
        if (valA > valB) return 1 * dir;
        return 0;
      });
    }

    return data;
  });

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments() {
    this.isLoading.set(true);
    this.commentService.getSubmittedComments().subscribe({
      next: (data) => {
        this.comments.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  toggleSort(key: keyof SubmittedComment) {
    if (this.sortKey() === key) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDirection.set('asc');
    }
  }

  acceptComment(id: number) {
    this.isLoading.set(true);
    this.commentService.acceptComment(id).subscribe({
      next: () => {
        this.comments.update(list => list.filter(c => c.id !== id));
        this.successMessage.set('تم قبول التعليق بنجاح');
        this.isLoading.set(false);
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  toggleDelete(id: number, event: Event) {
    event.stopPropagation();
    this.confirmDeleteCommentId.set(this.confirmDeleteCommentId() === id ? null : id);
  }

  confirmDelete(id: number, event: Event) {
    event.stopPropagation();
    this.isLoading.set(true);
    this.commentService.deleteComment(id).subscribe({
      next: () => {
        this.comments.update(list => list.filter(c => c.id !== id));
        this.successMessage.set('تم حذف التعليق بنجاح');
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
