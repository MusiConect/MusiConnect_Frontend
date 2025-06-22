/**
 * Servicio de acceso a los endpoints /follow.
 *
 * Todos los métodos devuelven Observables que deben ser manejados por los componentes.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
    FollowCreate,
    FollowResponse,
    UnfollowRequest,
    FollowedProfile
} from '../models/follow.model';

@Injectable({ providedIn: 'root' })
export class FollowService {
    /** URL base para los endpoints de seguimiento */
    private readonly apiUrl = `${environment.apiUrl}/follow`;

    constructor(private http: HttpClient) {}

    /** POST /follow */
    crearFollow(payload: FollowCreate): Observable<FollowResponse> {
        return this.http.post<FollowResponse>(this.apiUrl, payload);
    }

    /** GET /follow/{userId}/following */
    listarPerfilesSeguidos(userId: number): Observable<FollowedProfile[]> {
        return this.http.get<FollowedProfile[]>(`${this.apiUrl}/${userId}/following`);
    }

    /** DELETE /follow */
    eliminarFollow(payload: UnfollowRequest): Observable<{ message: string }> {
        // DELETE con body requiere el uso de request genérico
        return this.http.request<{ message: string }>('delete', this.apiUrl, {
            body: payload
        });
    }
} 