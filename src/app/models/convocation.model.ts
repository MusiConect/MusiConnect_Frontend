/** Modelos de datos para la entidad Convocation. */

/** Para crear una convocatoria (POST) */
export interface ConvocationCreate {
    /** Identificador del usuario creador */
    usuarioId: number;
    /** Título de la convocatoria */
    titulo: string;
    /** Descripción (opcional) */
    descripcion?: string;
    /** Fecha límite en formato ISO yyyy-MM-dd */
    fechaLimite: string;
}

/** Para editar/leer una convocatoria (GET-by-id, PUT) */
export interface ConvocationUpdate {
    /** Propiedad devuelta por el backend al recuperar la convocatoria */
    convocationId?: number;
    /** Identificador del usuario que realiza la edición */
    usuarioId: number;
    /** Título de la convocatoria */
    titulo: string;
    /** Descripción (opcional) */
    descripcion?: string;
    /** Fecha límite en formato ISO yyyy-MM-dd */
    fechaLimite: string;
}

/** Respuesta principal del backend */
export interface ConvocationResponse {
    convocationId: number;
    titulo: string;
    descripcion: string;
    fechaLimite: string;
    creadorNombreArtistico: string;
    /** Mensaje adicional devuelto en algunos endpoints */
    message?: string;
}

/** Request para marcar o quitar favoritas */
export interface FavoriteConvocation {
    usuarioId: number;
    convocatoriaId: number;
} 