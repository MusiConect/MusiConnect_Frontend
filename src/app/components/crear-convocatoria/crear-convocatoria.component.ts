import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ConvocationCreate } from '../../models/convocation.model';
import { ConvocationService } from '../../services/convocation.service';
import { SessionService } from '../../services/session.service';
import { NotificationService } from '../../services/notification.service';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';

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
        private readonly postService: PostService,
        private readonly router: Router
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
            next: (resp) => {
                // Emitir notificación
                this.mensaje = '✅ ¡Convocatoria publicada con éxito!';
                this.notifications.show('Creación de tu convocatoria puesta en publicaciones!');

                // Obtener ID de la nueva convocatoria
                const bodyId = (resp.body as any)?.convocationId ?? (resp.body as any)?.convocatoriaId ?? (resp.body as any)?.id;
                let convId = bodyId;

                // Si no viene en el body, intentamos leer la cabecera Location → /convocations/{id}
                if (!convId) {
                    const loc = resp.headers.get('Location') ?? resp.headers.get('location');
                    if (loc) {
                        const match = loc.match(/\/(\d+)$/);
                        if (match) {
                            convId = +match[1];
                        }
                    }
                }

                // Fallback definitivo
                convId = convId || 0;

                // Crear publicación automática
                const nombreUsuario = this.session.getNombreArtistico() ?? 'Alguien';
                const content = `${nombreUsuario} ha creado una convocatoria llamada <a href='/mostrar-convocatoria/${convId}' class='text-blue-600 underline'>${this.titulo}</a> ¡vayan a darle un vistaso si desean!`;
                const usuarioId = this.session.getUserId() ?? 0;
                this.postService.crearPost({ usuarioId, contenido: content, tipo: 'TEXTO' }).subscribe();

                // Limpiar valores y formulario
                this.titulo = '';
                this.descripcion = '';
                this.fechaLimite = '';
                form.resetForm();

                setTimeout(() => {
                    this.mensaje = '';
                    this.router.navigate(['/listar-convocatorias']);
                }, 2000);
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