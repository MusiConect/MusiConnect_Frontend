export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    nombreArtistico: string;
    instrumentos?: string | null;
    bio?: string | null;
    ubicacion: string;
    disponibilidad?: boolean;
    roleId: number;
    generosMusicales?: string[];
}

export interface AuthResponse {
    mensaje: string;
    userId: number;
    nombreArtistico: string;
    token: string;
} 