import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BandService } from '../../services/band.service';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { BandResponse } from '../../models/band.model';
import { User } from '../../models/user.model';
import { forkJoin, of, catchError } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BandSidebarComponent } from '../band-sidebar/band-sidebar.component';

@Component({
  selector: 'app-invitar-miembro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BandSidebarComponent],
  templateUrl: './invitar-miembro.component.html',
  styleUrls: ['./invitar-miembro.component.css']
})
export class InvitarMiembroComponent implements OnInit {
  inviteForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  adminBands: BandResponse[] = [];
  availableUsers: User[] = [];

  constructor(
    private fb: FormBuilder,
    private bandService: BandService,
    private sessionService: SessionService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadInitialData();
  }

  private initForm(): void {
    this.inviteForm = this.fb.group({
      bandId: ['', Validators.required],
      userId: ['', Validators.required]
    });
  }

  private loadInitialData(): void {
    this.isLoading = true;
    const adminId = this.sessionService.getUserId();
    const adminName = this.sessionService.getNombreArtistico();

    if (!adminId || !adminName) {
      this.errorMessage = 'No se pudo verificar el administrador.';
      this.isLoading = false;
      return;
    }

    forkJoin({
      bands: this.bandService.obtenerBandas().pipe(
        catchError(error => {
          console.error('Error fetching bands:', error);
          this.errorMessage = 'Error al cargar tus bandas.';
          return of([]); // Return an empty array to let the other calls complete
        })
      ),
      users: this.userService.getAll().pipe(
        catchError(error => {
          console.error('Error fetching users:', error);
          this.errorMessage = (this.errorMessage ? this.errorMessage + ' ' : '') + 'Error al cargar los usuarios.';
          return of([]);
        })
      )
    }).pipe(finalize(() => (this.isLoading = false)))
    .subscribe({
      next: ({ bands, users }) => {
        this.adminBands = bands.filter(band => band.administradorNombreArtistico === adminName);
        this.availableUsers = users.filter(user => user.userId !== adminId);

        // If no users are available to invite, disable the user selection dropdown
        if (this.availableUsers.length === 0) {
          this.inviteForm.get('userId')?.disable();
        } else {
          this.inviteForm.get('userId')?.enable();
        }
      },
      error: () => {
        this.errorMessage = 'Ocurrió un error inesperado al cargar los datos.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.inviteForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const adminId = this.sessionService.getUserId();
    if (!adminId) {
      this.errorMessage = 'Error: Usuario no autenticado.';
      this.isLoading = false;
      return;
    }

    const bandId: number = +this.inviteForm.value.bandId;
    const userId: number = +this.inviteForm.value.userId;

    this.bandService.addMiembro(bandId, { userId, adminId })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.successMessage = '¡Invitación enviada exitosamente!';
          this.inviteForm.reset();
          
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Error al enviar la invitación. Inténtalo de nuevo.';
        }
      });
  }

  isInvalid(controlName: string): boolean {
    const control = this.inviteForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }
  
  private markFormGroupTouched(): void {
    Object.values(this.inviteForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
