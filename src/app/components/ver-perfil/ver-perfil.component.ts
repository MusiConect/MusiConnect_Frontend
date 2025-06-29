import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SessionService } from '../../services/session.service';
import { User } from '../../models/user.model';
import { FollowService } from '../../services/follow.service';
import { FollowCreate, UnfollowRequest } from '../../models/follow.model';

@Component({
    selector: 'app-ver-perfil',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ver-perfil.component.html',
    styleUrl: './ver-perfil.component.css'
})
export class VerPerfilComponent implements OnInit {
    /** Datos del perfil cargado */
    usuario = signal<User | null>(null);

    /** Mensaje de seguimiento */
    mensajeSeguimiento = signal<string>('');

    /** Tipo de mensaje: 'success' o 'error' */
    tipoMensaje = signal<'success' | 'error'>('success');

    /** ¿El visitante está viendo su propio perfil? */
    readonly esPropio = computed(() => {
        const idActual = this.session.getUserId();
        return idActual !== null && this.usuario()?.userId === idActual;
    });

    constructor(
        private readonly route: ActivatedRoute,
        private readonly userService: UserService,
        private readonly session: SessionService,
        private readonly router: Router,
        private readonly followSvc: FollowService
    ) {}

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        const id = idParam ? +idParam : null;
        if (!id) {
            // Si no hay ID, redirigir a home.
            this.router.navigate(['/home']);
            return;
        }

        this.userService.getById(id).subscribe({
            next: (u) => this.usuario.set(u),
            error: (err) => {
                console.error('Error al cargar perfil:', err);
                // Solo redirigir si es un error 404 (usuario no encontrado)
                // No redirigir en caso de 401 para evitar loops
                if (err.status === 404) {
                    this.router.navigate(['/home']);
                }
            }
        });
    }

    /** Acción para editar el perfil propio */
    editarPerfil(): void {
        // Redirigimos a otro componente de edición (deberá existir). Por ahora, consola.
        if (this.esPropio()) {
            this.router.navigate(['/editar-perfil']);
        }
    }

    /** Acción para seguir / dejar de seguir un usuario */
    seguirUsuario(): void {
        const followerId = this.session.getUserId();
        const seguido = this.usuario();
        if (!followerId || !seguido) {
            return; // no hay sesión o usuario todavía
        }

        const followPayload: FollowCreate = {
            followerId,
            followedUserId: seguido.userId
        };

        this.followSvc.crearFollow(followPayload).subscribe({
            next: (res) => {
                this.tipoMensaje.set('success');
                this.mensajeSeguimiento.set(`Ahora sigues a ${seguido.nombreArtistico || 'este usuario'}`);
                // Limpiar el mensaje después de 3 segundos
                setTimeout(() => this.mensajeSeguimiento.set(''), 3000);
            },
            error: (err) => {
                const mensaje = err?.error?.error as string | undefined;
                if (mensaje && mensaje.includes('Ya sigues')) {
                    // Ya existe follow, entonces quitamos seguimiento
                    const unfollowPayload: UnfollowRequest = {
                        followerId,
                        followedUserId: seguido.userId
                    };
                    this.followSvc.eliminarFollow(unfollowPayload).subscribe({
                        next: (res) => {
                            this.tipoMensaje.set('error');
                            this.mensajeSeguimiento.set(`Ya no sigues a ${seguido.nombreArtistico || 'este usuario'}`);
                            // Limpiar el mensaje después de 3 segundos
                            setTimeout(() => this.mensajeSeguimiento.set(''), 3000);
                        },
                        error: (e2) => {
                            const msg2 = e2?.error?.error ?? 'Error al dejar de seguir.';
                            this.tipoMensaje.set('error');
                            this.mensajeSeguimiento.set(msg2);
                            // Limpiar el mensaje después de 3 segundos
                            setTimeout(() => this.mensajeSeguimiento.set(''), 3000);
                        }
                    });
                } else {
                    this.tipoMensaje.set('error');
                    this.mensajeSeguimiento.set(mensaje ?? 'Error al seguir usuario.');
                    // Limpiar el mensaje después de 3 segundos
                    setTimeout(() => this.mensajeSeguimiento.set(''), 3000);
                }
            }
        });
    }

    /** Devuelve la lista de instrumentos en base al campo de texto */
    get instrumentosLista(): string[] {
        const instrumentos = this.usuario()?.instrumentos ?? '';
        return instrumentos
            .split(',')
            .map((i) => i.trim())
            .filter(Boolean);
    }

    /** Lista de géneros en formato string (normalizado) */
    get generosLista(): string[] {
        const generosRaw = this.usuario()?.generosMusicales ?? [];
        return generosRaw.map((g: any) => typeof g === 'string' ? g : g.nombre);
    }

    /** Nombre del rol como string */
    get rolNombre(): string {
        const r = this.usuario()?.role;
        return typeof r === 'string' ? r : r?.name ?? '';
    }
} 