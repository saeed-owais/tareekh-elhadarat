import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { CLAIMS } from '../constants/claims.constant';
import { DecodedToken } from '../models/decoded-token.model';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    private TOKEN_KEY = 'token';

    // ================= SAVE =================
    saveToken(token: string) {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    // ================= GET =================
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    // ================= CLEAR =================
    clear() {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    // ================= DECODE =================
    private decode(): DecodedToken | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const payload = token.split('.')[1];
            const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
            return JSON.parse(decodedPayload);
        } catch {
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