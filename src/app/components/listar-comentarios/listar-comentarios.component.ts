import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { PostService } from '../../services/post.service';
import { ComentarioResponse } from '../../models/comentario.model';
import { CrearComentarioComponent } from '../crear-comentario/crear-comentario.component';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-listar-comentarios',
    standalone: true,
    imports: [CommonModule, FormsModule, CrearComentarioComponent],
    templateUrl: './listar-comentarios.component.html',
    styleUrl: './listar-comentarios.component.css'
})
export class ListarComentariosComponent implements OnChanges {
    @Input() postId!: number;
    @Output() comentariosChanged = new EventEmitter<number>();

    comentarios: ComentarioResponse[] = [];
    cargando = true;
    error = '';
    editandoComentarioId: number | null = null;
    nuevoContenido: string = '';

    /* ------------------ mensajes ------------------ */
    mensajeAccion = '';
    tipoMensaje: 'success' | 'error' = 'success';

    constructor(
        private postService: PostService,
        public sessionService: SessionService,
        private router: Router,
        private userService: UserService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['postId'] && this.postId) {
            this.cargarComentarios();
        }
    }

    cargarComentarios(): void {
        this.cargando = true;
        this.error = '';
        this.postService.listarComentarios(this.postId).subscribe({
            next: (data) => {
                this.comentarios = data;
                this.cargando = false;
                this.comentariosChanged.emit(this.comentarios.length);
            },
            error: () => {
                this.error = 'Error al cargar comentarios.';
                this.cargando = false;
            }
        });
    }

    // Recarga lista tras comentario nuevo
    onComentarioPublicado(): void {
        this.cargarComentarios();
    }

    /* ------------------  ELIMINAR COMENTARIO ------------------ */
    eliminarComentario(comentarioId: number): void {
        const usuarioId = this.sessionService.getUserId();
        if (!usuarioId) {
            return;
        }

        const confirmado = confirm('¿Está seguro de eliminar este comentario?');
        if (!confirmado) {
            return;
        }

        this.postService.eliminarComentario(comentarioId, usuarioId).subscribe({
            next: () => {
                this.comentarios = this.comentarios.filter(c => c.comentarioId !== comentarioId);
                this.comentariosChanged.emit(this.comentarios.length);
            },
            error: () => {
                this.tipoMensaje = 'error';
                this.mensajeAccion = 'Error al eliminar el comentario.';
                setTimeout(() => (this.mensajeAccion = ''), 3000);
            }
        });
    }

    /* ------------------  EDITAR COMENTARIO ------------------ */
    activarEdicion(comentario: ComentarioResponse): void {
        this.editandoComentarioId = comentario.comentarioId;
        this.nuevoContenido = comentario.contenido;
    }

    confirmarEditarComentario(comentarioId: number): void {
        const usuarioId = this.sessionService.getUserId();
        if (!usuarioId || !this.nuevoContenido.trim()) {
            return;
        }

        this.postService.editarComentario(comentarioId, {
            usuarioId,
            contenido: this.nuevoContenido.trim()
        }).subscribe({
            next: () => {
                this.editandoComentarioId = null;
                this.nuevoContenido = '';
                this.cargarComentarios();
            },
            error: () => {
                this.tipoMensaje = 'error';
                this.mensajeAccion = 'Error al editar el comentario.';
                setTimeout(() => (this.mensajeAccion = ''), 3000);
            }
        });
    }

    /* ------------------  VER PERFIL DEL AUTOR ------------------ */
    verPerfilAutor(nombreAutor: string): void {
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