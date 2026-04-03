import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Tag } from '../models/tag.model';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class TagService {

    private baseUrl = `${environment.apiBaseUrl}/api/Tags`;

    constructor(
        private http: HttpClient,
        private tokenService: TokenService
    ) { }

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Authorization': `Bearer ${this.tokenService.getToken()}`
        });
    }

    // ================= GET ALL TAGS =================
    getTags(): Observable<Tag[]> {
        return this.http.get<Tag[]>(this.baseUrl).pipe(
            catchError(err => throwError(() => 'فشل تحميل الوسوم'))
        );
    }

    addTag(tag: Partial<Tag>): Observable<Tag> {
        return this.http.post<Tag>(`${this.baseUrl}/Add-Tag`, tag, {
            headers: this.getHeaders()
        }).pipe(
            catchError(err => throwError(() => 'فشل إضافة الوسم'))
        );
    }

    updateTag(tag: Partial<Tag>): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/Update-Tag`, tag, {
            headers: this.getHeaders()
        }).pipe(
            catchError(err => throwError(() => 'فشل تحديث الوسم'))
        );
    }

    deleteTag(id: number): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/Toggle-Tag/${id}`, {}, {
            headers: this.getHeaders()
        }).pipe(
            catchError(err => throwError(() => 'فشل حذف الوسم'))
        );
    }
}
