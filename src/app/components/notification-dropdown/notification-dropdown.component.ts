import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';

/**
 * Cuadro flotante que lista las notificaciones almacenadas en `NotificationService`.
 */
@Component({
    selector: 'app-notification-dropdown',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './notification-dropdown.component.html',
    styleUrl: './notification-dropdown.component.css'
})
export class NotificationDropdownComponent {
    /** Controla la visibilidad externa. */
    @Input() open = false;

    /** Flujo reactivo con todas las notificaciones. */
    readonly notifs$: Observable<Notification[]>;

    constructor(private readonly notifications: NotificationService) {
        this.notifs$ = this.notifications.list$;
    }

    /** Marca una notificación como leída. */
    markAsRead(id: number): void {
        this.notifications.markAsRead(id);
    }

    /** Elimina una notificación del historial. */
    remove(id: number, e?: Event): void {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.notifications.remove(id);
    }

    /** Elimina todas las notificaciones. */
    clearAll(): void {
        this.notifications.clearAll();
    }

    /** trackBy para optimizar rendering */
    trackById(_: number, item: Notification): number {
        return item.id;
    }
} 