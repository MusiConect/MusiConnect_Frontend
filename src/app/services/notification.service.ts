import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Servicio sencillo para notificaciones efímeras que cualquier componente puede emitir.
 * El `HeaderComponent` se subscribe y las muestra bajo el icono de Notificaciones.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
    /** Flujo interno con la notificación actual (o null si no hay). */
    private readonly _mensaje$ = new BehaviorSubject<string | null>(null);

    /** Observable de solo lectura para los consumidores. */
    readonly mensaje$: Observable<string | null> = this._mensaje$.asObservable();

    /**
     * Publica un nuevo mensaje de notificación. Se reemplaza cualquier mensaje previo.
     * @param mensaje Texto a mostrar al usuario.
     */
    show(mensaje: string): void {
        this._mensaje$.next(mensaje);
    }

    /** Borra la notificación actual. */
    clear(): void {
        this._mensaje$.next(null);
    }
} 