import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
                    console.log(res);
                    
                }
            }),
            map(res => res.data.jwtToken),
            catchError(err => this.handleErrors(err, 'فشل تسجيل الدخول'))
        );
    }

    // ================= REGISTER =================
    register(data: RegisterRequest): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/register`, data).pipe(
            catchError(err => this.handleErrors(err, 'فشل إنشاء الحساب'))
        );
    }

    // ================= CHANGE PASSWORD =================
    changePassword(data: ChangePasswordRequest): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/change-password`, data).pipe(
            catchError(err => this.handleErrors(err, 'فشل تغيير كلمة المرور'))
        );
    }

    // ================= REQUEST RESET PASSWORD =================
    requestResetPassword(email: string): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/request-reset-password`, { email }).pipe(
            catchError(err => this.handleErrors(err, 'فشل إرسال طلب إعادة التعيين'))
        );
    }

    // ================= RESET PASSWORD =================
    resetPassword(data: ResetPasswordRequest): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/reset-password`, data).pipe(
            catchError(err => this.handleErrors(err, 'فشل إعادة تعيين كلمة المرور'))
        );
    }

    // ================= CONFIRM EMAIL =================
    confirmEmail(userId: string, token: string): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(
            `${this.baseUrl}/confirm-email?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`,
            null
        ).pipe(
            catchError(err => this.handleErrors(err, 'فشل تأكيد البريد الإلكتروني'))
        );
    }

    // ================= RESEND CONFIRMATION =================
    resendConfirmation(email: string): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(
            `${this.baseUrl}/resend-confirmation?email=${encodeURIComponent(email)}`,
            null
        ).pipe(
            catchError(err => this.handleErrors(err, 'فشل إعادة إرسال رسالة التأكيد'))
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

    private handleErrors(err: any, defaultMessage: string): Observable<never> {
        // If the error was pre-handled by the interceptor (like status 0)
        // it might already be an array of strings.
        if (Array.isArray(err)) {
            return throwError(() => err);
        }

        let errors: string[] = [];

        if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
                // If the backend didn't provide a specific message, use the one requested by the user
                const backendMsg = err.error?.message || err.error;
                errors = [typeof backendMsg === 'string' ? backendMsg : 'البريد الإلكتروني أو كلمة المرور غير صحيحة'];
            } else if (err.error) {
                if (err.error.errors) {
                    // ASP.NET ValidationProblemDetails
                    errors = Object.values(err.error.errors).flat() as string[];
                } else if (typeof err.error === 'string') {
                    errors = [err.error];
                } else if (err.error.message) {
                    errors = [err.error.message];
                }
            }
        }

        // Fallback to error message or default message
        if (errors.length === 0) {
            errors = [err.message || defaultMessage];
        }

        return throwError(() => errors);
    }
}