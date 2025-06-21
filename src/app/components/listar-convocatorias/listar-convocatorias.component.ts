import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConvocationResponse } from '../../models/convocation.model';
import { ConvocationService } from '../../services/convocation.service';
import { SessionService } from '../../services/session.service';

interface CardConvocation extends ConvocationResponse {
    esFavorita: boolean;
    esPropia: boolean;
    expirada: boolean;
    activa: boolean;
}

@Component({
    selector: 'app-listar-convocatorias',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './listar-convocatorias.component.html',
    styleUrl: './listar-convocatorias.component.css'
})
export class ListarConvocatoriasComponent implements OnInit {
    convocatorias: CardConvocation[] = [];
    filtro: 'TODAS' | 'FAVORITAS' | 'ACTIVAS' = 'TODAS';
    cargando = false;

    /** Lista de ids favoritas para saber estado visual */
    private favoritasIds: Set<number> = new Set();
    private nombreUsuario: string | null = null;
    private activasIds: Set<number> = new Set();

    constructor(
        private convocationService: ConvocationService,
        private session: SessionService
    ) {}

    ngOnInit(): void {
        this.nombreUsuario = this.session.getNombreArtistico();
        this.cargarDatos();
    }

    /** Carga según filtro actual */
    cargarDatos(): void {
        this.cargando = true;
        const userId = this.session.getUserId() ?? 0;

        if (this.filtro === 'FAVORITAS') {
            this.convocationService.listarFavoritasPorUsuario(userId).subscribe({
                next: (data) => {
                    this.favoritasIds = new Set(data.map((c) => c.convocationId));
                    this.convocatorias = data.map((c) => {
                        const expirada = new Date(c.fechaLimite) < new Date();
                        return {
                            ...c,
                            esFavorita: true,
                            esPropia: this.nombreUsuario === c.creadorNombreArtistico,
                            expirada,
                            activa: !expirada
                        };
                    });
                    // remover favoritas expiradas
                    this.convocatorias.filter(conv => conv.expirada && conv.esFavorita).forEach(conv => {
                        this.convocationService.eliminarDeFavoritas({usuarioId: userId, convocatoriaId: conv.convocationId}).subscribe();
                        conv.esFavorita = false;
                    });
                    this.cargando = false;
                },
                error: () => {
                    // Sin favoritas: limpiar lista
                    this.convocatorias = [];
                    this.cargando = false;
                }
            });
            return;
        }

        const source$ = this.filtro === 'ACTIVAS' ? this.convocationService.listarActivas() : this.convocationService.listarTodas();

        // Cargar lista base y luego añadir favoritas
        source$.subscribe({
            next: (data) => {
                const todas = data;
                this.convocationService.listarFavoritasPorUsuario(userId).subscribe({
                    next: (favs) => {
                        this.favoritasIds = new Set(favs.map((f) => f.convocationId));
                        this.convocatorias = todas.map((c) => {
                            const expirada = new Date(c.fechaLimite) < new Date();
                            return {
                                ...c,
                                esFavorita: this.favoritasIds.has(c.convocationId),
                                esPropia: this.nombreUsuario === c.creadorNombreArtistico,
                                expirada,
                                activa: !expirada
                            };
                        });
                        this.cargando = false;
                    },
                    error: () => {
                        // Sin favoritas
                        this.convocatorias = todas.map((c) => {
                            const expirada = new Date(c.fechaLimite) < new Date();
                            return {
                                ...c,
                                esFavorita: false,
                                esPropia: this.nombreUsuario === c.creadorNombreArtistico,
                                expirada,
                                activa: !expirada
                            };
                        });
                        this.cargando = false;
                    }
                });
            },
            error: () => (this.cargando = false)
        });
    }

    /** Cambia filtro a favoritas */
    verSoloFavoritas(): void {
        this.filtro = 'FAVORITAS';
        this.cargarDatos();
    }

    /** Toggle entre activas y todas */
    verSoloActivas(): void {
        this.filtro = this.filtro === 'ACTIVAS' ? 'TODAS' : 'ACTIVAS';
        this.cargarDatos();
    }

    /** Forzar recarga */
    recargar(): void {
        this.cargarDatos();
    }

    /** Toggle de favorito */
    toggleFavorito(conv: CardConvocation): void {
        if (conv.esPropia || conv.expirada || !conv.activa) return; // No favorito si no activo
        const userId = this.session.getUserId() ?? 0;
        if (conv.esFavorita) {
            // Quitar
            this.convocationService.eliminarDeFavoritas({ usuarioId: userId, convocatoriaId: conv.convocationId }).subscribe({
                next: () => {
                    conv.esFavorita = false;
                }
            });
        } else {
            // Agregar
            this.convocationService.marcarComoFavorita({ usuarioId: userId, convocatoriaId: conv.convocationId }).subscribe({
                next: () => {
                    conv.esFavorita = true;
                }
            });
        }
    }
} 