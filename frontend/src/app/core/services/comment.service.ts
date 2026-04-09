import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Comment, SubmittedComment } from '../models/comment.model';
import { AddCommentRequest } from '../models/add-comment.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private baseUrl = `${environment.apiBaseUrl}/api/Comments`;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    });
  }

  addComment(data: AddCommentRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/Add-Comment`, data);
  }

  // ================= ADMIN ENDPOINTS =================

  getSubmittedComments(): Observable<SubmittedComment[]> {
    return this.http.get<SubmittedComment[]>(`${this.baseUrl}/get-submitted-comments`, {
      headers: this.getHeaders()
    });
  }

  acceptComment(commentId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/accept-comment?commentId=${commentId}`, {}, {
      headers: this.getHeaders()
    });
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/delete-Comment?commentId=${commentId}`, {}, {
      headers: this.getHeaders()
    });
  }

  getComment(commentId: number): Observable<SubmittedComment> {
    return this.http.get<SubmittedComment>(`${this.baseUrl}/get-comment?commentId=${commentId}`, {
      headers: this.getHeaders()
    });
  }
}
