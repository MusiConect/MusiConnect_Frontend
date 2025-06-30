import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { LoginRequest, AuthResponse } from '../../models/auth.model';
import { SessionService } from '../../services/session.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    public loginForm: FormGroup;
    mensaje = '';
    isError = false;

    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private session: SessionService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.invalid) return;
        const payload: LoginRequest = this.loginForm.value;
        this.auth.login(payload).subscribe({
            next: (res: AuthResponse) => {
                this.session.setSession(res);
                this.isError = false;
                this.mensaje = res.mensaje;
                const id = res.userId;
                setTimeout(() => this.router.navigate(['/ver-perfil', id]), 1000);
            },
            error: (err: HttpErrorResponse) => {
                this.isError = true;
                // Prioriza mensaje del backend; fallback genérico.
                if (err.error) {
                    this.mensaje = err.error.error ?? err.error.mensaje ?? 'Error inesperado.';
                } else if (err.status === 0) {
                    this.mensaje = 'No se pudo conectar con el servidor.';
                } else {
                    this.mensaje = `Error inesperado (código ${err.status}).`;
                }
                setTimeout(() => (this.mensaje = ''), 5000);
            }
        });
    }
} 