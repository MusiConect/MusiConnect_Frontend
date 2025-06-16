import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Collaboration } from '../../models/collaboration.model';
import { CollaborationService } from '../../services/collaboration.service';

@Component({
  selector: 'app-crear-colaboracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-colaboracion.component.html',
  styleUrls: ['./crear-colaboracion.component.css']
})
export class CrearColaboracionComponent {
  nombre: string = '';
  descripcion: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';

  usuarioId: number = 1; // 👈 Por ahora puedes usar un ID fijo (en pruebas)

  mensaje: string = '';
  fechasValidas: boolean = true; // Para validar las fechas

  constructor(private collaborationService: CollaborationService) {}

  publicar() {
    const nuevaColaboracion: Collaboration = {
      titulo: this.nombre,
      descripcion: this.descripcion,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      usuarioId: this.usuarioId
    };

    this.collaborationService.crearColaboracion(nuevaColaboracion).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.mensaje = '✅ ¡Colaboración creada con éxito!';
        // Aquí puedes hacer limpieza de campos si quieres
      },
      error: (error) => {
        console.error('Error al crear colaboración:', error);
        this.mensaje = '❌ Error al crear colaboración. Revisa los campos o el backend.';
      }
    });
  }
}
