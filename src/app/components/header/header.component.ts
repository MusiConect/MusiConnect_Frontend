import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HostListener } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnDestroy
{
  showExplorar = false;
  showCrear = false;
  showSeguimientos = false;

  toggleDropdown(menu: 'explorar' | 'crear' | 'seguimientos')
  {
    if (menu === 'explorar') 
    {
      this.showExplorar = !this.showExplorar;
      this.showCrear = false;
      this.showSeguimientos = false;
    } else {
      if (menu === 'crear') {
        this.showCrear = !this.showCrear;
        this.showExplorar = false;
        this.showSeguimientos = false;
      } else {
        this.showSeguimientos = !this.showSeguimientos;
        this.showExplorar = false;
        this.showCrear = false;
      }
    }
  }

  closeDropdowns()
  {
    this.showExplorar = false;
    this.showCrear = false;
    this.showSeguimientos = false;
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

  /** Mensaje de notificación actual (o null si no hay) */
  mensajeNotificacion: string | null = null;

  /** Subscripción al flujo de notificaciones */
  private notSub?: Subscription;

  constructor(
    private router: Router,
    private readonly session: SessionService,
    private readonly notifications: NotificationService
  ) {
    // Suscribimos inmediatamente a las notificaciones globales.
    this.notSub = this.notifications.mensaje$.subscribe((msg) => {
      if (msg) {
        this.mensajeNotificacion = msg;
        // Ocultamos automáticamente tras 3 s.
        timer(3000).subscribe(() => {
          this.mensajeNotificacion = null;
          this.notifications.clear();
        });
      }
    });
  }

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

  ngOnDestroy(): void {
    this.notSub?.unsubscribe();
  }
}
