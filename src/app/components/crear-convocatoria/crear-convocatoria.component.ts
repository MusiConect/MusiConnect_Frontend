import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ConvocationCreate } from '../../models/convocation.model';
import { ConvocationService } from '../../services/convocation.service';
import { SessionService } from '../../services/session.service';

@Component({
    selector: 'app-crear-convocatoria',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './crear-convocatoria.component.html',
    styleUrl: './crear-convocatoria.component.css'
})
export class CrearConvocatoriaComponent {
    /** Propiedades enlazadas al formulario */
    titulo: string = '';
    descripcion: string = '';
    fechaLimite: string = '';

    /** Mensaje visualizado al usuario */
    mensaje: string = '';

    constructor(
        private convocationService: ConvocationService,
        private session: SessionService
    ) {}

    /** Envía la convocatoria al backend */
    publicar(form: NgForm): void {
        if (form.invalid) {
            return;
        }

        const payload: ConvocationCreate = {
            titulo: this.titulo,
            descripcion: this.descripcion,
            fechaLimite: this.fechaLimite,
            usuarioId: this.session.getUserId() ?? 0
        };

        this.convocationService.crearConvocatoria(payload).subscribe({
            next: () => {
                this.mensaje = '✅ ¡Convocatoria publicada con éxito!';

                // Limpiar valores y formulario
                this.titulo = '';
                this.descripcion = '';
                this.fechaLimite = '';
                form.resetForm();

                setTimeout(() => (this.mensaje = ''), 2000);
            },
            error: (error) => {
                this.mensaje = error.error?.message
                    ? `❌ ${error.error.message}`
                    : '❌ Error al publicar la convocatoria';
                setTimeout(() => (this.mensaje = ''), 2000);
            }
        });
    }
} 