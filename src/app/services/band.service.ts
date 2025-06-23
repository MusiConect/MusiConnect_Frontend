import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AddMemberRequest, BandRequest, BandResponse, BandUpdateRequest } from '../models/band.model';
import { BackendMessage } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class BandService {

    /** Endpoint base derivado del entorno */
    private readonly apiUrl = `${environment.apiUrl}/bands`;
  
    constructor(private http: HttpClient) { }
  
    // Crear banda
    crearBanda(request: BandRequest): Observable<BandResponse> {
      return this.http.post<BandResponse>(`${this.apiUrl}`, request);
    }
  
    // Agregar miembro a una banda
    addMiembro(bandId: number, request: AddMemberRequest): Observable<BackendMessage> {
      return this.http.post<BackendMessage>(`${this.apiUrl}/${bandId}/members`, request);
    }
  
    // Actualizar banda
    updateBanda(bandId: number, request: BandUpdateRequest): Observable<BackendMessage> {
      return this.http.put<BackendMessage>(`${this.apiUrl}/${bandId}`, request);
    }
  
    // Obtener todas las bandas
    obtenerBandas(): Observable<BandResponse[]> {
      return this.http.get<BandResponse[]>(`${this.apiUrl}`);
    }
  
    // Obtener una banda por ID
    obtenerBandaPorId(bandId: number): Observable<BandResponse> {
      return this.http.get<BandResponse>(`${this.apiUrl}/${bandId}`);
    }
  
    // Eliminar banda (requiere adminId como query param)
    eliminarBanda(bandId: number, adminId: number): Observable<BackendMessage> {
      const params = new HttpParams().set('adminId', adminId.toString());           
      return this.http.delete<BackendMessage>(`${this.apiUrl}/${bandId}`, { params });
    }
  
    // Obtener todos los miembros de una banda
    obtenerMiembros(bandId: number): Observable<string[]> {
      return this.http.get<string[]>(`${this.apiUrl}/${bandId}/members`);
    }
  
    // Obtener un miembro específico por su ID
    obtenerMiembroPorId(bandId: number, miembroId: number): Observable<string> {
      return this.http.get<string>(`${this.apiUrl}/${bandId}/members/${miembroId}`);
    }
  }