import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Collaboration } from '../models/collaboration.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  private apiUrl = 'http://localhost:8081/api/v1/collaborations';

  constructor(private http: HttpClient) {}

  crearColaboracion(data: Collaboration): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
