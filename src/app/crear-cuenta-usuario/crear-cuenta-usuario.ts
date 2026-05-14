import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-crear-cuenta-usuario',
  standalone: false,
  templateUrl: './crear-cuenta-usuario.html',
  styleUrl: './crear-cuenta-usuario.css',
})
export class CrearCuentaUsuario {
  constructor(private router: Router) {
  }
  registrar() {
    this.router.navigate(['/login-usuario']);
  }
}
