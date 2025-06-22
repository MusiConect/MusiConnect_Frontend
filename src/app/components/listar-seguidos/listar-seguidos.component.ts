import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FollowService } from '../../services/follow.service';
import { SessionService } from '../../services/session.service';
import { FollowedProfile } from '../../models/follow.model';
import { UserService } from '../../services/user.service';

/** Vista para listar los perfiles que el usuario autenticado sigue actualmente. */
@Component({
    selector: 'app-listar-seguidos',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './listar-seguidos.component.html',
    styleUrl: './listar-seguidos.component.css'
})
export class ListarSeguidosComponent implements OnInit {
    /** Lista de perfiles seguidos */
    seguidos: Array<FollowedProfile & { bio?: string }> = [];

    constructor(
        private readonly followSvc: FollowService,
        private readonly session: SessionService,
        private readonly router: Router,
        private readonly userSvc: UserService
    ) {}

    ngOnInit(): void {
        const userId = this.session.getUserId();
        if (!userId) return;

        this.followSvc.listarPerfilesSeguidos(userId).subscribe({
            next: (lista) => {
                this.seguidos = lista;
                // Enriquecer con biografía si es un usuario
                lista.forEach((p) => {
                    if (p.tipo === 'Usuario') {
                        this.userSvc.getById(p.id).subscribe({
                            next: (u) => {
                                const target = this.seguidos.find(s => s.id === p.id);
                                if (target) target.bio = u.bio || undefined;
                            },
                            error: () => {}
                        });
                    }
                });
            },
            error: (err) => console.error(err)
        });
    }

    /** Navega a la vista de perfil del seguido (solo usuarios por ahora) */
    verPerfil(seg: FollowedProfile): void {
        if (seg.tipo === 'Usuario') {
            this.router.navigate(['/ver-perfil', seg.id]);
        }
        // TODO: Ruta para bandas cuando exista.
    }
} 