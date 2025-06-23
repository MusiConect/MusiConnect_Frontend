import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { EditarBandaComponent } from './editar-banda.component';
import { BandService } from '../../services/band.service';
import { SessionService } from '../../services/session.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BandResponse } from '../../models/band.model';

describe('EditarBandaComponent', () => {
  let component: EditarBandaComponent;
  let fixture: ComponentFixture<EditarBandaComponent>;
  let bandService: jasmine.SpyObj<BandService>;
  let sessionService: jasmine.SpyObj<SessionService>;
  let route: ActivatedRoute;

  const mockBand: BandResponse = {
    bandId: 1,
    nombre: 'Test Band',
    descripcion: 'Test Description',
    administradorNombreArtistico: 'Admin',
    generosMusicales: ['Rock'],
    message: ''
  };

  beforeEach(async () => {
    const bandServiceSpy = jasmine.createSpyObj('BandService', ['obtenerBandaPorId', 'updateBanda']);
    const sessionServiceSpy = jasmine.createSpyObj('SessionService', ['getUserId']);

    await TestBed.configureTestingModule({
      imports: [EditarBandaComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: BandService, useValue: bandServiceSpy },
        { provide: SessionService, useValue: sessionServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' }))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarBandaComponent);
    component = fixture.componentInstance;
    bandService = TestBed.inject(BandService) as jasmine.SpyObj<BandService>;
    sessionService = TestBed.inject(SessionService) as jasmine.SpyObj<SessionService>;
    route = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load band data on init', () => {
    bandService.obtenerBandaPorId.and.returnValue(of(mockBand));
    fixture.detectChanges(); // ngOnInit
    
    expect(component.band).toEqual(mockBand);
    expect(component.editForm.get('nombre')?.value).toBe('Test Band');
    expect(bandService.obtenerBandaPorId).toHaveBeenCalledWith(1);
  });

  it('should have correct validators', () => {
    bandService.obtenerBandaPorId.and.returnValue(of(mockBand));
    fixture.detectChanges();
    
    const nombreControl = component.editForm.get('nombre');
    nombreControl?.setValue('');
    expect(nombreControl?.hasError('required')).toBeTrue();
    nombreControl?.setValue('abc');
    expect(nombreControl?.hasError('minlength')).toBeTrue();
    nombreControl?.setValue('a'.repeat(51));
    expect(nombreControl?.hasError('maxlength')).toBeTrue();

    const generoControl = component.editForm.get('genero');
    generoControl?.setValue('');
    expect(generoControl?.hasError('required')).toBeTrue();

    const descripcionControl = component.editForm.get('descripcion');
    descripcionControl?.setValue('');
    expect(descripcionControl?.valid).toBeTrue(); // Optional
  });

  it('should handle successful update', fakeAsync(() => {
    bandService.obtenerBandaPorId.and.returnValue(of(mockBand));
    fixture.detectChanges();

    sessionService.getUserId.and.returnValue(10);
    bandService.updateBanda.and.returnValue(of({ message: 'Success' }));

    component.editForm.setValue({
      nombre: 'Updated Band',
      descripcion: 'Updated Desc',
      genero: 'Pop'
    });
    component.onSubmit();

    expect(bandService.updateBanda).toHaveBeenCalledWith(1, {
      nombre: 'Updated Band',
      descripcion: 'Updated Desc',
      generos: ['Pop'],
      adminId: 10
    });
    expect(component.successMessage).toBe('¡Banda actualizada exitosamente!');

    tick(2000);
    // Add assertion for router navigation if needed
  }));

  it('should handle update error', () => {
    bandService.obtenerBandaPorId.and.returnValue(of(mockBand));
    fixture.detectChanges();

    sessionService.getUserId.and.returnValue(10);
    const errorResponse = { error: { message: 'Update failed' } };
    bandService.updateBanda.and.returnValue(throwError(() => errorResponse));

    component.editForm.setValue({
      nombre: 'Fail Band',
      descripcion: '',
      genero: 'Jazz'
    });
    component.onSubmit();

    expect(component.errorMessage).toBe('Update failed');
  });
});
