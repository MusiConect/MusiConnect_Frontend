import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MusichatService } from '../../services/musichat.service';
import { ChatMessage } from '../../models/musichat.model';

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

    constructor(private chatService: MusichatService) {}

    ngOnInit(): void {
        // Inicialización vacía; se eliminó la lógica de prompt inicial oculto
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