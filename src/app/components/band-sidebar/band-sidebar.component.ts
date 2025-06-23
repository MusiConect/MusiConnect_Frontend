import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-band-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './band-sidebar.component.html',
  styleUrls: ['./band-sidebar.component.css']
})
export class BandSidebarComponent {
    /** Indica si el sidebar está colapsado */
    collapsed = false;

    /**
     * Cambia el estado de visualización del sidebar.
     */
    toggleSidebar(): void {
        this.collapsed = !this.collapsed;
    }
} 