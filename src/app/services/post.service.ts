import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
    Post,
    PostCreate,
    PostResponse,
    PostUpdate
} from '../models/post.model';
import { Comentario, ComentarioCreate, ComentarioResponse } from '../models/comentario.model';

@Injectable({ providedIn: 'root' })
export class PostService {
    private apiUrl = `${environment.apiUrl}/posts`;

    constructor(private http: HttpClient) {}

    // POSTS -------------------------------------------------------------
    listarPosts(): Observable<PostResponse[]> {
        return this.http.get<PostResponse[]>(this.apiUrl);
    }

    obtenerPost(id: number): Observable<PostResponse> {
        return this.http.get<PostResponse>(`${this.apiUrl}/${id}`);
    }

    crearPost(dto: PostCreate): Observable<PostResponse> {
        return this.http.post<PostResponse>(this.apiUrl, dto);
    }

    editarPost(id: number, dto: PostUpdate): Observable<PostResponse> {
        return this.http.put<PostResponse>(`${this.apiUrl}/${id}`, dto);
    }

    eliminarPost(id: number, usuarioId: number): Observable<void> {
        const params = new HttpParams().set('usuarioId', usuarioId);
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { params });
    }

    // COMENTARIOS -------------------------------------------------------
    listarComentarios(postId: number): Observable<ComentarioResponse[]> {
        return this.http.get<ComentarioResponse[]>(`${this.apiUrl}/${postId}/comments`);
    }

    crearComentario(postId: number, dto: ComentarioCreate): Observable<ComentarioResponse> {
        return this.http.post<ComentarioResponse>(`${this.apiUrl}/${postId}/comment`, dto);
    }

    editarComentario(comentarioId: number, dto: ComentarioCreate): Observable<ComentarioResponse> {
        return this.http.put<ComentarioResponse>(`${this.apiUrl}/comments/${comentarioId}`, dto);
    }

    eliminarComentario(comentarioId: number, usuarioId: number): Observable<void> {
        const params = new HttpParams().set('usuarioId', usuarioId);
        return this.http.delete<void>(`${this.apiUrl}/comments/${comentarioId}`, { params });
    }
} 