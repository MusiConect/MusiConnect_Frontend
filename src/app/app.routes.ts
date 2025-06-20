import { Routes } from '@angular/router';
import { CrearColaboracionComponent } from './components/crear-colaboracion/crear-colaboracion.component';
import { HomeComponent } from './components/home/home.component'; // ✅ Asegúrate de importar Home
import { EditarColaboracionComponent } from './components/editar-colaboracion/editar-colaboracion.component';
import { ListarColaboracionesComponent } from './components/listar-colaboraciones/listar-colaboraciones.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'crear-colaboracion', component: CrearColaboracionComponent, canActivate: [authGuard] },
  { path: 'editar-colaboracion/:id', component: EditarColaboracionComponent, canActivate: [authGuard] },
  { path: 'listar-colaboraciones', component: ListarColaboracionesComponent, canActivate: [authGuard] },
  { path: 'mostrar-colaboracion/:id', loadComponent: () => import('./components/mostrar-colaboracion/mostrar-colaboracion.component').then(m => m.MostrarColaboracionComponent), canActivate: [authGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: 'crear-convocatoria', loadComponent: () => import('./components/crear-convocatoria/crear-convocatoria.component').then(m => m.CrearConvocatoriaComponent), canActivate: [authGuard] },
  { path: 'editar-convocatoria/:id', loadComponent: () => import('./components/editar-convocatoria/editar-convocatoria.component').then(m => m.EditarConvocatoriaComponent), canActivate: [authGuard] },
  { path: 'listar-convocatorias', loadComponent: () => import('./components/listar-convocatorias/listar-convocatorias.component').then(m => m.ListarConvocatoriasComponent), canActivate: [authGuard] },
  { path: 'mostrar-convocatoria/:id', loadComponent: () => import('./components/mostrar-convocatoria/mostrar-convocatoria.component').then(m => m.MostrarConvocatoriaComponent) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
