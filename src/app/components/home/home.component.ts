import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent 
{
  menuAbierto: boolean = false;

  constructor(private session: SessionService, private router: Router) {}

  get isLogged(): boolean {
    return this.session.isLoggedIn();
  }

  volver(): void {
    this.router.navigate(['/publicaciones']);
  }

  /** Desplaza con animación hacia el elemento target en la misma página */
  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      this.menuAbierto = false; // cerrar menú móvil si estaba abierto
    }
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

}
