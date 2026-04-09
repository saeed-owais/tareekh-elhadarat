import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = `${environment.apiBaseUrl}/api/Statistics`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  private getHeaders() {
    return {
      headers: {
        'Authorization': `Bearer ${this.tokenService.getToken()}`
      }
    };
  }

  getViewsCount(): Observable<number> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/views-number`, this.getHeaders()).pipe(
      map(res => res.data),
      catchError(() => throwError(() => 'فشل تحميل عدد المشاهدات'))
    );
  }

  getCommentsCount(): Observable<number> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/comments-number`, this.getHeaders()).pipe(
      map(res => res.data),
      catchError(() => throwError(() => 'فشل تحميل عدد التعليقات'))
    );
  }

  getBooksCount(): Observable<number> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/books-number`, this.getHeaders()).pipe(
      map(res => res.data),
      catchError(() => throwError(() => 'فشل تحميل عدد الكتب'))
    );
  }

  getArticlesCount(): Observable<number> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/articles-number`, this.getHeaders()).pipe(
      map(res => res.data),
      catchError(() => throwError(() => 'فشل تحميل عدد المقالات'))
    );
  }

  getUsersCount(): Observable<number> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/users-number`, this.getHeaders()).pipe(
      map(res => res.data),
      catchError(() => throwError(() => 'فشل تحميل عدد المستخدمين'))
    );
  }
}
