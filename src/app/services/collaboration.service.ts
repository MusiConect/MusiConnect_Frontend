import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CollaborationCreate } from '../models/collaboration.model';
import { CollaborationUpdate } from '../models/collaboration.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  private apiUrl = 'http://localhost:8081/api/v1/collaborations';

  constructor(private http: HttpClient) {}

  crearColaboracion(data: CollaborationCreate): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  /** GET /collaborations/{id} */
  getById(id: number): Observable<CollaborationUpdate> {
    return this.http.get<CollaborationUpdate>(`${this.apiUrl}/${id}`);
  }

  /** GET /collaborations/estados */
  getEstados(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/estados`);
  }

  /** PUT /collaborations/{id} */
  update(id: number, body: any): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, body);
  }

  /** PATCH /collaborations/{id}/add-member?nombreArtistico=... */
  addMember(id: number, nombreArtistico: string) {
    const params = new HttpParams().set('nombreArtistico', nombreArtistico);
    return this.http.patch<{ message: string }>(`${this.apiUrl}/${id}/add-member`, null, { params });
  }

  /** DELETE /collaborations/{id}/user/{userId} */
  delete(id: number, userId: number) {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/${id}/user/${userId}`
    );
  }
}
