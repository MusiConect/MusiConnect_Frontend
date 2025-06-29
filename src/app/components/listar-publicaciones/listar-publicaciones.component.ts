import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Router, RouterModule } from '@angular/router';
import { Post } from '../../models/post.model';
import { ListarComentariosComponent } from '../listar-comentarios/listar-comentarios.component';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-publicaciones',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ListarComentariosComponent],
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
  /** Fecha mínima seleccionada para filtrar publicaciones (ISO yyyy-MM-dd) */
  fechaFiltro: string = '';

  /** Paginación */
  readonly POSTS_POR_PAGINA = 4;
  currentPage: number = 1;

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
        this.publicaciones = (response || []).sort((a, b) => {
          const fA = new Date(a.fechaPublicacion).getTime();
          const fB = new Date(b.fechaPublicacion).getTime();
          return fB - fA; // descendente: más reciente primero
        });
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

  /** Lista de publicaciones que cumplen con el filtro de fecha seleccionado */
  get publicacionesFiltradas(): Post[] {
    if (!this.fechaFiltro) return this.publicaciones;

    // Convertimos 'YYYY-MM-DD' → 20250629 sin crear objeto Date (evitamos zona horaria)
    const minimo = +this.fechaFiltro.replaceAll('-', '');

    const toNumber = (d: Date) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();

    return this.publicaciones.filter((p) => {
      const fechaPub = new Date(p.fechaPublicacion);
      const numPub = toNumber(fechaPub);
      return numPub >= minimo;
    });
  }

  /** Limpia la fecha de filtro para mostrar todas las publicaciones */
  clearFilter(): void {
    this.fechaFiltro = '';
    this.currentPage = 1;
  }

  /* -------------------- paginación -------------------- */
  /** Número total de páginas según el filtro actual */
  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.publicacionesFiltradas.length / this.POSTS_POR_PAGINA));
  }

  /** Array auxiliar para iterar en plantilla */
  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  /** Subconjunto de publicaciones a mostrar en la página actual */
  get publicacionesPagina(): Post[] {
    const inicio = (this.currentPage - 1) * this.POSTS_POR_PAGINA;
    return this.publicacionesFiltradas.slice(inicio, inicio + this.POSTS_POR_PAGINA);
  }

  /** Navega a la página indicada */
  irAPagina(p: number): void {
    if (p >= 1 && p <= this.totalPaginas) {
      this.currentPage = p;
    }
  }

  paginaAnterior(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  paginaSiguiente(): void {
    if (this.currentPage < this.totalPaginas) {
      this.currentPage++;
    }
  }
} 