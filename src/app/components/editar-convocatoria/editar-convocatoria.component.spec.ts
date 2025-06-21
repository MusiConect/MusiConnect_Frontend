import { TestBed } from '@angular/core/testing';
import { EditarConvocatoriaComponent } from './editar-convocatoria.component';

describe('EditarConvocatoriaComponent', () => {
    it('should create', () => {
        const fixture = TestBed.configureTestingModule({
            imports: [EditarConvocatoriaComponent]
        }).createComponent(EditarConvocatoriaComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
}); 