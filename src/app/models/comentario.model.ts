export interface Comentario {
    comentarioId: number;
    contenido: string;
    fechaComentario: string; // ISO-8601
    autor: string;
}

export interface ComentarioCreate {
    usuarioId: number;
    contenido: string;
}

export interface ComentarioResponse {
    comentarioId: number;
    contenido: string;
    fechaComentario: string;
    autor: string;
    message?: string;
} 