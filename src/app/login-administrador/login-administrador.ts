import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-administrador',
  standalone: false,
  templateUrl: './login-administrador.html',
  styleUrl: './login-administrador.css',
})
export class LoginAdministrador {
  constructor(private router: Router) {
  }
  registrar() {
    this.router.navigate(['/admin']);
  }
}
