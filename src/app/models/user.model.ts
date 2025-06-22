/** Modelos de datos para la entidad Usuario (User).  
 *  
 *  Cumple con las convenciones de nomenclatura, documentación y pruebas establecidas en el proyecto.  
 */

/** Representa un género musical asociado a un usuario */
export interface MusicGenre {
    /** Identificador único del género */
    generoId: number;
    /** Nombre del género en mayúsculas, según `MusicGenreEnum` */
    nombre: string;
}

/** Rol que puede poseer un usuario */
export interface Role {
    /** Identificador único del rol */
    roleId: number;
    /** Nombre del rol (`ADMIN`, `MUSICO`, `PRODUCTOR`) */
    name: string;
}

/** Modelo principal que mapea la entidad `User` devuelta por el backend */
export interface User {
    /** Identificador único */
    userId: number;
    /** Correo electrónico */
    email: string;
    /** Nombre artístico del usuario */
    nombreArtistico: string;
    /** Instrumentos que toca (cadena separada por comas) */
    instrumentos?: string | null;
    /** Biografía o descripción corta */
    bio?: string | null;
    /** Ubicación geográfica */
    ubicacion?: string | null;
    /** Disponibilidad para colaborar */
    disponibilidad?: boolean | null;
    /** Rol asignado */
    role: Role | string;
    /** Lista de géneros musicales favoritos */
    generosMusicales: MusicGenre[] | string[];
}

/** Payload para actualizar datos del usuario (PUT /users/{id}) */
export interface UserUpdateRequest {
    email?: string;
    bio?: string;
    ubicacion?: string;
    instrumentos?: string;
    disponibilidad?: boolean;
    /** Lista de géneros musicales en formato string que coincidan con `MusicGenreEnum` */
    generos?: string[];
}

/** Payload mínimo para modificar la disponibilidad (PATCH /users/{id}/disponibilidad) */
export interface UserAvailabilityRequest {
    /** Nueva disponibilidad */
    disponibilidad: boolean;
}

/** Respuesta genérica de operaciones que solo retornan un mensaje */
export interface BackendMessage {
    message: string;
} 