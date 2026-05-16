import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService} from '../services/auth-service';

@Component({
  selector: 'app-login-usuario',
  standalone: false,
  templateUrl: './login-usuario.html',
  styleUrls: ['./login-usuario.css']
})
export class LoginUsuario {
  correo: string = '';
  contrasena: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

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

        // Mostrar mensaje de éxito
        this.successMessage = '¡Inicio de sesión exitoso! Redirigiendo...';

        // Obtener el rol del usuario
        const rol = this.authService.getRol();

        // Redirigir según el rol después de 1.5 segundos
        setTimeout(() => {
          this.redirigirPorRol(rol);
        }, 1500);
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

  private redirigirPorRol(rol: string | null) {
    switch (rol) {
      case 'EDITOR':
        this.router.navigate(['/editor']);
        break;
      case 'COMENTADOR':
        this.router.navigate(['/comentador']);
        break;
      case 'USUARIO':
        this.router.navigate(['/usuario']);
        break;
      case 'ADMINISTRADOR':
        this.router.navigate(['/admin']);
        break;
      default:
        this.router.navigate(['/usuario']);
        break;
    }
  }
}
