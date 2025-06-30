import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { NotificationService } from '../../services/notification.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationDropdownComponent } from '../notification-dropdown/notification-dropdown.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationDropdownComponent],
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
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Si el clic ocurre fuera de los elementos del header, cerramos menús
    if (!target.closest('nav') && !target.closest('header')) {
      this.closeDropdowns();
      this.showNotificaciones = false;
    }
  }

  menuAbierto: boolean = false;

  /** Controla la visibilidad del historial de notificaciones */
  showNotificaciones = false;

  /** Conteo de no leídas para badge (observable) */
  readonly unreadCount$: Observable<number>;

  /** Toast efímero proveniente de errores */
  toastMessage: string | null = null;

  private subs = new Subscription();

  constructor(
    private router: Router,
    private readonly session: SessionService,
    private readonly notifications: NotificationService
  ) {
    // Calculamos unreadCount de forma reactiva
    this.unreadCount$ = this.notifications.list$.pipe(
      map((list) => list.filter((n) => !n.leida).length)
    );

    // Subscripción al toast efímero
    this.subs.add(
      this.notifications.toast$.subscribe((msg) => (this.toastMessage = msg))
    );
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

  toggleNotifications(): void {
    this.showNotificaciones = !this.showNotificaciones;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
