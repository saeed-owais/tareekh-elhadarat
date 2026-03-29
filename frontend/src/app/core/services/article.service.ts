import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    private baseUrl = 'http://modawanty.runasp.net/api/Articles';

    constructor(
        private http: HttpClient,
        private tokenService: TokenService
    ) { }

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

        return this.http.post(`${this.baseUrl}/Add-Article-User`, formData, {
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
