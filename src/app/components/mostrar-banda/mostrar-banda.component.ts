import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BandService } from '../../services/band.service';
import { BandResponse } from '../../models/band.model';
import { SessionService } from '../../services/session.service';
import { FollowService } from '../../services/follow.service';
import { FollowCreate, UnfollowRequest } from '../../models/follow.model';

/** Vista para mostrar la información detallada de una banda */
@Component({
    selector: 'app-mostrar-banda',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './mostrar-banda.component.html',
    styleUrl: './mostrar-banda.component.css'
})
export class MostrarBandaComponent implements OnInit {
    /** Banda cargada */
    banda = signal<BandResponse | null>(null);
    miembros = signal<string[]>([]);

    /** El usuario autenticado es administrador de la banda */
    readonly esAdmin = computed(() => {
        const nombre = this.session.getNombreArtistico();
        return nombre !== null && this.banda()?.administradorNombreArtistico === nombre;
    });

    constructor(
        private readonly route: ActivatedRoute,
        private readonly bandSvc: BandService,
        private readonly session: SessionService,
        private readonly router: Router,
        private readonly followSvc: FollowService
    ) {}

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        const bandId = idParam ? +idParam : null;
        if (!bandId) {
            this.router.navigate(['/home']);
            return;
        }

        this.bandSvc.obtenerBandaPorId(bandId).subscribe({
            next: (b) => this.banda.set(b),
            error: () => this.router.navigate(['/home'])
        });

        // Obtener miembros
        this.bandSvc.obtenerMiembros(bandId).subscribe({
            next: (list) => this.miembros.set(list),
            error: () => {}
        });
    }

    /** Ir a editar banda */
    editarBanda(): void {
        if (this.esAdmin()) {
            this.router.navigate(['/editar-banda', this.banda()?.bandId]);
        }
    }

    /** Seguir/dejar de seguir banda */
    seguirBanda(): void {
        const followerId = this.session.getUserId();
        const band = this.banda();
        if (!followerId || !band) return;

        const payload: FollowCreate = { followerId, followedBandId: band.bandId };
        this.followSvc.crearFollow(payload).subscribe({
            next: (res) => window.alert(res.message),
            error: (err) => {
                const mensaje: string | undefined = err?.error?.error;
                if (mensaje && mensaje.includes('Ya sigues')) {
                    // Unfollow
                    const unfollow: UnfollowRequest = { followerId, followedBandId: band.bandId };
                    this.followSvc.eliminarFollow(unfollow).subscribe({
                        next: (r) => window.alert(r.message),
                        error: () => window.alert('Error al dejar de seguir la banda.')
                    });
                } else {
                    window.alert(mensaje ?? 'Error al seguir banda.');
                }
            }
        });
    }

    /** Sus géneros como lista */
    get generos(): string[] {
        return this.banda()?.generosMusicales ?? [];
    }

    /** Acceso a miembros como array */
    get listaMiembros(): string[] {
        return this.miembros();
    }
} 