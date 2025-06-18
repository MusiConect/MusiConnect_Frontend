import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarColaboracionComponent } from './editar-colaboracion.component';

describe('EditarColaboracionComponent', () => {
  let component: EditarColaboracionComponent;
  let fixture: ComponentFixture<EditarColaboracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarColaboracionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarColaboracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
