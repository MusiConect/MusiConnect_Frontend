import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CollaborationService } from '../../services/collaboration.service';
import { CollaborationUpdate } from '../../models/collaboration.model';

@Component({
    selector: 'app-listar-colaboraciones',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './listar-colaboraciones.component.html',
    styleUrl: './listar-colaboraciones.component.css'
})
export class ListarColaboracionesComponent implements OnInit {

    collaborations: CollaborationUpdate[] = [];

    /** Control de búsqueda */
    searchTerm: string = '';

    /** Control para listar sólo activas */
    soloActivas: boolean = false;

    constructor(private collaborationSvc: CollaborationService) {}

    ngOnInit(): void {
        this.loadCollaborations();
    }

    /** Carga colaboraciones según filtros actuales */
    private loadCollaborations(): void {
        if (this.soloActivas) {
            this.collaborationSvc.getActive().subscribe(data => (this.collaborations = data));
        } else {
            this.collaborationSvc.getAll().subscribe(data => (this.collaborations = data));
        }
    }

    /** Filtra por nombre artístico */
    buscar(): void {
        const term = this.searchTerm.trim();
        if (term) {
            this.collaborationSvc
                .getByNombreArtistico(term)
                .subscribe(data => (this.collaborations = data));
        } else {
            this.loadCollaborations();
        }
    }

    /** Alterna listado de sólo activas */
    toggleActivas(): void {
        this.soloActivas = !this.soloActivas;
        this.loadCollaborations();
    }

    /** Vuelve a cargar la lista manteniendo criterios actuales */
    recargar(): void {
        this.buscar(); // si hay término busca; si no, load
    }

    /** Devuelve las clases Tailwind para el estado */
    estadoClass(estado: string) {
        switch (estado?.toLowerCase()) {
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
} 