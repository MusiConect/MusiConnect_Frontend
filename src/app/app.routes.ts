import { Routes } from '@angular/router';
import { CrearColaboracionComponent } from './components/crear-colaboracion/crear-colaboracion.component';
import { HomeComponent } from './components/home/home.component'; // ✅ Asegúrate de importar Home
import { EditarColaboracionComponent } from './components/editar-colaboracion/editar-colaboracion.component';
import { ListarColaboracionesComponent } from './components/listar-colaboraciones/listar-colaboraciones.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'crear-colaboracion', component: CrearColaboracionComponent },
  { path: 'editar-colaboracion/:id', component: EditarColaboracionComponent }, // ✅ Asegúrate de que este componente maneje la edición
  { path: 'listar-colaboraciones', component: ListarColaboracionesComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
