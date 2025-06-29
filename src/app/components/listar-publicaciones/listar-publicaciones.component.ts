import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';
import { Post } from '../../models/post.model';
import { ListarComentariosComponent } from '../listar-comentarios/listar-comentarios.component';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-listar-publicaciones',
  standalone: true,
  imports: [CommonModule, ListarComentariosComponent],
  templateUrl: './listar-publicaciones.component.html',
  styleUrl: './listar-publicaciones.component.css'
})
export class ListarPublicacionesComponent implements OnInit {
  publicaciones: Post[] = [];
  cargando: boolean = true;
  error: string = '';
  expandedPostId: number | null = null;
  /* ------------------  mensajes ------------------ */
  mensajeAccion = '';
  tipoMensaje: 'success' | 'error' = 'success';

  constructor(
    private postService: PostService,
    private router: Router,
    public sessionService: SessionService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.cargarPublicaciones();
  }

  cargarPublicaciones(): void {
    this.cargando = true;
    this.error = '';

    this.postService.listarPosts().subscribe({
      next: (response) => {
        this.publicaciones = response || [];
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar las publicaciones.';
        this.cargando = false;
      }
    });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  toggleComentarios(postId: number): void {
    this.expandedPostId = this.expandedPostId === postId ? null : postId;
  }

  actualizarConteoComentarios(publicacion: Post, total: number): void {
    // Actualiza solo la longitud sin almacenar todos los comentarios
    publicacion.comentarios = new Array(total) as any;
  }

  editarPost(postId: number): void {
    this.router.navigate(['/editar-publicacion', postId]);
  }

  // Agrego método para eliminar publicación
  eliminarPost(postId: number): void {
    const usuarioId = this.sessionService.getUserId();
    if (!usuarioId) {
      return;
    }

    const confirmado = confirm('¿Está seguro de que desea eliminar la publicación?');
    if (!confirmado) {
      return;
    }

    this.postService.eliminarPost(postId, usuarioId).subscribe({
      next: () => {
        this.publicaciones = this.publicaciones.filter(p => p.postId !== postId);
        this.tipoMensaje = 'success';
        this.mensajeAccion = 'Publicación eliminada correctamente.';
        setTimeout(() => (this.mensajeAccion = ''), 3000);
      },
      error: () => {
        this.tipoMensaje = 'error';
        this.mensajeAccion = 'Error al eliminar la publicación.';
        setTimeout(() => (this.mensajeAccion = ''), 3000);
      }
    });
  }

  verPerfil(autorId?: number, nombreAutor?: string): void {
    if (autorId) {
      this.router.navigateByUrl(`/ver-perfil/${autorId}`);
      return;
    }

    if (!nombreAutor) {
      return;
    }

    this.userService.getByNombreArtistico(nombreAutor).subscribe({
      next: (user) => {
        const id = (user as any).userId ?? (user as any).id;
        if (id) {
          this.router.navigateByUrl(`/ver-perfil/${id}`);
        }
      },
      error: () => {}
    });
  }
} 