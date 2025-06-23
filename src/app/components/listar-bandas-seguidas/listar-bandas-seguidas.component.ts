import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BandResponse } from '../../models/band.model';
import { FollowService } from '../../services/follow.service';
import { SessionService } from '../../services/session.service';
import { BandService } from '../../services/band.service';

/** Lista de bandas seguidas por el usuario autenticado. */
@Component({
    selector: 'app-listar-bandas-seguidas',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './listar-bandas-seguidas.component.html',
    styleUrl: './listar-bandas-seguidas.component.css'
})
export class ListarBandasSeguidasComponent implements OnInit {
    /** Bandas seguidas con información completa */
    bandasSeguidas: BandResponse[] = [];

    constructor(
        private readonly followSvc: FollowService,
        private readonly session: SessionService,
        private readonly bandSvc: BandService,
        private readonly router: Router
    ) {}

    ngOnInit(): void {
        const userId = this.session.getUserId();
        if (!userId) return;

        // Obtener ids de bandas seguidas
        this.followSvc.listarPerfilesSeguidos(userId).subscribe({
            next: (profiles) => {
                const bandIds = profiles.filter(p => p.tipo === 'Banda').map(p => p.id);
                if (bandIds.length === 0) return;

                // Obtener todas las bandas y filtrar por ids
                this.bandSvc.obtenerBandas().subscribe({
                    next: (bands) => {
                        this.bandasSeguidas = bands.filter(b => bandIds.includes(b.bandId));
                    },
                    error: () => {}
                });
            },
            error: () => {}
        });
    }

    /** Navega al componente de detalle de banda (por crear) */
    verBanda(band: BandResponse): void {
        this.router.navigate(['/mostrar-banda', band.bandId]);
    }
} 