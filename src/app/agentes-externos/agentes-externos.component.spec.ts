import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentesExternosComponent } from './agentes-externos.component';

describe('AgentesExternosComponent', () => {
  let component: AgentesExternosComponent;
  let fixture: ComponentFixture<AgentesExternosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentesExternosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentesExternosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
