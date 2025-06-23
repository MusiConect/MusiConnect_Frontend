import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { PostUpdate } from '../../models/post.model';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-editar-publicacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-publicacion.component.html',
  styleUrl: './editar-publicacion.component.css'
})
export class EditarPublicacionComponent implements OnInit {
  publicacionId: number = 0;
  contenido: string = '';
  mensaje: string = '';
  cargando: boolean = false;
  cargandoInicial: boolean = true;
  error: string = '';

  constructor(
    private postService: PostService,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.publicacionId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.publicacionId) {
      this.cargarPublicacion();
    } else {
      this.error = 'ID de publicación no válido.';
      this.cargandoInicial = false;
    }
  }

  private cargarPublicacion(): void {
    this.postService.obtenerPost(this.publicacionId).subscribe({
      next: (response) => {
        this.contenido = response.contenido;
        this.cargandoInicial = false;
      },
      error: () => {
        this.error = 'Error al cargar la publicación.';
        this.cargandoInicial = false;
      }
    });
  }

  actualizar(): void {
    if (!this.contenido.trim()) {
      this.mensaje = '❌ El contenido no puede estar vacío.';
      return;
    }

    if (this.contenido.length > 500) {
      this.mensaje = '❌ El contenido no puede superar los 500 caracteres.';
      return;
    }

    this.cargando = true;
    const usuarioId = this.sessionService.getUserId() ?? 0;
    const publicacionActualizada: PostUpdate = {
      contenido: this.contenido.trim(),
      usuarioId,
    };

    this.postService.editarPost(this.publicacionId, publicacionActualizada).subscribe({
      next: () => {
        this.mensaje = '✅ Publicación actualizada exitosamente.';
        this.cargando = false;

        setTimeout(() => this.router.navigate(['/publicaciones']), 2000);
      },
      error: (error) => {
        this.mensaje = error.error?.message
          ? `❌ ${error.error.message}`
          : '❌ Error al actualizar la publicación.';
        this.cargando = false;

        setTimeout(() => (this.mensaje = ''), 5000);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/publicaciones']);
  }
} 