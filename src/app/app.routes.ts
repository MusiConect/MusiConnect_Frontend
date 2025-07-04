import { Routes } from '@angular/router';
import { CrearColaboracionComponent } from './components/crear-colaboracion/crear-colaboracion.component';
import { HomeComponent } from './components/home/home.component'; // ✅ Asegúrate de importar Home
import { EditarColaboracionComponent } from './components/editar-colaboracion/editar-colaboracion.component';
import { ListarColaboracionesComponent } from './components/listar-colaboraciones/listar-colaboraciones.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './models/role.model';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'crear-colaboracion', component: CrearColaboracionComponent, canActivate: [authGuard, roleGuard], data: { roles: [Role.MUSICO] } },
  { path: 'editar-colaboracion/:id', component: EditarColaboracionComponent, canActivate: [authGuard, roleGuard], data: { roles: [Role.MUSICO] } },
  { path: 'listar-colaboraciones', component: ListarColaboracionesComponent, canActivate: [authGuard] },
  { path: 'mostrar-colaboracion/:id', loadComponent: () => import('./components/mostrar-colaboracion/mostrar-colaboracion.component').then(m => m.MostrarColaboracionComponent), canActivate: [authGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: 'crear-convocatoria', loadComponent: () => import('./components/crear-convocatoria/crear-convocatoria.component').then(m => m.CrearConvocatoriaComponent), canActivate: [authGuard, roleGuard], data: { roles: [Role.PRODUCTOR] } },
  { path: 'editar-convocatoria/:id', loadComponent: () => import('./components/editar-convocatoria/editar-convocatoria.component').then(m => m.EditarConvocatoriaComponent), canActivate: [authGuard, roleGuard], data: { roles: [Role.PRODUCTOR] } },
  { path: 'listar-convocatorias', loadComponent: () => import('./components/listar-convocatorias/listar-convocatorias.component').then(m => m.ListarConvocatoriasComponent), canActivate: [authGuard] },
  { path: 'mostrar-convocatoria/:id', loadComponent: () => import('./components/mostrar-convocatoria/mostrar-convocatoria.component').then(m => m.MostrarConvocatoriaComponent), canActivate: [authGuard] },
  { path: 'ver-perfil/:id', loadComponent: () => import('./components/ver-perfil/ver-perfil.component').then(m => m.VerPerfilComponent), canActivate: [authGuard] },
  { path: 'editar-perfil', loadComponent: () => import('./components/editar-perfil/editar-perfil.component').then(m => m.EditarPerfilComponent), canActivate: [authGuard] },
  { path: 'listar-perfiles', loadComponent: () => import('./components/listar-perfiles/listar-perfiles.component').then(m => m.ListarPerfilesComponent), canActivate: [authGuard] },
  { path: 'listar-seguidos', loadComponent: () => import('./components/listar-seguidos/listar-seguidos.component').then(m => m.ListarSeguidosComponent), canActivate: [authGuard] },
  { path: 'bandas-seguidas', loadComponent: () => import('./components/listar-bandas-seguidas/listar-bandas-seguidas.component').then(m => m.ListarBandasSeguidasComponent), canActivate: [authGuard] },
  { path: 'crear-banda', loadComponent: () => import('./components/crear-banda/crear-banda.component').then(m => m.CrearBandaComponent), canActivate: [authGuard, roleGuard], data: { roles: [Role.PRODUCTOR] } },
  { path: 'invitar-miembro', loadComponent: () => import('./components/invitar-miembro/invitar-miembro.component').then(m => m.InvitarMiembroComponent), canActivate: [authGuard, roleGuard], data: { roles: [Role.PRODUCTOR] } },
  { path: 'editar-banda/:id', loadComponent: () => import('./components/editar-banda/editar-banda.component').then(m => m.EditarBandaComponent), canActivate: [authGuard, roleGuard], data: { roles: [Role.PRODUCTOR] } },
  { path: 'bandas', loadComponent: () => import('./components/listar-bandas/listar-bandas.component').then(m => m.ListarBandasComponent), canActivate: [authGuard] },
  { path: 'mostrar-banda/:id', loadComponent: () => import('./components/mostrar-banda/mostrar-banda.component').then(m => m.MostrarBandaComponent), canActivate: [authGuard] },
  { path: 'crear-publicacion', loadComponent: () => import('./components/crear-publicacion/crear-publicacion.component').then(m => m.CrearPublicacionComponent), canActivate: [authGuard, roleGuard], data: { roles: [Role.MUSICO, Role.PRODUCTOR] } },
  { path: 'editar-publicacion/:id', loadComponent: () => import('./components/editar-publicacion/editar-publicacion.component').then(m => m.EditarPublicacionComponent), canActivate: [authGuard, roleGuard], data: { roles: [Role.MUSICO, Role.PRODUCTOR] } },
  { path: 'publicaciones', loadComponent: () => import('./components/listar-publicaciones/listar-publicaciones.component').then(m => m.ListarPublicacionesComponent), canActivate: [authGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
