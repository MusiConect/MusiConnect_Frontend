import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
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

    /**
     * Lista completa de países reconocidos por la ONU en español.
     * Se expone al template para poblar el selector de país.
     */
    readonly paises: readonly string[] = [
        'Afganistán', 'Albania', 'Alemania', 'Andorra', 'Angola', 'Antigua y Barbuda',
        'Arabia Saudita', 'Argelia', 'Argentina', 'Armenia', 'Australia', 'Austria',
        'Azerbaiyán', 'Bahamas', 'Bangladés', 'Barbados', 'Baréin', 'Bélgica',
        'Belice', 'Benín', 'Bielorrusia', 'Birmania', 'Bolivia', 'Bosnia y Herzegovina',
        'Botsuana', 'Brasil', 'Brunéi', 'Bulgaria', 'Burkina Faso', 'Burundi',
        'Bután', 'Cabo Verde', 'Camboya', 'Camerún', 'Canadá', 'Catar', 'Chad',
        'Chile', 'China', 'Chipre', 'Ciudad del Vaticano', 'Colombia', 'Comoras',
        'Corea del Norte', 'Corea del Sur', 'Costa de Marfil', 'Costa Rica', 'Croacia',
        'Cuba', 'Dinamarca', 'Dominica', 'Ecuador', 'Egipto', 'El Salvador',
        'Emiratos Árabes Unidos', 'Eritrea', 'Eslovaquia', 'Eslovenia', 'España',
        'Estados Unidos', 'Estonia', 'Etiopía', 'Filipinas', 'Finlandia', 'Fiyi',
        'Francia', 'Gabón', 'Gambia', 'Georgia', 'Ghana', 'Granada', 'Grecia',
        'Guatemala', 'Guyana', 'Guinea', 'Guinea-Bisáu', 'Guinea Ecuatorial', 'Haití',
        'Honduras', 'Hungría', 'India', 'Indonesia', 'Irak', 'Irán', 'Irlanda',
        'Islandia', 'Islas Marshall', 'Islas Salomón', 'Israel', 'Italia', 'Jamaica',
        'Japón', 'Jordania', 'Kazajistán', 'Kenia', 'Kirguistán', 'Kiribati',
        'Kuwait', 'Laos', 'Lesoto', 'Letonia', 'Líbano', 'Liberia', 'Libia',
        'Liechtenstein', 'Lituania', 'Luxemburgo', 'Macedonia del Norte', 'Madagascar',
        'Malasia', 'Malaui', 'Maldivas', 'Malí', 'Malta', 'Marruecos', 'Mauricio',
        'Mauritania', 'México', 'Micronesia', 'Moldavia', 'Mónaco', 'Mongolia',
        'Montenegro', 'Mozambique', 'Namibia', 'Nauru', 'Nepal', 'Nicaragua', 'Níger',
        'Nigeria', 'Noruega', 'Nueva Zelanda', 'Omán', 'Países Bajos', 'Pakistán',
        'Palaos', 'Panamá', 'Papúa Nueva Guinea', 'Paraguay', 'Perú', 'Polonia',
        'Portugal', 'Reino Unido', 'República Centroafricana', 'República Checa',
        'República del Congo', 'República Democrática del Congo', 'República Dominicana',
        'Ruanda', 'Rumanía', 'Rusia', 'Samoa', 'San Cristóbal y Nieves', 'San Marino',
        'San Vicente y las Granadinas', 'Santa Lucía', 'Santo Tomé y Príncipe',
        'Senegal', 'Serbia', 'Seychelles', 'Sierra Leona', 'Singapur', 'Siria',
        'Somalia', 'Sri Lanka', 'Suazilandia', 'Sudáfrica', 'Sudán', 'Sudán del Sur',
        'Suecia', 'Suiza', 'Surinam', 'Tailandia', 'Tanzania', 'Tayikistán',
        'Timor Oriental', 'Togo', 'Tonga', 'Trinidad y Tobago', 'Túnez',
        'Turkmenistán', 'Turquía', 'Tuvalu', 'Ucrania', 'Uganda', 'Uruguay',
        'Uzbekistán', 'Vanuatu', 'Venezuela', 'Vietnam', 'Yemen', 'Yibuti', 'Zambia',
        'Zimbabue'
    ];

    constructor(
        private readonly fb: FormBuilder,
        private authService: AuthService,
        private session: SessionService,
        private router: Router
    ) {
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
                    this.session.setSession(res);
                    this.isError = false;
                    this.mensaje = res.mensaje ?? 'Registro exitoso';
                    const id = res.userId;
                    setTimeout(() => this.router.navigate(['/ver-perfil', id]), 1000);
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