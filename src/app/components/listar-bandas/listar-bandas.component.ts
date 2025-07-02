import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BandService } from '../../services/band.service';
import { FollowService } from '../../services/follow.service';
import { SessionService } from '../../services/session.service';
import { BandResponse } from '../../models/band.model';
import { FollowCreate, UnfollowRequest } from '../../models/follow.model';
import { finalize } from 'rxjs/operators';
import { BandSidebarComponent } from '../band-sidebar/band-sidebar.component';
import { HasRoleDirective } from '../../directives/has-role.directive';

@Component({
  selector: 'app-listar-bandas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BandSidebarComponent, HasRoleDirective],
  templateUrl: './listar-bandas.component.html',
  styleUrls: ['./listar-bandas.component.css']
})
export class ListarBandasComponent implements OnInit {
  myBands: BandResponse[] = [];
  otherBands: BandResponse[] = [];
  isLoading = true;
  
  searchForm!: FormGroup;
  searchedBand: BandResponse | null = null;
  isSearching = false;
  searchError = '';

  /** Set de IDs de bandas seguidas por el usuario */
  followedBandIds = new Set<number>();

  /* ------------------ mensajes ------------------ */
  mensajeAccion = '';
  tipoMensaje: 'success' | 'error' = 'success';
  accionBandId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private bandService: BandService,
    private followService: FollowService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyBands();
    this.loadFollowedBands();
    this.searchForm = this.fb.group({
      bandName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  loadMyBands(): void {
    this.isLoading = true;
    const adminName = this.sessionService.getNombreArtistico();
    
    this.bandService.obtenerBandas()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
      next: (bands) => {
        this.myBands = bands.filter(band => band.administradorNombreArtistico === adminName);
        this.otherBands = bands.filter(band => band.administradorNombreArtistico !== adminName);
      },
      error: () => {
        // Mensaje de error podría mostrarse aquí
      }
    });
  }

  /** Obtiene las bandas actualmente seguidas por el usuario */
  loadFollowedBands(): void {
    const userId = this.sessionService.getUserId();
    if (!userId) return;

    this.followService.listarPerfilesSeguidos(userId).subscribe({
      next: (profiles) => {
        const bandIds = profiles
          .filter((p) => p.tipo === 'Banda')
          .map((p) => p.id);
        this.followedBandIds = new Set(bandIds);
      },
      error: () => {
        // Silenciar error por ahora
      }
    });
  }

  /** Alterna el follow/unfollow para una banda específica */
  toggleFollow(band: BandResponse): void {
    const userId = this.sessionService.getUserId();
    if (!userId) {
      this.tipoMensaje = 'error';
      this.mensajeAccion = 'Debe iniciar sesión.';
      this.accionBandId = band.bandId;
      setTimeout(() => (this.mensajeAccion = ''), 3000);
      return;
    }

    if (this.followedBandIds.has(band.bandId)) {
      // Unfollow
      const payload: UnfollowRequest = { followerId: userId, followedBandId: band.bandId };
      this.followService.eliminarFollow(payload).subscribe({
        next: () => {
          this.followedBandIds.delete(band.bandId);
          this.tipoMensaje = 'error';
          this.mensajeAccion = `Has dejado de seguir a ${band.nombre}.`;
          this.accionBandId = band.bandId;
          setTimeout(() => (this.mensajeAccion = ''), 3000);
        },
        error: () => {
          this.tipoMensaje = 'error';
          this.mensajeAccion = 'Error al dejar de seguir la banda.';
          this.accionBandId = band.bandId;
          setTimeout(() => (this.mensajeAccion = ''), 3000);
        }
      });
    } else {
      // Follow
      const payload: FollowCreate = { followerId: userId, followedBandId: band.bandId };
      this.followService.crearFollow(payload).subscribe({
        next: () => {
          this.followedBandIds.add(band.bandId);
          this.tipoMensaje = 'success';
          this.mensajeAccion = `Ahora sigues a ${band.nombre}.`;
          this.accionBandId = band.bandId;
          setTimeout(() => (this.mensajeAccion = ''), 3000);
        },
        error: () => {
          this.tipoMensaje = 'error';
          this.mensajeAccion = 'Error al seguir la banda.';
          this.accionBandId = band.bandId;
          setTimeout(() => (this.mensajeAccion = ''), 3000);
        }
      });
    }
  }

  searchByName(): void {
    if (this.searchForm.invalid) return;

    this.isSearching = true;
    this.searchedBand = null;
    this.searchError = '';

    const nombre: string = this.searchForm.value.bandName.trim().toLowerCase();

    this.bandService.obtenerBandas()
      .pipe(finalize(() => (this.isSearching = false)))
      .subscribe({
        next: (bands) => {
          const match = bands.find(b => b.nombre.toLowerCase() === nombre);
          if (match) {
            this.searchedBand = match;
          } else {
            this.searchError = `No se encontró ninguna banda con el nombre "${this.searchForm.value.bandName}".`;
          }
        },
        error: () => {
          this.searchError = 'Error al buscar la banda.';
        }
      });
  }

  editBand(bandId: number): void {
    this.router.navigate(['/editar-banda', bandId]);
  }

  deleteBand(bandId: number): void {
    const adminId = this.sessionService.getUserId();
    if (!adminId) {
      this.tipoMensaje = 'error';
      this.mensajeAccion = 'Error de autenticación.';
      this.accionBandId = null;
      setTimeout(() => (this.mensajeAccion = ''), 3000);
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar esta banda?')) {
      this.bandService.eliminarBanda(bandId, adminId).subscribe({
        next: () => {
          this.myBands = this.myBands.filter(band => band.bandId !== bandId);
        },
        error: (err) => {
          this.tipoMensaje = 'error';
          this.mensajeAccion = err.error?.message || 'Error al eliminar la banda.';
          this.accionBandId = bandId;
          setTimeout(() => (this.mensajeAccion = ''), 3000);
        }
      });
    }
  }

  /**
   * Navega al componente MostrarBanda correspondiente al ID proporcionado.
   *
   * @param bandId - Identificador único de la banda.
   */
  viewBand(bandId: number): void {
    this.router.navigate(['/mostrar-banda', bandId]);
  }
}
