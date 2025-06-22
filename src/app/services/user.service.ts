/**
 * Servicio de acceso a los endpoints relacionados con la entidad `User`.
 * 
 * Todos los métodos exponen `Observable` que deberán ser suscritos por los componentes o facades.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
    User,
    UserUpdateRequest,
    UserAvailabilityRequest,
    BackendMessage
} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    /** URL base */
    private readonly apiUrl = `${environment.apiUrl}/users`;

    constructor(private readonly http: HttpClient) {}

    // ---------------------------------------------------------------------
    // Métodos CRUD básicos
    // ---------------------------------------------------------------------

    /** GET /users → Recupera todos los usuarios */
    getAll(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    /** GET /users/{id} → Recupera un usuario por su ID */
    getById(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    /** GET /users/nombre-artistico/{nombre} → Recupera un usuario por nombre artístico */
    getByNombreArtistico(nombreArtistico: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/nombre-artistico/${encodeURIComponent(nombreArtistico)}`);
    }

    /** GET /users/genero/{genero} → Listar usuarios por género musical */
    getByGeneroMusical(genero: string): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/genero/${genero.toUpperCase()}`);
    }

    /** PUT /users/{id} → Actualiza los campos del usuario */
    updateUser(id: number, payload: UserUpdateRequest): Observable<BackendMessage> {
        return this.http.put<BackendMessage>(`${this.apiUrl}/${id}`, payload);
    }

    /** PATCH /users/{id}/disponibilidad → Actualizar solo disponibilidad */
    updateAvailability(id: number, disponibilidad: boolean): Observable<BackendMessage> {
        const body: UserAvailabilityRequest = { disponibilidad };
        return this.http.patch<BackendMessage>(`${this.apiUrl}/${id}/disponibilidad`, body);
    }

    /** DELETE /users/{id} → Elimina al usuario */
    deleteUser(id: number): Observable<BackendMessage> {
        return this.http.delete<BackendMessage>(`${this.apiUrl}/${id}`);
    }
} 