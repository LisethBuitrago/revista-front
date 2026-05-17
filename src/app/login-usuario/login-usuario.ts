import { Component, ChangeDetectorRef } from '@angular/core';
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
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit() {
    if (!this.correo || !this.contrasena) {
      this.errorMessage = 'Por favor ingresa correo y contraseña';
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    this.authService.loginConCorreo(this.correo, this.contrasena).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Login exitoso', response);

        if (response) {
          if (response.id) {
            localStorage.setItem('idUsuario', response.id.toString());
          }
          if (response.nombre) {
            localStorage.setItem('nombre', response.nombre);
          } else if (response.nombreUsuario) {
            localStorage.setItem('nombre', response.nombreUsuario);
          }
        }

        this.successMessage = '¡Inicio de sesión exitoso! Redirigiendo...';
        this.cdr.detectChanges();

        const rol = this.authService.getRol();

        setTimeout(() => {
          this.redirigirPorRol(rol);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        this.successMessage = '';
        console.error('Error:', error);

        if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'No se pudo iniciar sesión. Correo o contraseña incorrectos, por favor intenta nuevamente.';
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo iniciar sesión. No hay conexión con el servidor, por favor intenta nuevamente.';
        } else {
          this.errorMessage = 'No se pudo iniciar sesión. Por favor intenta nuevamente.';
        }

        this.cdr.detectChanges();
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
