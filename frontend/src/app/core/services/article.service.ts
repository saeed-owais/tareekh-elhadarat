import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { Article } from '../models/article.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    private apiUrl = `${environment.apiBaseUrl}/api/Articles`;

    constructor(
        private http: HttpClient,
        private tokenService: TokenService
    ) { }

    // ================= GET SPECIAL ARTICLE (HERO) =================
    getSpecialArticle(): Observable<Article> {
        return this.http.get<Article>(`${this.apiUrl}/Get-Special-Article`).pipe(
            catchError(err => {
                return throwError(() => 'فشل تحميل المقال المميز');
            })
        );
    }

    // ================= GET NEWEST ARTICLES =================
    getNewestArticles(): Observable<Article[]> {
        return this.http.get<Article[]>(`${this.apiUrl}/Get-Newest-Article`).pipe(
            catchError(err => {
                return throwError(() => 'فشل تحميل أحدث المقالات');
            })
        );
    }

    // ================= GET MOST VIEWED ARTICLES =================
    getMostViewedArticles(): Observable<Article[]> {
        return this.http.get<Article[]>(`${this.apiUrl}/Get-Most-Viewed-Article`).pipe(
            catchError(err => {
                return throwError(() => 'فشل تحميل المقالات الأكثر قراءة');
            })
        );
    }

    // ================= GET ARTICLES BY CATEGORY =================
    getArticlesByCategory(categoryId: number): Observable<Article[]> {
        return this.http.get<Article[]>(`${this.apiUrl}/Get-Articles/${categoryId}`).pipe(
            catchError(err => {
                return throwError(() => 'فشل تحميل المقالات');
            })
        );
    }

    // ================= SEARCH ARTICLES BY TITLE =================
    searchArticles(title: string): Observable<Article[]> {
        return this.http.get<Article[]>(`${this.apiUrl}/Search-Articles`, {
            params: { title }
        }).pipe(
            catchError(err => {
                return throwError(() => 'فشل البحث عن المقالات');
            })
        );
    }

    // ================= GET SINGLE ARTICLE =================
    getArticleById(id: number): Observable<Article> {
        return this.http.get<Article>(`${this.apiUrl}/Get-Article/${id}`).pipe(
            catchError(err => {
                return throwError(() => 'فشل تحميل المقال');
            })
        );
    }

    // ================= ARTICLE VIEWED =================
    markArticleViewed(articleId: number): Observable<boolean> {
        return this.http.post<boolean>(`${this.apiUrl}/Article-viewed`, null, {
            params: { articleId: articleId.toString() }
        }).pipe(
            catchError(err => {
                return throwError(() => 'فشل تسجيل المشاهدة');
            })
        );
    }

    // ================= ADD ARTICLE (USER) =================
    addArticleUser(
        title: string,
        content: string,
        image: File,
        categoryId: number,
        articleTagsIds: number[]
    ): Observable<any> {
        const formData = new FormData();
        formData.append('Title', title);
        formData.append('Content', content);
        formData.append('Image', image, image.name);
        formData.append('CategoryId', categoryId.toString());

        articleTagsIds.forEach(tagId => {
            formData.append('ArticleTagsIds', tagId.toString());
        });

        return this.http.post(`${this.apiUrl}/Add-Article-User`, formData, {
            headers: {
                'Authorization': `Bearer ${this.tokenService.getToken()}`
            }
        }).pipe(
            catchError(err => {
                const message = err.error?.errors?.[0] || err.error?.message || 'فشل إرسال المقال';
                return throwError(() => message);
            })
        );
    }
}
