import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CollaborationCreate } from '../../models/collaboration.model';
import { CollaborationService } from '../../services/collaboration.service';
import { SessionService } from '../../services/session.service';
import { NotificationService } from '../../services/notification.service';
import { PostService } from '../../services/post.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-crear-colaboracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-colaboracion.component.html',
  styleUrl: './crear-colaboracion.component.css'
})
export class CrearColaboracionComponent {
  nombre: string = '';
  descripcion: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';
  fechasValidas: boolean = true; // ✅ Inicializamos la variable para evitar errores
  mensaje: string = ''; // ✅ Esta línea soluciona el error

  constructor(
    private collaborationService: CollaborationService,
    private session: SessionService,
    private readonly notifications: NotificationService,
    private readonly postService: PostService
  ) {}

  publicar(form: NgForm) {
    this.fechasValidas = new Date(this.fechaInicio) <= new Date(this.fechaFin);
    if (!this.fechasValidas) {
      this.mensaje = '❌ La fecha de inicio no puede ser mayor a la fecha de fin.';
      return;
    }

    const nuevaColaboracion: CollaborationCreate = {
      titulo: this.nombre,
      descripcion: this.descripcion,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      usuarioId: this.session.getUserId() ?? 0
    };

    this.collaborationService.crearColaboracion(nuevaColaboracion).subscribe({
      next: (res) => {
        this.mensaje = '✅ ¡Colaboración creada con éxito!';

        // Notificación y publicación
        this.notifications.show('Creación de tu colaboración puesta en publicaciones!');

        const nombreUsuario = this.session.getNombreArtistico() ?? 'Alguien';
        const colaboracionId = (res as any).colaboracionId ?? (res as any).id ?? 0;
        const content = `${nombreUsuario} ha creado una colaboración llamada <a href='/mostrar-colaboracion/${colaboracionId}' class='text-blue-600 underline'>${this.nombre}</a> ¡vayan a darle un vistaso si desean!`;
        const usuarioId = this.session.getUserId() ?? 0;
        this.postService.crearPost({ usuarioId, contenido: content, tipo: 'TEXTO' }).subscribe();

        // ✅ Limpiar campos del formulario, pero las variables en el componente
        this.nombre = '';
        this.descripcion = '';
        this.fechaInicio = '';
        this.fechaFin = '';

        form.resetForm(); // ✅ Esta línea reinicia todo el formulario visual y lógicamente
        this.fechasValidas = true;

        // 🕒 Limpiar el mensaje después de 5 segundos
        setTimeout(() => {
          this.mensaje = '';
        }, 2000);
      },
      error: (error) => {
        this.mensaje = error.error?.message
          ? `❌ ${error.error.message}`
          : '❌ Error al crear colaboración.';

        // 🕒 También limpiar después de 5 segundos
        setTimeout(() => {
          this.mensaje = '';
        }, 2000);
      }
    });
  }


}
