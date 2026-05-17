import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-crear-cuenta-usuario',
  standalone: false,
  templateUrl: './crear-cuenta-usuario.html',
  styleUrl: './crear-cuenta-usuario.css',
})
export class CrearCuentaUsuario {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  nombre = '';
  correo = '';
  contrasenia = '';
  rol = 'USUARIO';

  alertaVisible = false;
  alertaMensaje = '';
  alertaEsExito = false;
  cargando = false;

  registrar() {
    if (!this.nombre || !this.correo || !this.contrasenia || !this.rol) {
      this.mostrarAlerta('¡Debes llenar todos los campos!', false);
      return;
    }

    this.cargando = true;

    const nuevoUsuario = {
      nombre: this.nombre,
      correo: this.correo,
      contrasenia: this.contrasenia,
      rol: this.rol
    };

    this.authService.registrar(nuevoUsuario)
      .pipe(
        finalize(() => {
          this.cargando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (respuestaTexto) => {
          this.mostrarAlerta(respuestaTexto, true);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          if (err.status === 409) {
            this.mostrarAlerta('Error: Ese nombre ya está en uso. Intenta con otro.', false);
          } else {
            this.mostrarAlerta(`Error al registrar: ${err.error || 'No se pudo conectar con el servidor.'}`, false);
          }
          this.cdr.detectChanges();
        }
      });
  }

  mostrarAlerta(mensaje: string, exito: boolean) {
    this.alertaMensaje = mensaje;
    this.alertaEsExito = exito;
    this.alertaVisible = true;
  }

  cerrarAlerta() {
    this.alertaVisible = false;

    if (this.alertaEsExito) {
      setTimeout(() => {
        this.router.navigate(['/login-usuario']);
      }, 0);
    }
  }
}
