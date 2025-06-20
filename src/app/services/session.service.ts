import { Injectable } from '@angular/core';
import { AuthResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
    private readonly TOKEN_KEY = 'token';
    private readonly USER_ID_KEY = 'userId';
    private readonly NOMBRE_KEY = 'nombreArtistico';

    /** Guarda token y datos básicos del usuario */
    setSession(res: AuthResponse): void {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_ID_KEY, res.userId.toString());
        localStorage.setItem(this.NOMBRE_KEY, res.nombreArtistico);
    }

    /** Elimina cualquier dato de sesión */
    clearSession(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_ID_KEY);
        localStorage.removeItem(this.NOMBRE_KEY);
    }

    /** Id numérico del usuario autenticado o null */
    getUserId(): number | null {
        const raw = localStorage.getItem(this.USER_ID_KEY);
        return raw ? +raw : null;
    }

    /** Nombre artístico del usuario autenticado o null */
    getNombreArtistico(): string | null {
        return localStorage.getItem(this.NOMBRE_KEY);
    }

    /** Devuelve true si existe token válido en storage. */
    isLoggedIn(): boolean {
        return !!localStorage.getItem(this.TOKEN_KEY);
    }
} 