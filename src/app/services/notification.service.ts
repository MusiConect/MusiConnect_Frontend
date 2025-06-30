import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../models/notification.model';
import { map } from 'rxjs/operators';

/**
 * Servicio sencillo para notificaciones efímeras que cualquier componente puede emitir.
 * El `HeaderComponent` se subscribe y las muestra bajo el icono de Notificaciones.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
    /** Flujo reactivo con la lista de notificaciones (solo éxitos). La más reciente va primero. */
    private readonly _list$ = new BehaviorSubject<Notification[]>([]);

    /** Observable de solo lectura para los consumidores. */
    readonly list$: Observable<Notification[]> = this._list$.asObservable();

    /** Identificador incremental interno. */
    private nextId = 1;

    /** Toast efímero, usado principalmente por el interceptor de errores. */
    private readonly _toast$ = new BehaviorSubject<string | null>(null);
    readonly toast$: Observable<string | null> = this._toast$.asObservable();

    /**
     * Inserta una nueva notificación en el historial.
     * @param mensaje Texto a mostrar.
     * @param tipo    Tipo semántico opcional.
     * @param autoHide true → se eliminará después de 3 s.
     */
    push(
        mensaje: string,
        tipo: Notification['tipo'] = 'INFO',
        autoHide = false
    ): void {
        const notif: Notification = {
            id: this.nextId++,
            mensaje,
            fecha: new Date(),
            leida: false,
            tipo
        };

        this._list$.next([notif, ...this._list$.value]);

        if (autoHide) {
            setTimeout(() => this.remove(notif.id), 3000);
        }
    }

    /**
     * Alias de compatibilidad: se deja para el interceptor de errores.
     * Por defecto las notificaciones creadas mediante `show` se auto-ocultan.
     */
    show(mensaje: string): void {
        // Emitimos toast efímero; no lo almacenamos en el historial.
        this._toast$.next(mensaje);
        setTimeout(() => this._toast$.next(null), 3000);
    }

    /** Elimina la notificación con el ID indicado. */
    remove(id: number | string): void {
        const targetId = typeof id === 'string' ? +id : id;
        const updated = this._list$.value.filter((n) => n.id !== targetId);
        this._list$.next([...updated]);
    }

    /** Marca una notificación como leída (sin retirarla del historial). */
    markAsRead(id: number): void {
        this._list$.next(
            this._list$.value.map((n) =>
                n.id === id ? { ...n, leida: true } : n
            )
        );
    }

    /** Elimina todas las notificaciones. */
    clearAll(): void {
        this._list$.next([]);
    }

    /**
     * Devuelve el número de no leídas; útil para badges en UI.
     */
    getUnreadCount(): number {
        return this._list$.value.filter((n) => !n.leida).length;
    }

    // Métodos deprecados conservados por compatibilidad
    /** @deprecated Use list$ y métodos push/remove en su lugar. */
    get mensaje$(): Observable<string | null> {
        return this._list$.asObservable().pipe(
            // Emitir solo el último mensaje o null
            map((arr) => arr[0]?.mensaje ?? null)
        );
    }
} 