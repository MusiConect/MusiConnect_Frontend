import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ConvocationCreate } from '../../models/convocation.model';
import { ConvocationService } from '../../services/convocation.service';
import { SessionService } from '../../services/session.service';
import { NotificationService } from '../../services/notification.service';
import { PostService } from '../../services/post.service';

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
        private session: SessionService,
        private readonly notifications: NotificationService,
        private readonly postService: PostService
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
            next: (res) => {
                // Emitir notificación
                this.mensaje = '✅ ¡Convocatoria publicada con éxito!';
                this.notifications.show('Creación de tu convocatoria puesta en publicaciones!');

                // Crear publicación automática
                const nombreUsuario = this.session.getNombreArtistico() ?? 'Alguien';
                const convId = (res as any).convocatoriaId ?? (res as any).id ?? 0;
                const content = `${nombreUsuario} ha creado una convocatoria llamada <a href='/mostrar-convocatoria/${convId}' class='text-blue-600 underline'>${this.titulo}</a> ¡vayan a darle un vistaso si desean!`;
                const usuarioId = this.session.getUserId() ?? 0;
                this.postService.crearPost({ usuarioId, contenido: content, tipo: 'TEXTO' }).subscribe();

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