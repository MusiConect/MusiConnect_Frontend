export interface ChatMessage {
    /**
     * Texto del mensaje a mostrar en la burbuja.
     */
    text: string;

    /**
     * Origen del mensaje: 'bot' para MusiChat o 'user' para el usuario.
     */
    from: 'bot' | 'user';
} 