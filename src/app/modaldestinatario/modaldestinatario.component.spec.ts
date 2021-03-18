import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaldestinatarioComponent } from './modaldestinatario.component';

describe('ModaldestinatarioComponent', () => {
  let component: ModaldestinatarioComponent;
  let fixture: ComponentFixture<ModaldestinatarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaldestinatarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaldestinatarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
