import { Injectable } from '@angular/core';
import { AuthResponse } from '../models/auth.model';
import { Role } from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
    private readonly TOKEN_KEY = 'token';
    private readonly USER_ID_KEY = 'userId';
    private readonly NOMBRE_KEY = 'nombreArtistico';
    private readonly ROLE_KEY = 'role';

    /** Guarda token y datos básicos del usuario */
    setSession(res: AuthResponse): void {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_ID_KEY, res.userId.toString());
        localStorage.setItem(this.NOMBRE_KEY, res.nombreArtistico);
        // Intentamos extraer el rol del token.
        const role = this.extractRole(res.token);
        if (role) {
            localStorage.setItem(this.ROLE_KEY, role);
        }
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

    /** Rol del usuario autenticado o null */
    getRole(): Role | null {
        // Primero intentamos leerlo del almacenamiento.
        const stored = localStorage.getItem(this.ROLE_KEY);
        if (stored === Role.MUSICO || stored === Role.PRODUCTOR) {
            return stored as Role;
        }
        // Si no está, intentamos decodificar de nuevo.
        const token = localStorage.getItem(this.TOKEN_KEY);
        if (!token) { return null; }
        return this.extractRole(token);
    }

    /** Decodifica el JWT y devuelve el rol si existe. */
    private extractRole(token: string): Role | null {
        const payload = token.split('.')[1];
        if (!payload) { return null; }
        try {
            const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
            // Posibles convenciones de backend
            if (json.role === Role.MUSICO || json.role === Role.PRODUCTOR) {
                return json.role as Role;
            }
            if (json.roleId === 2) { return Role.MUSICO; }
            if (json.roleId === 3) { return Role.PRODUCTOR; }
        } catch {
            return null; // Si falla la decodificación
        }
        return null;
    }
} 