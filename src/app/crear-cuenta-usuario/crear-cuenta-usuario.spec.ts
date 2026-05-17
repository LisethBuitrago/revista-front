import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCuentaUsuario } from './crear-cuenta-usuario';

describe('CrearCuentaUsuario', () => {
  let component: CrearCuentaUsuario;
  let fixture: ComponentFixture<CrearCuentaUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearCuentaUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearCuentaUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
