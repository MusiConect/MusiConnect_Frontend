import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { SignupRequest, AuthResponse, LoginRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private api: ApiService) {}

    /**
     * Realiza el registro de un usuario.
     */
    register(payload: SignupRequest): Observable<AuthResponse> {
        return this.api.post<AuthResponse>('/auth/signup', payload);
    }

    /** Inicia sesión */
    login(payload: LoginRequest): Observable<AuthResponse> {
        return this.api.post<AuthResponse>('/auth/login', payload);
    }
} 