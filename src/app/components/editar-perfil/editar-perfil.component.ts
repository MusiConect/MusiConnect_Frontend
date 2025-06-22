import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
    User,
    UserUpdateRequest
} from '../../models/user.model';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-editar-perfil',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './editar-perfil.component.html',
    styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit {
    /* -------------------- bindings -------------------- */
    nombreArtistico = '';
    email = '';
    bio = '';
    instrumentos = '';
    ubicacion = '';
    disponibilidad = false;

    /** Conjunto de géneros seleccionados */
    generosSeleccionados: Set<string> = new Set<string>();

    /** Lista fija de géneros válidos según `MusicGenreEnum` */
    readonly generosValidos: string[] = [
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
        'OTHER'
    ];

    /* -------------------- internos -------------------- */
    private userId: number | null = null;

    constructor(
        private readonly userSrv: UserService,
        private readonly sessionSrv: SessionService,
        private readonly router: Router
    ) {}

    /* -------------------- ciclo -------------------- */
    ngOnInit(): void {
        this.userId = this.sessionSrv.getUserId();
        if (this.userId === null) {
            // Sin sesión → fuera
            this.router.navigate(['/login']);
            return;
        }

        // Cargamos datos
        this.userSrv.getById(this.userId).subscribe({
            next: (u) => this.cargarUsuario(u),
            error: () => this.router.navigate(['/login'])
        });
    }

    /** Volcado de la respuesta a los bindings */
    private cargarUsuario(u: User): void {
        this.nombreArtistico = u.nombreArtistico;
        this.email = u.email;
        this.bio = u.bio ?? '';
        this.instrumentos = u.instrumentos ?? '';
        this.ubicacion = u.ubicacion ?? '';
        this.disponibilidad = u.disponibilidad ?? false;

        if (u.generosMusicales) {
            (u.generosMusicales as any[]).forEach((g) => {
                if (typeof g === 'string') {
                    this.generosSeleccionados.add(g);
                } else if (g.nombre) {
                    this.generosSeleccionados.add(g.nombre);
                }
            });
        }
    }

    /* -------------------- ui helpers -------------------- */
    /** Alterna un género dentro del `Set` de seleccionados */
    toggleGenero(genero: string): void {
        if (this.generosSeleccionados.has(genero)) {
            this.generosSeleccionados.delete(genero);
        } else {
            this.generosSeleccionados.add(genero);
        }
    }

    /* -------------------- acciones -------------------- */
    guardarCambios(): void {
        if (this.userId === null) return;

        const body: UserUpdateRequest = {
            email: this.email,
            bio: this.bio,
            ubicacion: this.ubicacion,
            instrumentos: this.instrumentos,
            disponibilidad: this.disponibilidad,
            generos: Array.from(this.generosSeleccionados)
        };

        this.userSrv.updateUser(this.userId, body).subscribe({
            next: () => alert('✅ Perfil actualizado correctamente.'),
            error: (e) => alert(e.error?.message ?? '❌ Error al actualizar perfil.')
        });
    }
} 