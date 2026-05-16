import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth-service';

@Component({
  selector: 'app-crear-cuenta-usuario',
  standalone: false,
  templateUrl: './crear-cuenta-usuario.html',
  styleUrl: './crear-cuenta-usuario.css',
})
export class CrearCuentaUsuario {
  private authService = inject(AuthService);
  private router = inject(Router);

  nombre: string = '';
  correo: string = '';
  contrasenia: string = '';
  rol: string = 'USUARIO';

  registrar() {
    if (!this.nombre || !this.correo || !this.contrasenia || !this.rol) {
      alert('¡Debes llenar todos los campos!');
      return;
    }

    const nuevoUsuario = {
      nombre: this.nombre,
      correo: this.correo,
      contrasenia: this.contrasenia,
      rol: this.rol
    };

    this.authService.registrar(nuevoUsuario).subscribe({
      next: (respuestaTexto) => {
        alert(respuestaTexto);
        this.router.navigate(['/login-usuario']);
      },
      error: (err) => {
        console.error(err);
        if (err.status === 409) {
          alert('Error: Ese nombre ya está en uso. Intenta con otro.');
        } else {
          alert('Error al registrar: ' + (err.error || 'No se pudo conectar con el servidor.'));
        }
      }
    });
  }
}
