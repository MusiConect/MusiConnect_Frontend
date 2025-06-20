import { CommonModule } from '@angular/common';
import { Component, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaborationService } from '../../services/collaboration.service';
import { SessionService } from '../../services/session.service';

/**
 * Componente para visualizar los detalles de una colaboración.
 * Muestra título, creador, estado, descripción y colaboradores.
 * Si el usuario autenticado es el creador, se habilita el botón "Editar".
 */
@Component({
    selector: 'app-mostrar-colaboracion',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './mostrar-colaboracion.component.html',
    styleUrl: './mostrar-colaboracion.component.css',
    schemas: [NO_ERRORS_SCHEMA]
})
export class MostrarColaboracionComponent implements OnInit {
    /** Datos de la colaboración traídos del backend */
    collaboration: any | null = null;

    /** Colaboradores ordenados alfabéticamente */
    collaborators: string[] = [];

    /** Define si el botón "Editar" debe mostrarse */
    showEdit = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private collaborationSvc: CollaborationService,
        private sessionSvc: SessionService
    ) {}

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        const id = idParam ? +idParam : null;
        if (id) {
            this.loadCollaboration(id);
        }
    }

    /** Obtiene la colaboración y calcula visibilidad del botón Editar */
    private loadCollaboration(id: number): void {
        this.collaborationSvc.getById(id).subscribe((collab: any) => {
            this.collaboration = collab;
            const currentUserId = this.sessionSvc.getUserId();
            const currentNombre = this.sessionSvc.getNombreArtistico();
            // Muestra el botón si el id coincide o, si no viene id, si coincide el nombre artístico.
            this.showEdit =
                (currentUserId !== null && collab.usuarioId === currentUserId) ||
                (!!currentNombre && collab.nombreUsuario === currentNombre);
            // Si viene la lista en el mismo endpoint la usamos, si no, solicitamos aparte
            if (Array.isArray(collab.colaboradores)) {
                this.collaborators = [...collab.colaboradores].sort((a: string, b: string) => a.localeCompare(b, 'es'));
            } else {
                this.loadCollaborators(id);
            }
        });
    }

    /** Llama al endpoint específico para obtener colaboradores */
    private loadCollaborators(id: number): void {
        this.collaborationSvc
            .listarColaboradores(id)
            .subscribe((data: any[]) => {
                this.collaborators = data
                    .map(item => (typeof item === 'string' ? item : item?.nombreArtistico ?? ''))
                    .filter(Boolean)
                    .sort((a: string, b: string) => a.localeCompare(b, 'es'));
            });
    }

    /** Devuelve clases Tailwind según el estado */
    estadoClass(estado: string | undefined): string {
        switch ((estado ?? '').toLowerCase()) {
            case 'pendiente':
                return 'bg-[#FF8DFF]';
            case 'en progreso':
            case 'en_progreso':
            case 'enprogreso':
                return 'bg-[#8D278D]';
            case 'finalizado':
                return 'bg-[#000784]';
            default:
                return 'bg-gray-400';
        }
    }

    /** Navega a la vista de edición */
    goEdit(): void {
        if (this.collaboration) {
            this.router.navigate(['/editar-colaboracion', this.collaboration.colaboracionId]);
        }
    }

    /** Navega a la lista de colaboraciones */
    goBack(): void {
        this.router.navigate(['/listar-colaboraciones']);
    }
} 