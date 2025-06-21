import { TestBed } from '@angular/core/testing';
import { ListarConvocatoriasComponent } from './listar-convocatorias.component';

describe('ListarConvocatoriasComponent', () => {
    it('should create', () => {
        const fixture = TestBed.configureTestingModule({
            imports: [ListarConvocatoriasComponent]
        }).createComponent(ListarConvocatoriasComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
}); 