import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CrearBandaComponent } from './crear-banda.component';
import { BandService } from '../../services/band.service';
import { SessionService } from '../../services/session.service';
import { BandResponse } from '../../models/band.model';
import { RouterTestingModule } from '@angular/router/testing';

describe('CrearBandaComponent', () => {
  let component: CrearBandaComponent;
  let fixture: ComponentFixture<CrearBandaComponent>;
  let bandService: jasmine.SpyObj<BandService>;
  let sessionService: jasmine.SpyObj<SessionService>;
  let router: Router;

  const mockBandResponse: BandResponse = {
    bandId: 1,
    nombre: 'Test Band',
    descripcion: 'Test Description',
    administradorNombreArtistico: 'Test Admin',
    generosMusicales: ['Rock'],
    message: 'Banda creada exitosamente'
  };

  beforeEach(async () => {
    const bandServiceSpy = jasmine.createSpyObj('BandService', ['crearBanda']);
    const sessionServiceSpy = jasmine.createSpyObj('SessionService', ['getUserId']);

    await TestBed.configureTestingModule({
      imports: [
        CrearBandaComponent, 
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: BandService, useValue: bandServiceSpy },
        { provide: SessionService, useValue: sessionServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CrearBandaComponent);
    component = fixture.componentInstance;
    bandService = TestBed.inject(BandService) as jasmine.SpyObj<BandService>;
    sessionService = TestBed.inject(SessionService) as jasmine.SpyObj<SessionService>;
    router = TestBed.inject(Router);
    fixture.detectChanges(); // ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.bandForm.get('nombre')?.value).toBe('');
    expect(component.bandForm.get('descripcion')?.value).toBe('');
    expect(component.bandForm.get('genero')?.value).toBe('');
  });

  it('should have required validators on form fields', () => {
    const nombreControl = component.bandForm.get('nombre');
    const descripcionControl = component.bandForm.get('descripcion');
    const generoControl = component.bandForm.get('genero');

    nombreControl?.setValue('');
    descripcionControl?.setValue('');
    generoControl?.setValue('');

    expect(nombreControl?.hasError('required')).toBeTruthy();
    expect(descripcionControl?.hasError('required')).toBeTruthy();
    expect(generoControl?.hasError('required')).toBeTruthy();
  });

  it('should handle successful band creation', () => {
    sessionService.getUserId.and.returnValue(1);
    bandService.crearBanda.and.returnValue(of(mockBandResponse));
    
    component.bandForm.patchValue({
      nombre: 'Test Band',
      descripcion: 'This is a test description for the band.',
      genero: 'Rock'
    });
    
    component.onSubmit();
    
    expect(bandService.crearBanda).toHaveBeenCalledWith({
      nombre: 'Test Band',
      descripcion: 'This is a test description for the band.',
      generos: ['Rock'],
      adminId: 1
    });
    
    expect(component.successMessage).toBe('¡Banda "Test Band" creada exitosamente!');
    expect(component.isLoading).toBeFalse();
  });

  it('should handle band creation error', () => {
    sessionService.getUserId.and.returnValue(1);
    const errorResponse = { error: { message: 'Error creating band' } };
    bandService.crearBanda.and.returnValue(throwError(() => errorResponse));
    
    component.bandForm.patchValue({
      nombre: 'Test Band',
      descripcion: 'This is another test description.',
      genero: 'Pop'
    });
    
    component.onSubmit();
    
    expect(component.errorMessage).toBe('Error creating band');
    expect(component.isLoading).toBeFalse();
  });

  it('should redirect after successful creation', fakeAsync(() => {
    spyOn(router, 'navigate');
    sessionService.getUserId.and.returnValue(1);
    bandService.crearBanda.and.returnValue(of(mockBandResponse));
    
    component.bandForm.patchValue({
      nombre: 'Test Band',
      descripcion: 'This is a valid description.',
      genero: 'Rock'
    });
    
    component.onSubmit();
    
    expect(component.successMessage).toContain('creada exitosamente');
    
    tick(2000); // Simulate the 2-second delay
    
    expect(router.navigate).toHaveBeenCalledWith(['/bandas']);
  }));

  it('should not submit if user is not authenticated', () => {
    sessionService.getUserId.and.returnValue(null);
    
    component.bandForm.patchValue({
      nombre: 'No Auth Band',
      descripcion: 'This should not be submitted.',
      genero: 'Jazz'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Error: Usuario no autenticado');
    expect(bandService.crearBanda).not.toHaveBeenCalled();
  });

  it('should not submit if form is invalid', () => {
    component.onSubmit();
    expect(bandService.crearBanda).not.toHaveBeenCalled();
  });

  it('getFieldError should return required message', () => {
    const control = component.bandForm.get('nombre');
    control?.markAsTouched();
    control?.setValue('');
    expect(component.getFieldError('nombre')).toBe('Este campo es obligatorio');
  });

  it('getFieldError should return minlength message', () => {
    const control = component.bandForm.get('nombre');
    control?.markAsTouched();
    control?.setValue('A');
    expect(component.getFieldError('nombre')).toBe('Mínimo 2 caracteres');
  });

  it('getFieldError should return maxlength message', () => {
    const control = component.bandForm.get('descripcion');
    control?.markAsTouched();
    control?.setValue('a'.repeat(501));
    expect(component.getFieldError('descripcion')).toBe('Máximo 500 caracteres');
  });
});
