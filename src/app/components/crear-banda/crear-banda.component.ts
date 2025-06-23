import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BandService } from '../../services/band.service';
import { SessionService } from '../../services/session.service';
import { BandRequest } from '../../models/band.model';
import { finalize } from 'rxjs/operators';
import { BandSidebarComponent } from '../band-sidebar/band-sidebar.component';
import { NotificationService } from '../../services/notification.service';
import { PostService } from '../../services/post.service';

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
    'ROCK',
    'POP',
    'JAZZ',
    'CLASSICAL',
    'HIP_HOP',
    'REGGAETON',
    'BLUES',
    'ELECTRONIC',
    'FOLK',
    'LATIN',
    'COUNTRY',
    'METAL',
    'RNB',
    'SOUL',
    'PUNK',
    'DISCO',
    'FUNK',
    'SALSA',
    'CUMBIA',
    'BACHATA',
    'K_POP',
    'OPERA',
    'SOUNDTRACK',
    'SAYA',
    'CAPORAL',
    'INDIE',
    'OTHER',
  ];

  constructor(
    private fb: FormBuilder,
    private bandService: BandService,
    private sessionService: SessionService,
    private router: Router,
    private readonly notifications: NotificationService,
    private readonly postService: PostService
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
            
            // 1. Mostrar notificación en el header
            const notifMsg = `Creación de tu banda puesta en publicaciones!`;
            this.notifications.show(notifMsg);

            // 2. Crear publicación automática
            const nombreUsuario = this.sessionService.getNombreArtistico() ?? 'Alguien';
            const contenido = `${nombreUsuario} ha creado una banda llamada <a href='/mostrar-banda/${response.bandId}' class='text-blue-600 underline'>${response.nombre}</a> ¡vayan a darle un vistaso si desean!`;
            const usuarioId = this.sessionService.getUserId() ?? 0;
            this.postService.crearPost({ usuarioId, contenido, tipo: 'TEXTO' }).subscribe({
              next: () => {},
              error: () => {}
            });

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
