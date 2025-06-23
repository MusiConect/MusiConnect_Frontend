import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { SessionService } from '../../services/session.service';
import { PostCreate } from '../../models/post.model';

@Component({
  selector: 'app-crear-publicacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-publicacion.component.html',
  styleUrl: './crear-publicacion.component.css'
})
export class CrearPublicacionComponent {
  contenido: string = '';
  mensaje: string = '';
  cargando: boolean = false;

  constructor(
    private postService: PostService,
    private sessionService: SessionService
  ) {}

  publicar() {
    if (!this.contenido.trim()) {
      this.mensaje = '❌ El contenido no puede estar vacío.';
      return;
    }

    if (this.contenido.length > 500) {
      this.mensaje = '❌ El contenido no puede superar los 500 caracteres.';
      return;
    }

    this.cargando = true;
    const userId = this.sessionService.getUserId();

    if (!userId) {
      this.mensaje = '❌ Error: Usuario no autenticado.';
      this.cargando = false;
      return;
    }

    const nuevaPublicacion: PostCreate = {
      contenido: this.contenido.trim(),
      tipo: 'TEXTO',
      usuarioId: userId
    };

    this.postService.crearPost(nuevaPublicacion).subscribe({
      next: () => {
        this.mensaje = '✅ Publicación creada exitosamente.';

        // Limpiar formulario
        this.contenido = '';
        this.cargando = false;

        setTimeout(() => (this.mensaje = ''), 3000);
      },
      error: (error) => {
        this.mensaje = error.error?.message
          ? `❌ ${error.error.message}`
          : '❌ Error al crear la publicación.';
        this.cargando = false;

        setTimeout(() => (this.mensaje = ''), 5000);
      }
    });
  }
} 