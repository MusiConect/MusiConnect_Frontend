import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerPerfilComponent } from './ver-perfil.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { UserService } from '../../services/user.service';
import { SessionService } from '../../services/session.service';

describe('VerPerfilComponent', () => {
    let component: VerPerfilComponent;
    let fixture: ComponentFixture<VerPerfilComponent>;

    // Stubs
    const activatedRouteStub = {
        snapshot: { paramMap: { get: () => '1' } }
    } as unknown as ActivatedRoute;

    const userServiceStub = {
        getById: () => of({
            userId: 1,
            email: 'test@test.com',
            nombreArtistico: 'Test User',
            instrumentos: 'Guitarra',
            bio: 'Músico de prueba',
            ubicacion: 'La Paz',
            disponibilidad: true,
            role: 'MUSICO',
            generosMusicales: ['ROCK']
        })
    } as unknown as UserService;

    const sessionStub = { getUserId: () => 1 } as unknown as SessionService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VerPerfilComponent],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: UserService, useValue: userServiceStub },
                { provide: SessionService, useValue: sessionStub }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(VerPerfilComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
}); 