import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CollaborationService } from '../../services/collaboration.service';
import { CollaborationUpdate } from '../../models/collaboration.model';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HasRoleDirective } from '../../directives/has-role.directive';

@Component({
    selector: 'app-listar-colaboraciones',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, HasRoleDirective],
    templateUrl: './listar-colaboraciones.component.html',
    styleUrl: './listar-colaboraciones.component.css'
})
export class ListarColaboracionesComponent implements OnInit {

    collaborations: CollaborationUpdate[] = [];

    /** Control de búsqueda */
    searchTerm: string = '';

    /** Control para listar sólo activas */
    soloActivas: boolean = false;

    /** Paginación */
    readonly COLABS_POR_PAGINA = 12;
    currentPage: number = 1;

    constructor(private collaborationSvc: CollaborationService, private router: Router) {}

    ngOnInit(): void {
        this.loadCollaborations();
    }

    /** Carga colaboraciones según filtros actuales */
    private loadCollaborations(): void {
        if (this.soloActivas) {
            this.collaborationSvc.getActive().subscribe(data => {
                this.collaborations = data.sort((a, b) => (b as any).colaboracionId - (a as any).colaboracionId);
                this.currentPage = 1;
            });
        } else {
            this.collaborationSvc.getAll().subscribe(data => {
                this.collaborations = data.sort((a, b) => (b as any).colaboracionId - (a as any).colaboracionId);
                this.currentPage = 1;
            });
        }
    }

    /** Filtra por nombre artístico */
    buscar(): void {
        const term = this.searchTerm.trim();
        if (term) {
            this.collaborationSvc
                .getByNombreArtistico(term)
                .subscribe(data => {
                    this.collaborations = data.sort((a, b) => (b as any).colaboracionId - (a as any).colaboracionId);
                    this.currentPage = 1;
                });
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

    /** Navega a la vista de detalle de la colaboración */
    verColaboracion(id: number): void {
        this.router.navigate(['/mostrar-colaboracion', id]);
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

    /* -------------------- paginación -------------------- */
    get totalPaginas(): number {
        return Math.max(1, Math.ceil(this.collaborations.length / this.COLABS_POR_PAGINA));
    }

    get paginas(): number[] {
        return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
    }

    get collaborationsPagina(): CollaborationUpdate[] {
        const inicio = (this.currentPage - 1) * this.COLABS_POR_PAGINA;
        return this.collaborations.slice(inicio, inicio + this.COLABS_POR_PAGINA);
    }

    irAPagina(p: number): void {
        if (p >= 1 && p <= this.totalPaginas) {
            this.currentPage = p;
        }
    }

    paginaAnterior(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    paginaSiguiente(): void {
        if (this.currentPage < this.totalPaginas) {
            this.currentPage++;
        }
    }
} 