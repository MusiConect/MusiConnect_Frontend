import { Comentario } from './comentario.model';

export type PostTipo = 'TEXTO';

export interface Post {
    postId: number;
    contenido: string;
    tipo: PostTipo;
    fechaPublicacion: string; // ISO-8601
    autor: string;
    autorId?: number;
    comentarios?: Comentario[];
}

export interface PostCreate {
    usuarioId: number;
    contenido: string;
    tipo: PostTipo;
}

export interface PostUpdate {
    usuarioId: number;
    contenido: string;
}

export interface PostResponse {
    postId: number;
    contenido: string;
    tipo: PostTipo;
    fechaPublicacion: string;
    autor: string;
    comentarios: Comentario[];
    message: string;
} 