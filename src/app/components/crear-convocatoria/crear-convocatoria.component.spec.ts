import { TestBed } from '@angular/core/testing';
import { CrearConvocatoriaComponent } from './crear-convocatoria.component';

describe('CrearConvocatoriaComponent', () => {
    it('should create', () => {
        const fixture = TestBed.configureTestingModule({
            imports: [CrearConvocatoriaComponent]
        }).createComponent(CrearConvocatoriaComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });
}); 