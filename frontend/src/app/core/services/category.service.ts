import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = `${environment.apiBaseUrl}/api/Categories`;

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      catchError(err => {
        return throwError(() => 'فشل تحميل التصنيفات');
      })
    );
  }
}
