import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HostListener } from '@angular/core';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent 
{
  showExplorar = false;
  showCrear = false;

  toggleDropdown(menu: 'explorar' | 'crear')
  {
    if (menu === 'explorar') 
    {
      this.showExplorar = !this.showExplorar;
      this.showCrear = false; // Cierrar el otro menú si se abre uno nuevo
    } else {
      this.showCrear = !this.showCrear;
      this.showExplorar = false; // Cierrar el otro menú si se abre uno nuevo
    }
  }

  closeDropdowns()
  {
    this.showExplorar = false;
    this.showCrear = false;
  }


  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent)
    {
    const target = event.target as HTMLElement;

    // Si el clic ocurre fuera de los botones de menú, cerramos
    if (!target.closest('nav') && !target.closest('header')) {
      this.closeDropdowns();
    }
  }

  menuAbierto: boolean = false;

  constructor(private router: Router, private readonly session: SessionService) {}

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  closeMenu() {
    this.menuAbierto = false;
    this.closeDropdowns();
  }

  /**
   * Cierra la sesión del usuario: elimina el token JWT y redirige a /home.
   */
  logout(): void {
    localStorage.removeItem('token');
    this.closeMenu();
    this.router.navigate(['/home']);
  }

  /** Navega al perfil del usuario autenticado */
  goToMyProfile(event?: Event): void {
    if (event) { event.preventDefault(); }
    const id = this.session.getUserId();
    if (id !== null) {
      this.router.navigate(['/ver-perfil', id]);
    }
    this.closeMenu();
  }
}
