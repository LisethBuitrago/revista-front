import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAdministrador } from './login-administrador';

describe('LoginAdministrador', () => {
  let component: LoginAdministrador;
  let fixture: ComponentFixture<LoginAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
