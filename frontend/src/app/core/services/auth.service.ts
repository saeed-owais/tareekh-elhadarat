import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { TokenService } from './token.service';
import { LoginRequest } from '../models/login.model';
import { AuthResponse } from '../models/auth-response.model';
import { ApiResponse } from '../models/api-response.model';
import { RegisterRequest } from '../models/register.model';
import { ChangePasswordRequest } from '../models/change-password.model';
import { ResetPasswordRequest } from '../models/reset-password.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private baseUrl = `${environment.apiBaseUrl}/api/Auth`;

    constructor(
        private http: HttpClient,
        private tokenService: TokenService
    ) { }

    // ================= LOGIN =================
    login(data: LoginRequest, rememberMe: boolean = false): Observable<string> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data).pipe(
            tap(res => {
                if (res.isSuccess) {
                    this.tokenService.saveToken(res.data.jwtToken, rememberMe);
                }
            }),
            map(res => res.data.jwtToken),
            catchError(err => {
                const errors = err.error || (err.message ? [err.message] : ['فشل تسجيل الدخول']);
                return throwError(() => Array.isArray(errors) ? errors : [errors]);
            })
        );
    }

    // ================= REGISTER =================
    register(data: RegisterRequest): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/register`, data).pipe(
            catchError(err => {
                const errors = err.error || (err.message ? [err.message] : ['فشل إنشاء الحساب']);
                return throwError(() => Array.isArray(errors) ? errors : [errors]);
            })
        );
    }

    // ================= CHANGE PASSWORD =================
    changePassword(data: ChangePasswordRequest): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/change-password`, data).pipe(
            catchError(err => {
                const errors = err.error || (err.message ? [err.message] : ['فشل تغيير كلمة المرور']);
                return throwError(() => Array.isArray(errors) ? errors : [errors]);
            })
        );
    }

    // ================= REQUEST RESET PASSWORD =================
    requestResetPassword(email: string): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/request-reset-password`, { email }).pipe(
            catchError(err => {
                const errors = err.error || (err.message ? [err.message] : ['فشل إرسال طلب إعادة التعيين']);
                return throwError(() => Array.isArray(errors) ? errors : [errors]);
            })
        );
    }

    // ================= RESET PASSWORD =================
    resetPassword(data: ResetPasswordRequest): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/reset-password`, data).pipe(
            catchError(err => {
                const errors = err.error || (err.message ? [err.message] : ['فشل إعادة تعيين كلمة المرور']);
                return throwError(() => Array.isArray(errors) ? errors : [errors]);
            })
        );
    }

    // ================= CONFIRM EMAIL =================
    confirmEmail(userId: string, token: string): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(
            `${this.baseUrl}/confirm-email?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`,
            null
        ).pipe(
            catchError(err => {
                const message = err.error || 'فشل تأكيد البريد الإلكتروني';
                return throwError(() => message);
            })
        );
    }

    // ================= RESEND CONFIRMATION =================
    resendConfirmation(email: string): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(
            `${this.baseUrl}/resend-confirmation?email=${encodeURIComponent(email)}`,
            null
        ).pipe(
            catchError(err => {
                const message = err.error || 'فشل إعادة إرسال رسالة التأكيد';
                return throwError(() => message);
            })
        );
    }

    // ================= LOGOUT =================
    logout() {
        this.tokenService.clear();
    }

    // ================= USER HELPERS =================
    getUser() {
        return this.tokenService.getUser();
    }

    isLoggedIn() {
        return this.tokenService.isLoggedIn();
    }
}