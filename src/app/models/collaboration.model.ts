/** Para crear una colaboración (POST) */
export interface CollaborationCreate {
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  usuarioId: number;
}

/** Para editar / leer una colaboración (GET-by-id, PUT) */
export interface CollaborationUpdate {
  colaboracionId: number;   // nombre exacto del backend
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  usuarioId: number;        // requerido al actualizar
}
