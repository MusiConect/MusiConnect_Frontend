/**
 * Servicio de acceso a los endpoints /convocations.
 * 
 * Todos los métodos devuelven Observables que deben ser manejados por los componentes.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
    ConvocationCreate,
    ConvocationUpdate,
    ConvocationResponse,
    FavoriteConvocation
} from '../models/convocation.model';

@Injectable({ providedIn: 'root' })
export class ConvocationService {
    /** URL base para los endpoints de convocatoria */
    private readonly apiUrl = `${environment.apiUrl}/convocations`;

    constructor(private http: HttpClient) {}

    /** POST /convocations */
    crearConvocatoria(data: ConvocationCreate): Observable<HttpResponse<ConvocationResponse>> {
        return this.http.post<ConvocationResponse>(this.apiUrl, data, { observe: 'response' });
    }

    /** PUT /convocations/{id} */
    editarConvocatoria(id: number, data: ConvocationUpdate): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, data);
    }

    /** GET /convocations */
    listarActivas(): Observable<ConvocationResponse[]> {
        return this.http.get<ConvocationResponse[]>(this.apiUrl);
    }

    /** GET /convocations/all */
    listarTodas(): Observable<ConvocationResponse[]> {
        return this.http.get<ConvocationResponse[]>(`${this.apiUrl}/all`);
    }

    /** GET /convocations/users/{userId}/favorites */
    listarFavoritasPorUsuario(userId: number): Observable<ConvocationResponse[]> {
        return this.http.get<ConvocationResponse[]>(`${this.apiUrl}/users/${userId}/favorites`);
    }

    /** POST /convocations/favorites */
    marcarComoFavorita(payload: FavoriteConvocation): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${this.apiUrl}/favorites`, payload);
    }

    /** DELETE /convocations/favorites */
    eliminarDeFavoritas(payload: FavoriteConvocation): Observable<{ message: string }> {
        // DELETE con body requiere "request" explícito
        return this.http.request<{ message: string }>('delete', `${this.apiUrl}/favorites`, {
            body: payload
        });
    }

    /** GET /convocations/{id} */
    obtenerPorId(id: number): Observable<ConvocationResponse> {
        return this.http.get<ConvocationResponse>(`${this.apiUrl}/${id}`);
    }

    /** DELETE /convocations/{id}?usuarioId=... */
    eliminarConvocatoria(id: number, usuarioId: number): Observable<{ message: string }> {
        const params = new HttpParams().set('usuarioId', usuarioId.toString());
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { params });
    }
} 