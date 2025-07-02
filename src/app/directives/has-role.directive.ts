import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { Role } from '../models/role.model';
import { SessionService } from '../services/session.service';

/**
 * Directiva estructural que muestra u oculta el elemento según el rol actual.
 * Uso:
 *   <div *appHasRole="'MUSICO'">Solo músicos</div>
 *   <div *appHasRole="['MUSICO','PRODUCTOR']">Ambos</div>
 */
@Directive({
    selector: '[appHasRole]',
    standalone: true
})
export class HasRoleDirective implements OnInit {
    private allowedRoles: Role[] = [];

    @Input('appHasRole') set appHasRole(value: Role | Role[] | string | string[]) {
        // Permitimos que se pase texto literal en plantilla
        const valores = Array.isArray(value) ? value : [value];
        // Normalizamos a tipo Role (ignoramos case y espacios)
        this.allowedRoles = valores.map((v) => (typeof v === 'string' ? v.toUpperCase() : v)) as Role[];
        this.updateView();
    }

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private session: SessionService
    ) {}

    ngOnInit(): void {
        this.updateView();
    }

    private updateView(): void {
        const userRole = this.session.getRole();
        if (userRole && this.allowedRoles.includes(userRole)) {
            if (this.viewContainer.length === 0) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            }
        } else {
            this.viewContainer.clear();
        }
    }
} 