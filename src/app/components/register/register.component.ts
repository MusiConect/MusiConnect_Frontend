import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

/**
 * Componente de registro de usuario tal como se muestra en el diseño Figma.
 * Incluye los campos de correo, nombre de usuario, contraseña, repetir contraseña,
 * país y un selector exclusivo entre los roles MUSICO y PRODUCTOR.
 */
@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    /** Formulario reactivo que almacena todos los campos visibles. */
    public registerForm: FormGroup;
    public mensaje: string = '';
    public isError: boolean = false;

    constructor(private readonly fb: FormBuilder, private authService: AuthService, private router: Router) {
        this.registerForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            username: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            country: ['', Validators.required],
            role: ['MUSICO', Validators.required]
        });
    }

    /**
     * Devuelve true si el rol indicado coincide con el seleccionado en el formulario.
     */
    public isRoleSelected(role: 'MUSICO' | 'PRODUCTOR'): boolean {
        return this.registerForm.get('role')?.value === role;
    }

    /**
     * Marca el rol proporcionado como seleccionado en el formulario.
     */
    public selectRole(role: 'MUSICO' | 'PRODUCTOR'): void {
        this.registerForm.get('role')?.setValue(role);
    }

    /**
     * Envía el formulario. Actualmente solo imprime el valor por consola hasta conectar con backend.
     */
    public onSubmit(): void {
        if (this.registerForm.valid) {
            const form = this.registerForm.value;
            const roleId = form.role === 'MUSICO' ? 2 : 3;
            const payload = {
                email: form.email,
                password: form.password,
                nombreArtistico: form.username,
                ubicacion: form.country,
                roleId
            } as const;
            this.authService.register(payload).subscribe({
                next: (res) => {
                    localStorage.setItem('token', res.token);
                    this.isError = false;
                    this.mensaje = res.mensaje ?? 'Registro exitoso';
                    setTimeout(() => this.router.navigate(['/crear-colaboracion']), 1000);
                },
                error: (err) => {
                    this.isError = true;
                    this.mensaje = err.error?.mensaje ?? 'Error inesperado.';
                    setTimeout(() => (this.mensaje = ''), 5000);
                }
            });
        } else {
            console.warn('Formulario inválido');
        }
    }
} 