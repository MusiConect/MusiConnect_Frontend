import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { LoginRequest, AuthResponse } from '../../models/auth.model';

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

    constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
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
                localStorage.setItem('token', res.token);
                this.isError = false;
                this.mensaje = res.mensaje;
                setTimeout(() => this.router.navigate(['/crear-colaboracion']), 1000);
            },
            error: err => {
                this.isError = true;
                this.mensaje = err.error?.mensaje ?? 'Error inesperado';
                setTimeout(() => (this.mensaje = ''), 5000);
            }
        });
    }
} 