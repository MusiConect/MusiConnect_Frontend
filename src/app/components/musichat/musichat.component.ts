import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MusichatService } from '../../services/musichat.service';
import { ChatMessage } from '../../models/musichat.model';
import { SessionService } from '../../services/session.service';

@Component({
    selector: 'app-musichat',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './musichat.component.html',
    styleUrls: ['./musichat.component.css']
})
export class MusichatComponent implements OnInit {
    chatOpen = false;

    messageText = '';

    messages: ChatMessage[] = [
        {
            text: 'Hola! soy MusiChat, el bot oficial de MusiConnect, en que puedo ayudarte el día de hoy?',
            from: 'bot'
        }
    ];

    /** Indica si el bot está generando una respuesta */
    isLoading = false;

    constructor(private chatService: MusichatService, private session: SessionService) {}

    ngOnInit(): void {
        this.sendIntroPromptIfNeeded();
    }

    /**
     * Envía un mensaje inicial oculto al backend para establecer contexto.
     * Solo se envía una vez por usuario (persistido en localStorage).
     */
    private sendIntroPromptIfNeeded(): void {
        const userId = this.session.getUserId();
        if (!userId) {
            return; // No enviar a usuarios anónimos
        }

        const storageKey = `musichat_intro_sent_${userId}`;
        if (localStorage.getItem(storageKey)) {
            return; // ya se envió antes
        }

        const prompt =
            ' ';

        // Enviamos el prompt pero ignoramos la respuesta.
        this.chatService.sendMessage(prompt).subscribe({
            next: () => {
                localStorage.setItem(storageKey, '1');
            },
            error: () => {
                // Si falla, no guardamos la marca para reintentar en la siguiente visita
            }
        });
    }

    toggleChat(): void {
        this.chatOpen = !this.chatOpen;
    }

    sendMessage(): void {
        const trimmed = this.messageText.trim();
        if (!trimmed) {
            return;
        }

        // Añade el mensaje del usuario inmediatamente
        this.messages.push({ text: trimmed, from: 'user' });
        this.messageText = '';

        // Inicia animación de carga
        this.isLoading = true;

        // Llama al servicio para obtener la respuesta del bot
        this.chatService.sendMessage(trimmed).subscribe({
            next: (respuesta) => {
                this.isLoading = false;
                this.messages.push({ text: respuesta, from: 'bot' });
            },
            error: () => {
                this.isLoading = false;
                this.messages.push({
                    text: 'Lo siento, ha ocurrido un error al procesar tu mensaje 😔',
                    from: 'bot'
                });
            }
        });
    }
} 