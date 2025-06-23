import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { SessionService } from '../../services/session.service';
import { ComentarioCreate } from '../../models/comentario.model';

@Component({
  selector: 'app-crear-comentario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-comentario.component.html',
  styleUrl: './crear-comentario.component.css'
})
export class CrearComentarioComponent {
  @Input('publicacionId') postId: number = 0;
  @Output() comentarioPublicado = new EventEmitter<void>();

  contenido: string = '';
  mensaje: string = '';
  cargando: boolean = false;

  constructor(
    private postService: PostService,
    private sessionService: SessionService
  ) {}

  publicarComentario() {
    if (!this.contenido.trim()) {
      this.mensaje = '❌ El comentario no puede estar vacío.';
      return;
    }

    if (this.contenido.length > 300) {
      this.mensaje = '❌ El comentario no puede superar los 300 caracteres.';
      return;
    }

    if (!this.postId) {
      this.mensaje = '❌ Error: ID de publicación no válido.';
      return;
    }

    this.cargando = true;
    const userId = this.sessionService.getUserId();

    if (!userId) {
      this.mensaje = '❌ Error: Usuario no autenticado.';
      this.cargando = false;
      return;
    }

    const nuevoComentario: ComentarioCreate = {
      contenido: this.contenido.trim(),
      usuarioId: userId
    };

    this.postService.crearComentario(this.postId, nuevoComentario).subscribe({
      next: () => {
        this.mensaje = '✅ Comentario publicado exitosamente.';

        // Limpiar el formulario
        this.contenido = '';
        this.cargando = false;

        // Notificar al contenedor para recargar lista
        this.comentarioPublicado.emit();

        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => {
          this.mensaje = '';
        }, 3000);
      },
      error: (error) => {
        this.mensaje = error.error?.message
          ? `❌ ${error.error.message}`
          : '❌ Error al publicar el comentario.';
        this.cargando = false;

        // Limpiar el mensaje después de 5 segundos
        setTimeout(() => {
          this.mensaje = '';
        }, 5000);
      }
    });
  }
} 