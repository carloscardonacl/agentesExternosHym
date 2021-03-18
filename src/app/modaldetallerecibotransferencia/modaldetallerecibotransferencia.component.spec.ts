import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaldetallerecibotransferenciaComponent } from './modaldetallerecibotransferencia.component';

describe('ModaldetallerecibotransferenciaComponent', () => {
  let component: ModaldetallerecibotransferenciaComponent;
  let fixture: ComponentFixture<ModaldetallerecibotransferenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModaldetallerecibotransferenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaldetallerecibotransferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
