import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SessionService } from '../../services/session.service';
import { User } from '../../models/user.model';

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

    /** ¿El visitante está viendo su propio perfil? */
    readonly esPropio = computed(() => {
        const idActual = this.session.getUserId();
        return idActual !== null && this.usuario()?.userId === idActual;
    });

    constructor(
        private readonly route: ActivatedRoute,
        private readonly userService: UserService,
        private readonly session: SessionService,
        private readonly router: Router
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
            error: () => this.router.navigate(['/home'])
        });
    }

    /** Acción para editar el perfil propio */
    editarPerfil(): void {
        // Redirigimos a otro componente de edición (deberá existir). Por ahora, consola.
        console.log('Editar perfil (en construcción)');
    }

    /** Acción para seguir / dejar de seguir un usuario */
    seguirUsuario(): void {
        console.log('Seguir usuario (en construcción)');
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