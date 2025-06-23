import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BandService } from '../../services/band.service';
import { SessionService } from '../../services/session.service';
import { BandRequest } from '../../models/band.model';
import { finalize } from 'rxjs/operators';
import { BandSidebarComponent } from '../band-sidebar/band-sidebar.component';

@Component({
  selector: 'app-crear-banda',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BandSidebarComponent],
  templateUrl: './crear-banda.component.html',
  styleUrls: ['./crear-banda.component.css']
})
export class CrearBandaComponent implements OnInit {
  bandForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  generosMusicales = [
    'Rock', 'Pop', 'Jazz', 'Blues', 'Country', 'Hip Hop', 'R&B', 'Electronic',
    'Folk', 'Reggae', 'Punk', 'Metal', 'Indie', 'Alternative', 'Classical',
    'Funk', 'Soul', 'Gospel', 'Latin', 'World Music'
  ];

  constructor(
    private fb: FormBuilder,
    private bandService: BandService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.bandForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      genero: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.bandForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const userId = this.sessionService.getUserId();
      if (!userId) {
        this.errorMessage = 'Error: Usuario no autenticado';
        this.isLoading = false;
        return;
      }

      const formValue = this.bandForm.value;
      const bandRequest: BandRequest = {
        nombre: formValue.nombre,
        descripcion: formValue.descripcion,
        generos: [formValue.genero], // Wrap single genre in an array
        adminId: userId
      };

      this.bandService.crearBanda(bandRequest)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (response) => {
            this.successMessage = `¡Banda "${response.nombre}" creada exitosamente!`;
            
            setTimeout(() => {
              this.router.navigate(['/bandas']);
            }, 2000);
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Error al crear la banda. Inténtalo de nuevo.';
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.values(this.bandForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.bandForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo es obligatorio';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  cancelar(): void {
    this.router.navigate(['/bandas']);
  }
}
