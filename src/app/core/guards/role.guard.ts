import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { Role } from '../../models/role.model';

/**
 * Guarda de ruta que permite el acceso solo a los roles indicados mediante data.roles.
 */
export const roleGuard: CanActivateFn = (route) => {
    const allowed = route.data?.['roles'] as Role[] | undefined;
    if (!allowed || allowed.length === 0) { return true; }

    const session = inject<SessionService>(SessionService);
    const router = inject(Router);

    const userRole = session.getRole();
    if (userRole && allowed.includes(userRole)) {
        return true;
    }
    router.navigate(['/home']);
    return false;
}; 