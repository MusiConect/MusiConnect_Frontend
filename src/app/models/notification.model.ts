export interface Notification {
    /** Identificador correlativo interno */
    id: number;

    /** Texto visible para el usuario */
    mensaje: string;

    /** Marca temporal de creación */
    fecha: Date;

    /** Indicador de lectura */
    leida: boolean;

    /** Tipo semántico opcional */
    tipo?: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
} 