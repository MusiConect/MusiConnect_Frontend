/** Modelos de datos para la entidad Follow (seguimiento de perfiles). */

/** Para crear un seguimiento (POST /follow) */
export interface FollowCreate {
    /** ID del usuario que sigue */
    followerId: number;
    /** ID del usuario a seguir; opcional si se sigue a una banda */
    followedUserId?: number;
    /** ID de la banda a seguir; opcional si se sigue a un usuario */
    followedBandId?: number;
}

/** Para dejar de seguir (DELETE /follow) */
export interface UnfollowRequest {
    /** ID del usuario que deja de seguir */
    followerId: number;
    /** ID del usuario seguido; opcional si se deja de seguir a una banda */
    followedUserId?: number;
    /** ID de la banda seguida; opcional si se deja de seguir a un usuario */
    followedBandId?: number;
}

/** Respuesta al crear un follow */
export interface FollowResponse {
    followId: number;
    followerNombre: string;
    seguidoNombre: string;
    /** "Usuario" o "Banda" */
    tipoSeguido: string;
    /** Fecha ISO de creación del seguimiento */
    fechaSeguimiento: string;
    /** Mensaje devuelto por el backend */
    message: string;
}

/** Perfil seguido devuelto por GET /follow/{userId}/following */
export interface FollowedProfile {
    id: number;
    nombre: string;
    /** "Usuario" o "Banda" */
    tipo: string;
    disponible?: boolean | null;
    ubicacion?: string | null;
    imagen?: string | null;
} 