import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Comment } from '../models/comment.model';
import { AddCommentRequest } from '../models/add-comment.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/api/Comments`;

  private comments: Comment[] = [
    // ... items omitted for brevity ...
  ];

  getCommentsByPostId(postId: number): Comment[] {
    return this.comments.filter(c => c.postId === postId && c.isApproved).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  addComment(data: AddCommentRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/Add-Comment`, data);
  }
}
