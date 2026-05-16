import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario-service';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  usuario = { nombre: 'Administrador', rol: 'ADMINISTRADOR' };
  vistaActual: 'menu' | 'usuarios' | 'publicaciones' | 'crear-usuario' | 'editar-usuario' = 'menu';
  usuarioSeleccionado: any = null;
  listaUsuarios: any[] = [];

  nuevoUsuario = {
    nombre: '',
    correo: '',
    rol: '',
    contrasenia: ''
  };

  alertaVisible = false;
  alertaMensaje = '';
  alertaEsExito = false;

  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const nombreGuardado = localStorage.getItem('nombre');
    const rolGuardado = localStorage.getItem('rol');
    this.usuario.nombre = nombreGuardado || 'Administrador';
    this.usuario.rol = rolGuardado || 'ADMINISTRADOR';
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listarTodos().subscribe({
      next: (datos) => {
        this.listaUsuarios = datos || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar la lista de usuarios:', err)
    });
  }

  registrarUsuario() {
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.correo || !this.nuevoUsuario.rol || !this.nuevoUsuario.contrasenia) {
      this.mostrarAlerta('¡Por favor completa todos los campos del formulario!', false);
      return;
    }

    const usuarioAEnviar = {
      nombre: this.nuevoUsuario.nombre,
      correo: this.nuevoUsuario.correo,
      contrasenia: this.nuevoUsuario.contrasenia,
      rol: this.nuevoUsuario.rol.toUpperCase()
    };

    this.usuarioService.crear(usuarioAEnviar).subscribe({
      next: (respuesta) => {
        this.vistaActual = 'usuarios';
        this.mostrarAlerta('¡Usuario registrado exitosamente!', true);
        this.cargarUsuarios();
        this.nuevoUsuario = { nombre: '', correo: '', rol: '', contrasenia: '' };
      },
      error: (err) => {
        console.error('Error al crear el usuario:', err);
        this.mostrarAlerta('Hubo un error al intentar registrar al usuario. Verifique los datos.', false);
      }
    });
  }
  eliminarUsuario(id: number) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar a este usuario de la revista? Esta acción no se puede deshacer.');
    if (confirmacion) {
      this.usuarioService.eliminar(id).subscribe({
        next: (respuesta) => {
          this.mostrarAlerta(respuesta || 'Usuario eliminado exitosamente.', true);
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error al eliminar el usuario:', err);
          this.mostrarAlerta('Hubo un error al intentar eliminar el usuario.', false);
        }
      });
    }
  }

  mostrarAlerta(mensaje: string, exito: boolean) {
    this.alertaMensaje = mensaje;
    this.alertaEsExito = exito;
    this.alertaVisible = true;
    this.cdr.detectChanges();
  }

  cerrarAlerta() {
    this.alertaVisible = false;
    this.cdr.detectChanges();
  }

  cambiarVista(vista: any) {
    this.vistaActual = vista;
    if (vista === 'usuarios') {
      this.cargarUsuarios();
    }
  }

  abrirEditarUsuario(user: any) {
    this.usuarioSeleccionado = { ...user };
    this.vistaActual = 'editar-usuario';
  }

  guardarCambios() {
    if (!this.usuarioSeleccionado || !this.usuarioSeleccionado.nombre || !this.usuarioSeleccionado.correo) {
      this.mostrarAlerta('¡Por favor no dejes el nombre ni el correo en blanco!', false);
      return;
    }

    const datosParaActualizar = {
      id: this.usuarioSeleccionado.id,
      nombre: this.usuarioSeleccionado.nombre,
      correo: this.usuarioSeleccionado.correo,
      rol: this.usuarioSeleccionado.rol
    };

    this.usuarioService.actualizar(datosParaActualizar.id, datosParaActualizar).subscribe({
      next: (respuesta) => {
        this.vistaActual = 'usuarios';
        this.mostrarAlerta('¡Usuario modificado correctamente!', true);
        this.cargarUsuarios();
        this.usuarioSeleccionado = null;
      },
      error: (err) => {
        console.error('Error al actualizar el usuario:', err);
        this.mostrarAlerta('Hubo un error al intentar guardar los cambios del usuario.', false);
      }
    });
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login-administrador']);
  }

}
