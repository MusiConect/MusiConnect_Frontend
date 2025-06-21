import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MusichatService {
    private readonly chatUrl = `${environment.apiUrl}/ai-chat/chat`;

    constructor(private http: HttpClient) {}

    /**
     * Envía el texto del usuario al backend y devuelve la respuesta del bot.
     * @param prompt Texto introducido por el usuario.
     */
    sendMessage(prompt: string): Observable<string> {
        return this.http.post(this.chatUrl, prompt, { responseType: 'text' });
    }
} 