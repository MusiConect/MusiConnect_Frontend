import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MostrarColaboracionComponent } from './mostrar-colaboracion.component';
import { CollaborationService } from '../../services/collaboration.service';
import { SessionService } from '../../services/session.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

/** Mock CollaborationService */
class CollaborationServiceMock {
    getById = jasmine.createSpy('getById');
}

/** Mock SessionService */
class SessionServiceMock {
    getUserId = jasmine.createSpy('getUserId');
}

describe('MostrarColaboracionComponent', () => {
    let component: MostrarColaboracionComponent;
    let fixture: ComponentFixture<MostrarColaboracionComponent>;
    let collabSvc: CollaborationServiceMock;
    let sessionSvc: SessionServiceMock;

    beforeEach(async () => {
        collabSvc = new CollaborationServiceMock();
        sessionSvc = new SessionServiceMock();

        await TestBed.configureTestingModule({
            imports: [MostrarColaboracionComponent, RouterTestingModule],
            providers: [
                { provide: CollaborationService, useValue: collabSvc },
                { provide: SessionService, useValue: sessionSvc }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(MostrarColaboracionComponent);
        component = fixture.componentInstance;
    });

    it('debe ocultar el botón Editar si el usuario no es dueño', () => {
        collabSvc.getById.and.returnValue(of({ colaboracionId: 1, titulo: 'Demo', descripcion: 'Desc', estado: 'pendiente', usuarioId: 99, nombreUsuario: 'Otro', colaboradores: [] }));
        sessionSvc.getUserId.and.returnValue(1); // id diferente

        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('button');
        expect(button).toBeNull();
    });

    it('debe mostrar el botón Editar si el usuario es dueño', () => {
        collabSvc.getById.and.returnValue(of({ colaboracionId: 1, titulo: 'Demo', descripcion: 'Desc', estado: 'pendiente', usuarioId: 5, nombreUsuario: 'Dueño', colaboradores: [] }));
        sessionSvc.getUserId.and.returnValue(5);

        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('button');
        expect(button?.textContent).toContain('Editar');
    });
}); 