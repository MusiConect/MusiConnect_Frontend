import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-listar-perfiles',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './listar-perfiles.component.html',
    styleUrl: './listar-perfiles.component.css'
})
export class ListarPerfilesComponent implements OnInit {

    /** Lista completa de usuarios */
    users: User[] = [];

    constructor(private readonly userSvc: UserService, private readonly router: Router) {}

    ngOnInit(): void {
        this.userSvc.getAll().subscribe(data => (this.users = data));
    }

    /** Navega al perfil detallado */
    verPerfil(id: number): void {
        this.router.navigate(['/ver-perfil', id]);
    }
} 