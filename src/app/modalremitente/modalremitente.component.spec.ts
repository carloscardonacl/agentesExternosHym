import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalremitenteComponent } from './modalremitente.component';

describe('ModalremitenteComponent', () => {
  let component: ModalremitenteComponent;
  let fixture: ComponentFixture<ModalremitenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalremitenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalremitenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
