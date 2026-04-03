import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = `${environment.apiBaseUrl}/api/Categories`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      catchError(err => throwError(() => 'فشل تحميل التصنيفات'))
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => throwError(() => 'فشل تحميل التصنيف'))
    );
  }

  getCategoryByName(name: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/Get-By-Name?name=${name}`).pipe(
      catchError(err => throwError(() => 'فشل تحميل التصنيف'))
    );
  }

  addCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/Add-Category`, category, {
      headers: this.getHeaders()
    }).pipe(
      catchError(err => throwError(() => 'فشل إضافة التصنيف'))
    );
  }

  updateCategory(category: Partial<Category>): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/Update-Category`, category, {
      headers: this.getHeaders()
    }).pipe(
      catchError(err => throwError(() => 'فشل تحديث التصنيف'))
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/Toggle-Category/${id}`, {}, {
      headers: this.getHeaders()
    }).pipe(
      catchError(err => throwError(() => 'فشل حذف التصنيف'))
    );
  }
}
