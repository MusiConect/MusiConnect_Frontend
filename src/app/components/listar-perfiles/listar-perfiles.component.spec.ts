import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ListarPerfilesComponent } from './listar-perfiles.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

describe('ListarPerfilesComponent', () => {
    let component: ListarPerfilesComponent;
    let fixture: ComponentFixture<ListarPerfilesComponent>;
    let userSvcSpy: jasmine.SpyObj<UserService>;

    const mockUsers: User[] = [
        {
            userId: 1,
            email: 'test@example.com',
            nombreArtistico: 'Artist1',
            instrumentos: 'Guitarra',
            bio: 'Bio',
            ubicacion: 'Ciudad',
            disponibilidad: true,
            role: 'MUSICO',
            generosMusicales: []
        }
    ];

    beforeEach(async () => {
        userSvcSpy = jasmine.createSpyObj('UserService', ['getAll']);
        userSvcSpy.getAll.and.returnValue(of(mockUsers));

        await TestBed.configureTestingModule({
            imports: [ListarPerfilesComponent, HttpClientTestingModule, RouterTestingModule],
            providers: [{ provide: UserService, useValue: userSvcSpy }]
        }).compileComponents();

        fixture = TestBed.createComponent(ListarPerfilesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('debe crearse', () => {
        expect(component).toBeTruthy();
    });

    it('debe cargar usuarios al inicializar', () => {
        expect(component.users.length).toBe(1);
        expect(userSvcSpy.getAll).toHaveBeenCalledTimes(1);
    });
}); 