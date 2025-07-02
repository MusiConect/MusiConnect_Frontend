import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BandService } from '../../services/band.service';
import { SessionService } from '../../services/session.service';
import { BandUpdateRequest, BandResponse } from '../../models/band.model';
import { finalize } from 'rxjs/operators';
import { BandSidebarComponent } from '../band-sidebar/band-sidebar.component';
import { HasRoleDirective } from '../../directives/has-role.directive';

@Component({
  selector: 'app-editar-banda',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BandSidebarComponent, HasRoleDirective],
  templateUrl: './editar-banda.component.html',
  styleUrls: ['./editar-banda.component.css']
})
export class EditarBandaComponent implements OnInit {
  editForm!: FormGroup;
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  band: BandResponse | null = null;
  bandId: number | null = null;

  generosMusicales = [
    'Rock', 'Pop', 'Jazz', 'Blues', 'Country', 'Hip Hop', 'R&B', 'Electronic',
    'Folk', 'Reggae', 'Punk', 'Metal', 'Indie', 'Alternative', 'Classical',
    'Funk', 'Soul', 'Gospel', 'Latin', 'World Music'
  ];

  constructor(
    private fb: FormBuilder,
    private bandService: BandService,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.bandId = +id;
        this.loadBandData();
      } else {
        this.isLoading = false;
        this.errorMessage = 'No se proporcionó un ID de banda.';
      }
    });
  }

  private initForm(): void {
    this.editForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      descripcion: [''],
      genero: ['', Validators.required]
    });
  }

  private loadBandData(): void {
    if (!this.bandId) return;

    this.isLoading = true;
    this.bandService.obtenerBandaPorId(this.bandId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => {
          this.band = data;
          const bandGenre = (data.generosMusicales && data.generosMusicales.length > 0) ? data.generosMusicales[0] : '';
          this.editForm.setValue({
            nombre: data.nombre,
            descripcion: data.descripcion || '',
            genero: bandGenre
          });
        },
        error: () => {
          this.errorMessage = 'Error al cargar los datos de la banda.';
        }
      });
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const adminId = this.sessionService.getUserId();
    if (!adminId || !this.bandId) {
      this.errorMessage = 'No se pudo verificar la autenticación o el ID de la banda.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.editForm.value;
    const bandRequest: BandUpdateRequest = {
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      generos: [formValue.genero],
      adminId: adminId
    };

    this.bandService.updateBanda(this.bandId, bandRequest)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.successMessage = '¡Banda actualizada exitosamente!';
          setTimeout(() => this.router.navigate(['/bandas']), 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Error al actualizar la banda.';
        }
      });
  }

  getFieldError(fieldName: string): string {
    const field = this.editForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es obligatorio.';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres.`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres.`;
    }
    return '';
  }
  
  private markFormGroupTouched(): void {
    Object.values(this.editForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
