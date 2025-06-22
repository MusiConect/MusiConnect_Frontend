import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConvocationResponse } from '../../models/convocation.model';
import { ConvocationService } from '../../services/convocation.service';
import { SessionService } from '../../services/session.service';
import { formatDate } from '@angular/common';

@Component({
    selector: 'app-mostrar-convocatoria',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './mostrar-convocatoria.component.html',
    styleUrl: './mostrar-convocatoria.component.css'
})
export class MostrarConvocatoriaComponent implements OnInit {
    convocatoria?: ConvocationResponse;
    cargando = true;
    esPropia = false;
    esFavorita: boolean | undefined = undefined;

    constructor(
        private route: ActivatedRoute,
        private convocationService: ConvocationService,
        private session: SessionService,
        private router: Router
    ) {}

    ngOnInit(): void {
        const id = +(this.route.snapshot.paramMap.get('id') ?? 0);
        const userId = this.session.getUserId() ?? 0;

        // Obtener convocatoria
        this.convocationService.obtenerPorId(id).subscribe({
            next: (data) => {
                const expirada = this.esExpirada(data.fechaLimite);
                if (!data || expirada) {
                    // Redirigir si expirada o inexistente
                    this.router.navigate(['/listar-convocatorias']);
                    return;
                }
                this.convocatoria = data;
                this.esPropia = this.session.getNombreArtistico() === data.creadorNombreArtistico;

                // Verificar favorita sólo si no es propia
                if (!this.esPropia) {
                    this.convocationService.listarFavoritasPorUsuario(userId).subscribe({
                        next: (favs) => {
                            this.esFavorita = favs.some((f) => f.convocationId === data.convocationId);
                            this.cargando = false;
                        },
                        error: () => (this.cargando = false)
                    });
                } else {
                    this.cargando = false;
                }
            },
            error: () => this.router.navigate(['/listar-convocatorias'])
        });
    }

    /** Navega atrás a la lista */
    volver(): void {
        this.router.navigate(['/listar-convocatorias']);
    }

    /** Ir a editar (solo propia) */
    editar(): void {
        if (this.convocatoria) {
            this.router.navigate(['/editar-convocatoria', this.convocatoria.convocationId]);
        }
    }

    /** Alternar favorito */
    toggleFavorito(): void {
        if (this.esPropia || !this.convocatoria) return;
        const userId = this.session.getUserId() ?? 0;
        if (this.esFavorita) {
            this.convocationService.eliminarDeFavoritas({ usuarioId: userId, convocatoriaId: this.convocatoria.convocationId }).subscribe({
                next: () => {
                    this.esFavorita = false;
                }
            });
        } else {
            this.convocationService.marcarComoFavorita({ usuarioId: userId, convocatoriaId: this.convocatoria.convocationId }).subscribe({
                next: () => {
                    this.esFavorita = true;
                }
            });
        }
    }

    /** Formatea fecha al estilo dd/MM/yyyy */
    fechaFormateada(): string {
        return this.convocatoria ? formatDate(this.convocatoria.fechaLimite, 'dd/MM/yyyy', 'es-ES') : '';
    }

    /**
     * Determina si la convocatoria ha expirado considerando la zona horaria local.
     * @param fechaLimite Fecha límite en formato ISO (yyyy-MM-dd o yyyy-MM-ddTHH:mm:ss)
     */
    private esExpirada(fechaLimite: string): boolean {
        const limite = fechaLimite.includes('T') ? new Date(fechaLimite) : new Date(`${fechaLimite}T23:59:59`);
        return limite.getTime() < Date.now();
    }
} 