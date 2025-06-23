import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ListarBandasComponent } from './listar-bandas.component';
import { BandService } from '../../services/band.service';
import { SessionService } from '../../services/session.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BandResponse } from '../../models/band.model';

describe('ListarBandasComponent', () => {
  let component: ListarBandasComponent;
  let fixture: ComponentFixture<ListarBandasComponent>;
  let bandService: jasmine.SpyObj<BandService>;
  let sessionService: jasmine.SpyObj<SessionService>;
  let router: Router;

  const mockBands: BandResponse[] = [
    { bandId: 1, nombre: 'My Band', descripcion: 'Desc 1', administradorNombreArtistico: 'Admin', generosMusicales: [], message: '' },
    { bandId: 2, nombre: 'Other Band', descripcion: 'Desc 2', administradorNombreArtistico: 'Other', generosMusicales: [], message: '' }
  ];

  beforeEach(async () => {
    const bandServiceSpy = jasmine.createSpyObj('BandService', ['obtenerBandas', 'obtenerBandaPorId', 'eliminarBanda']);
    const sessionServiceSpy = jasmine.createSpyObj('SessionService', ['getNombreArtistico', 'getUserId']);

    await TestBed.configureTestingModule({
      imports: [ListarBandasComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: BandService, useValue: bandServiceSpy },
        { provide: SessionService, useValue: sessionServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListarBandasComponent);
    component = fixture.componentInstance;
    bandService = TestBed.inject(BandService) as jasmine.SpyObj<BandService>;
    sessionService = TestBed.inject(SessionService) as jasmine.SpyObj<SessionService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user\'s bands on init', () => {
    sessionService.getNombreArtistico.and.returnValue('Admin');
    bandService.obtenerBandas.and.returnValue(of(mockBands));

    fixture.detectChanges(); // ngOnInit

    expect(component.myBands.length).toBe(1);
    expect(component.myBands[0].nombre).toBe('My Band');
    expect(bandService.obtenerBandas).toHaveBeenCalled();
  });

  it('should handle search by ID successfully', () => {
    const searchedBand = mockBands[1];
    bandService.obtenerBandaPorId.and.returnValue(of(searchedBand));
    fixture.detectChanges();

    component.searchForm.setValue({ bandId: 2 });
    component.searchById();

    expect(component.searchedBand).toEqual(searchedBand);
    expect(bandService.obtenerBandaPorId).toHaveBeenCalledWith(2);
  });

  it('should handle search by ID error', () => {
    bandService.obtenerBandaPorId.and.returnValue(throwError(() => new Error('Not Found')));
    fixture.detectChanges();

    component.searchForm.setValue({ bandId: 99 });
    component.searchById();

    expect(component.searchError).toBe('No se encontró ninguna banda con el ID 99.');
  });

  it('should navigate to edit band page', () => {
    spyOn(router, 'navigate');
    component.editBand(1);
    expect(router.navigate).toHaveBeenCalledWith(['/editar-banda', 1]);
  });

  it('should delete a band successfully', () => {
    sessionService.getNombreArtistico.and.returnValue('Admin');
    sessionService.getUserId.and.returnValue(10);
    bandService.obtenerBandas.and.returnValue(of(mockBands));
    bandService.eliminarBanda.and.returnValue(of({ message: 'Deleted' }));
    spyOn(window, 'confirm').and.returnValue(true);
    fixture.detectChanges();

    expect(component.myBands.length).toBe(1);
    component.deleteBand(1);
    expect(bandService.eliminarBanda).toHaveBeenCalledWith(1, 10);
    expect(component.myBands.length).toBe(0);
  });
});
