import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaborationUpdate } from '../../models/collaboration.model';
import { CollaborationService } from '../../services/collaboration.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-editar-colaboracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-colaboracion.component.html',
  styleUrls: ['./editar-colaboracion.component.css']
})
export class EditarColaboracionComponent implements OnInit {

  /** BINDINGS */
  projectName = '';
  description = '';
  startDate   = '';
  endDate     = '';
  status      = '';
  collaborator = '';

  statusOptions: string[] = [];

  mostrarMensajeExito = false;

  /** IDs */
  private id!: number;
  private currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collabSrv: CollaborationService,
    private session: SessionService
  ) {}

  /* -------------------- ciclo -------------------- */
  ngOnInit(): void {
    // 1. Sacar el ID de la URL
    this.id = +this.route.snapshot.paramMap.get('id')!;
    // 2. Obtener usuario actual
    this.currentUserId = this.session.getUserId();
    // 3. Cargar estados
    this.collabSrv.getEstados().subscribe(arr => this.statusOptions = arr);
    // 4. Traer la colaboración y poblar el formulario; validar autoría
    this.collabSrv.getById(this.id).subscribe(c => {
      // Verificación de autoría
      const currentNombre = this.session.getNombreArtistico();
      const data: any = c as any; // acceso flexible a campos posibles
      const esPropietario = (currentNombre && data.nombreUsuario === currentNombre) ||
                            (this.currentUserId !== null && data.usuarioId === this.currentUserId);

      if (!esPropietario) {
        alert('No tiene permisos para editar esta colaboración.');
        this.router.navigate(['/listar-colaboraciones']);
        return;
      }
      this.fillForm(c);
    });
  }

  private fillForm(c: CollaborationUpdate) {
    this.projectName = c.titulo;
    this.description = c.descripcion;
    this.startDate   = c.fechaInicio;
    this.endDate     = c.fechaFin;
    this.status      = c.estado;
  }

  /* -------------------- acciones -------------------- */

  saveChanges() {
    const body = {
      titulo:       this.projectName,
      descripcion:  this.description,
      fechaInicio:  this.startDate,
      fechaFin:     this.endDate,
      estado:       this.status,
      usuarioId:    this.currentUserId   // el backend lo exige
    };

    this.collabSrv.update(this.id, body).subscribe({
      next: () => this.mostrarMensajeExito = true,
      error: err => alert(err.error?.message ?? 'Error al actualizar')
    });
  }

  /** Añadir colaborador desde el input */
  addCollaborator() {
    if (!this.collaborator.trim()) return;
    this.collabSrv.addMember(this.id, this.collaborator.trim()).subscribe({
      next: () => {
        alert('Colaborador añadido ✅');
        this.collaborator = '';
      },
      error: err => alert(err.error?.message ?? 'No se pudo añadir')
    });
  }

  cancelChanges() {
    this.router.navigate(['/crear-colaboracion']);
  }

  deleteCollaboration() {
    if (!confirm('¿Eliminar esta colaboración?')) return;

    if (this.currentUserId === null) {
      alert('Sesión inválida');
      return;
    }

    this.collabSrv.delete(this.id, this.currentUserId).subscribe({
      next: () => this.router.navigate(['/crear-colaboracion']),
      error: err => alert(err.error?.message ?? 'Error al eliminar')
    });
  }
}
