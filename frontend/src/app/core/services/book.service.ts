import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Book } from '../models/book.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class BookService {

    private apiUrl = `${environment.apiBaseUrl}/api/Books`;

    constructor(
        private http: HttpClient,
        private tokenService: TokenService
    ) { }

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });
    }

    // ================= GET ALL BOOKS (ADMIN) =================
    getBooksAdmin(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Book>> {
        return this.http.get<PaginatedResponse<Book>>(`${this.apiUrl}/Get-All-Admin`, {
            params: { pageNumber: pageNumber.toString(), pageSize: pageSize.toString() },
            headers: this.getHeaders()
        }).pipe(
            catchError(err => throwError(() => 'فشل تحميل الكتب'))
        );
    }

    // ================= SEARCH BOOKS =================
    searchBooks(title: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Book>> {
        return this.http.get<PaginatedResponse<Book>>(`${this.apiUrl}/Search`, {
            params: { Title: title, pageNumber: pageNumber.toString(), pageSize: pageSize.toString() }
        }).pipe(
            catchError(err => throwError(() => 'فشل البحث عن الكتب'))
        );
    }

    // ================= ADD BOOK (ADMIN) =================
    addBookAdmin(formData: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/Add-Book-Admin`, formData, {
            headers: this.getHeaders()
        }).pipe(
            catchError(err => {
                const message = err.error?.message || 'فشل إضافة الكتاب';
                return throwError(() => message);
            })
        );
    }

    // ================= DELETE BOOK =================
    deleteBook(bookId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/Delete-Book`, {
            params: { BookId: bookId.toString() },
            headers: this.getHeaders()
        }).pipe(
            catchError(err => throwError(() => 'فشل حذف الكتاب'))
        );
    }

    // ================= GET BOOK DETAILS =================
    getBookById(id: number): Observable<Book> {
        return this.http.get<Book>(`${this.apiUrl}/Get-Book-Details`, {
            params: { BookId: id.toString() }
        }).pipe(
            catchError(err => throwError(() => 'فشل تحميل تفاصيل الكتاب'))
        );
    }

    // ================= GET ALL BOOKS (USER) =================
    getBooksUser(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Book>> {
        return this.http.get<PaginatedResponse<Book>>(`${this.apiUrl}/Get-All-User`, {
            params: { pageNumber: pageNumber.toString(), pageSize: pageSize.toString() }
        }).pipe(
            catchError(err => throwError(() => 'فشل تحميل الكتب'))
        );
    }
}
