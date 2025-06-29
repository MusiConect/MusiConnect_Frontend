import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
    ConvocationUpdate,
    ConvocationResponse
} from '../../models/convocation.model';
import { ConvocationService } from '../../services/convocation.service';
import { SessionService } from '../../services/session.service';

@Component({
    selector: 'app-editar-convocatoria',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './editar-convocatoria.component.html',
    styleUrl: './editar-convocatoria.component.css'
})
export class EditarConvocatoriaComponent implements OnInit {
    /** Datos del formulario */
    titulo: string = '';
    descripcion: string = '';
    fechaLimite: string = '';

    /** Estado visual */
    mensaje: string = '';
    mensajeError: string = '';
    sinPropiedad: boolean = false;
    idConvocatoria!: number;

    /* Mensaje de acción */
    mensajeAccion = '';
    tipoMensaje: 'success' | 'error' = 'success';

    constructor(
        private route: ActivatedRoute,
        private convocationService: ConvocationService,
        private session: SessionService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.idConvocatoria = +(this.route.snapshot.paramMap.get('id') ?? 0);
        this.cargarConvocatoria();
    }

    /** Trae datos de la convocatoria y rellena el formulario */
    private cargarConvocatoria(): void {
        this.convocationService.obtenerPorId(this.idConvocatoria).subscribe({
            next: (data: ConvocationResponse) => {
                const nombreUsuario = this.session.getNombreArtistico();
                if (nombreUsuario && nombreUsuario !== data.creadorNombreArtistico) {
                    this.sinPropiedad = true;
                    this.mensajeError = 'Esta convocatoria no te pertenece.';
                    return; // No cargar datos
                }

                this.titulo = data.titulo;
                this.descripcion = data.descripcion;
                this.fechaLimite = data.fechaLimite;
            },
            error: (err) => {
                if (err.status === 403) {
                    // Convocatoria no pertenece al usuario
                    this.sinPropiedad = true;
                    this.mensajeError = 'Esta convocatoria no te pertenece.';
                    this.titulo = '';
                    this.descripcion = '';
                    this.fechaLimite = '';
                } else {
                    this.router.navigate(['/listar-convocatorias']);
                }
            }
        });
    }

    /** Envía cambios al backend */
    guardar(form: NgForm): void {
        if (form.invalid) return;

        const payload: ConvocationUpdate = {
            convocationId: this.idConvocatoria,
            usuarioId: this.session.getUserId() ?? 0,
            titulo: this.titulo,
            descripcion: this.descripcion,
            fechaLimite: this.fechaLimite
        };

        this.convocationService.editarConvocatoria(this.idConvocatoria, payload).subscribe({
            next: () => {
                this.mensaje = 'Convocatoria actualizada correctamente.';
                // Ocultar mensaje luego de 3 s
                setTimeout(() => (this.mensaje = ''), 3000);
            },
            error: () => {
                this.mensaje = '❌ Error al actualizar la convocatoria';
                setTimeout(() => (this.mensaje = ''), 3000);
            }
        });
    }

    cancelar(): void {
        this.router.navigate(['/listar-convocatorias']);
    }

    eliminar(): void {
        if (!confirm('¿Está seguro de eliminar la convocatoria?')) return;
        const usuarioId = this.session.getUserId() ?? 0;
        this.convocationService.eliminarConvocatoria(this.idConvocatoria, usuarioId).subscribe({
            next: () => this.router.navigate(['/listar-convocatorias']),
            error: () => {
                this.tipoMensaje = 'error';
                this.mensajeAccion = 'Error al eliminar convocatoria.';
                setTimeout(() => (this.mensajeAccion = ''), 3000);
            }
        });
    }
} 