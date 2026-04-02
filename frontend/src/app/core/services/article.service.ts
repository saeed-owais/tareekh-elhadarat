import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { Article } from '../models/article.model';
import { PaginatedResponse } from '../models/paginated-response.model';
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
            map(article => this.cleanArticle(article)),
            catchError(err => {
                return throwError(() => 'فشل تحميل المقال المميز');
            })
        );
    }

    // ================= GET NEWEST ARTICLES =================
    getNewestArticles(): Observable<Article[]> {
        return this.http.get<Article[]>(`${this.apiUrl}/Get-Newest-Article`).pipe(
            map(articles => this.cleanArticles(articles)),
            catchError(err => {
                return throwError(() => 'فشل تحميل أحدث المقالات');
            })
        );
    }

    // ================= GET MOST VIEWED ARTICLES =================
    getMostViewedArticles(): Observable<Article[]> {
        return this.http.get<Article[]>(`${this.apiUrl}/Get-Most-Viewed-Article`).pipe(
            map(articles => this.cleanArticles(articles)),
            catchError(err => {
                return throwError(() => 'فشل تحميل المقالات الأكثر قراءة');
            })
        );
    }

    // ================= GET ARTICLES BY CATEGORY =================
    getArticlesByCategory(categoryId: number, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Article>> {
        return this.http.get<PaginatedResponse<Article>>(`${this.apiUrl}/Get-Articles/${categoryId}`, {
            params: { pageNumber: pageNumber.toString(), pageSize: pageSize.toString() }
        }).pipe(
            map(response => {
                response.data = this.cleanArticles(response.data);
                return response;
            }),
            catchError(err => {
                return throwError(() => 'فشل تحميل المقالات');
            })
        );
    }

    // ================= SEARCH ARTICLES BY TITLE =================
    searchArticles(title: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Article>> {
        return this.http.get<PaginatedResponse<Article>>(`${this.apiUrl}/Search-Articles`, {
            params: { title, pageNumber: pageNumber.toString(), pageSize: pageSize.toString() }
        }).pipe(
            map(response => {
                response.data = this.cleanArticles(response.data);
                return response;
            }),
            catchError(err => {
                return throwError(() => 'فشل البحث عن المقالات');
            })
        );
    }

    // ================= GET SINGLE ARTICLE =================
    getArticleById(id: number): Observable<Article> {
        return this.http.get<Article>(`${this.apiUrl}/Get-Article/${id}`).pipe(
            map(article => this.cleanArticle(article)),
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
    // ================= HELPER METHODS (TEMPORARY FIX FOR IMAGE URLS) =================
    private cleanArticle(article: Article): Article {
        if (article && typeof article.imageUrl === 'string') {
            if (article.imageUrl.includes('/https://')) {
                const parts = article.imageUrl.split('/https://');
                article.imageUrl = 'https://' + parts[1];
            } else if (article.imageUrl.includes('/http://')) {
                const parts = article.imageUrl.split('/http://');
                article.imageUrl = 'http://' + parts[1];
            }
        }
        return article;
    }

    private cleanArticles(articles: Article[]): Article[] {
        return articles.map(a => this.cleanArticle(a));
    }
}
