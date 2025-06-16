import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Collaboration } from '../../models/collaboration.model';
import { CollaborationService } from '../../services/collaboration.service';
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
  usuarioId: number = 1;
  fechasValidas: boolean = true; // ✅ Inicializamos la variable para evitar errores
  mensaje: string = ''; // ✅ Esta línea soluciona el error

  constructor(private collaborationService: CollaborationService) {}

  publicar(form: NgForm) {
    this.fechasValidas = new Date(this.fechaInicio) <= new Date(this.fechaFin);
    if (!this.fechasValidas) {
      this.mensaje = '❌ La fecha de inicio no puede ser mayor a la fecha de fin.';
      return;
    }

    const nuevaColaboracion: Collaboration = {
      titulo: this.nombre,
      descripcion: this.descripcion,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      usuarioId: this.usuarioId
    };

    this.collaborationService.crearColaboracion(nuevaColaboracion).subscribe({
      next: () => {
        this.mensaje = '✅ ¡Colaboración creada con éxito!';

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
