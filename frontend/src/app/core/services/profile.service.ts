import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { UserProfile, SavedArticle } from "../models/user-profile.model";
import { environment } from "../../../environments/environment";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = `${environment.apiBaseUrl}/api/User`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    });
  }

  // ================= PROFILE MANAGEMENT =================

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/Get-Profile`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(err => throwError(() => 'فشل تحميل الملف الشخصي'))
    );
  }

  editProfile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/Edit-Profile`, formData, {
      headers: this.getHeaders()
    }).pipe(
      catchError(err => throwError(() => 'فشل تحديث الملف الشخصي'))
    );
  }

  // ================= SAVED ARTICLES (FAVORITES) =================

  getSavedArticles(): Observable<SavedArticle[]> {
    return this.http.get<SavedArticle[]>(`${this.apiUrl}/Get-Saved-Articles`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(err => throwError(() => 'فشل تحميل المقالات المحفوظة'))
    );
  }

  saveArticle(articleId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/Save-Article`, {}, {
      params: { articleId: articleId.toString() },
      headers: this.getHeaders()
    }).pipe(
      catchError(err => throwError(() => 'فشل حفظ المقال'))
    );
  }

  removeSavedArticle(articleId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/Remove-Saved-Article`, {}, {
      params: { articleId: articleId.toString() },
      headers: this.getHeaders()
    }).pipe(
      catchError(err => throwError(() => 'فشل إزالة المقال من المحفوظات'))
    );
  }
}