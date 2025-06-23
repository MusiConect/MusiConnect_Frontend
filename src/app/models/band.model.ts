export interface BandRequest {
    nombre: string;
    descripcion: string;
    generos: string[];
    adminId: number;
  }

  export interface BandResponse {
    bandId: number;
    nombre: string;
    descripcion: string;
    administradorNombreArtistico: string;
    generosMusicales: string[];
    message: string;
  }

  export interface AddMemberRequest {
    userId: number;
    adminId: number;
  }

  /** Payload para actualizar una banda (PUT /bands/{id}) */
  export interface BandUpdateRequest extends BandRequest {}

  /** Lista simple de nombres artísticos devuelta por GET /bands/{id}/members */
  export type BandMembersResponse = string[];