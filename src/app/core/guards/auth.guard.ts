import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const token = localStorage.getItem('token');

    if ((state.url.startsWith('/register') || state.url.startsWith('/login')) && token) {
        router.navigate(['/crear-colaboracion']);
        return false;
    }

    if (!state.url.startsWith('/register') && !state.url.startsWith('/login') && !state.url.startsWith('/home') && !token) {
        router.navigate(['/register']);
        return false;
    }

    return true;
}; 