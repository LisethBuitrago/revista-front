import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService} from '../services/auth-service';

@Component({
  selector: 'app-login-administrador',
  standalone: false,
  templateUrl: './login-administrador.html',
  styleUrls: ['./login-administrador.css']
})
export class LoginAdministrador {
  correo = '';
  contrasena = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.correo || !this.contrasena) {
      this.errorMessage = 'Por favor ingresa correo y contraseña';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.loginConCorreo(this.correo, this.contrasena).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login exitoso', response);

        const rol = this.authService.getRol();

        if (rol === 'ADMINISTRADOR') {
          this.successMessage = '¡Inicio de sesión exitoso! Redirigiendo al panel de administrador...';

          setTimeout(() => {
            this.router.navigate(['/admin']);
          }, 1500);
        } else {

          this.errorMessage = 'Acceso denegado. Esta área es solo para administradores.';
          this.authService.logout();
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error:', error);

        if (typeof error.error === 'string') {
          this.errorMessage = error.error;
        } else if (error.status === 401) {
          this.errorMessage = 'Correo o contraseña incorrectos';
        } else if (error.status === 0) {
          this.errorMessage = 'No se puede conectar al servidor';
        } else {
          this.errorMessage = 'Error al iniciar sesión';
        }
      }
    });
  }
}
