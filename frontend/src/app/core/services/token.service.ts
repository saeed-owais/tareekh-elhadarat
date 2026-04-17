import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../models/user.model';
import { CLAIMS } from '../constants/claims.constant';
import { DecodedToken } from '../models/decoded-token.model';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    private TOKEN_KEY = 'token';
    private platformId = inject(PLATFORM_ID);

    // ================= SAVE =================
    saveToken(token: string, rememberMe: boolean = false) {
        if (!isPlatformBrowser(this.platformId)) return;
        if (rememberMe) {
            localStorage.setItem(this.TOKEN_KEY, token);
        } else {
            sessionStorage.setItem(this.TOKEN_KEY, token);
        }
    }

    // ================= GET =================
    getToken(): string | null {
        if (!isPlatformBrowser(this.platformId)) return null;
        // Check localStorage first (remembered session)
        let token = localStorage.getItem(this.TOKEN_KEY);
        if (token) return token;

        // Fallback to sessionStorage (ephemeral session)
        return sessionStorage.getItem(this.TOKEN_KEY);
    }

    // ================= CLEAR =================
    clear() {
        if (!isPlatformBrowser(this.platformId)) return;
        localStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.removeItem(this.TOKEN_KEY);
    }

    // ================= DECODE =================
    private decode(): DecodedToken | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const payload = token.split('.')[1];
            // Fix: Use UTF-8 safe decoding instead of simple atob()
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const decodedPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            return JSON.parse(decodedPayload);
        } catch (error) {
            console.error('Token decoding failed:', error);
            return null;
        }
    }
    // ================= MAP TO USER =================
    getUser(): User | null {
        const decoded = this.decode();
        if (!decoded) return null;

        return {
            id: decoded[CLAIMS.userId],
            email: decoded.email,
            name: decoded[CLAIMS.name],
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            role: decoded[CLAIMS.role],
            profilePhoto: decoded.profilePhoto && decoded.profilePhoto !== 'null'
                ? decoded.profilePhoto
                : null,
            exp: decoded.exp
        };
    }

    // ================= CHECK LOGIN =================
    isLoggedIn(): boolean {
        const user = this.getUser();
        if (!user) return false;

        return user.exp * 1000 > Date.now();
    }
}