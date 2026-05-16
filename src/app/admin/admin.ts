import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario-service';
import { PublicacionService } from '../services/publicacion-service';
import { ComentarioService } from '../services/comentario-service';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  usuario = { nombre: 'Administrador', rol: 'ADMINISTRADOR' };

  vistaActual: 'menu' | 'usuarios' | 'publicaciones' | 'crear-usuario' | 'editar-usuario' | 'editar-publicacion' = 'menu';

  // -- Control de Usuarios --
  usuarioSeleccionado: any = null;
  listaUsuarios: any[] = [];
  nuevoUsuario = {
    nombre: '',
    correo: '',
    rol: '',
    contrasenia: ''
  };

  // -- Control de Publicaciones --
  listaPublicaciones: any[] = [];
  publicacionSeleccionada: any = null;

  // -- Alertas --
  alertaVisible = false;
  alertaMensaje = '';
  alertaEsExito = false;

  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private publicacionService = inject(PublicacionService);
  private comentarioService = inject(ComentarioService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const nombreGuardado = localStorage.getItem('nombre');
    const rolGuardado = localStorage.getItem('rol');
    this.usuario.nombre = nombreGuardado || 'Administrador';
    this.usuario.rol = rolGuardado || 'ADMINISTRADOR';
    this.cargarUsuarios();
  }

  // ==========================================
  //         MÓDULO DE USUARIOS
  // ==========================================
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

  // ==========================================
  //         MÓDULO DE PUBLICACIONES
  // ==========================================
  cargarPublicaciones(): void {
    this.publicacionService.listarTodas().subscribe({
      next: (datos) => {
        this.listaPublicaciones = datos || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar publicaciones:', err)
    });
  }

  abrirEditarPublicacion(pub: any) {
    this.publicacionSeleccionada = { ...pub };
    this.vistaActual = 'editar-publicacion';
  }

  guardarCambiosPublicacion() {
    if (!this.publicacionSeleccionada || !this.publicacionSeleccionada.titulo) {
      this.mostrarAlerta('¡El título no puede estar vacío!', false);
      return;
    }

    this.publicacionService.actualizar(this.publicacionSeleccionada.id, this.publicacionSeleccionada).subscribe({
      next: (respuesta) => {
        this.vistaActual = 'publicaciones';
        this.mostrarAlerta('¡Publicación actualizada correctamente!', true);
        this.cargarPublicaciones();
        this.publicacionSeleccionada = null;
      },
      error: (err) => {
        console.error('Error al actualizar publicación:', err);
        this.mostrarAlerta('Hubo un error al guardar los cambios de la publicación.', false);
      }
    });
  }

  eliminarPublicacion(id: number) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta publicación permanentemente?');
    if (confirmacion) {
      this.publicacionService.eliminar(id).subscribe({
        next: (respuesta) => {
          this.mostrarAlerta('Publicación eliminada del sistema.', true);
          this.cargarPublicaciones();
        },
        error: (err) => {
          console.error('Error al eliminar publicación:', err);
          this.mostrarAlerta('Hubo un error al intentar eliminar la publicación.', false);
        }
      });
    }
  }

  // ==========================================
  //         MÓDULO DE COMENTARIOS
  // ==========================================
  verComentarios(pub: any) {
    if (pub.mostrarComentarios) {
      pub.mostrarComentarios = false;
      return;
    }

    this.comentarioService.listarTodos().subscribe({
      next: (todos: any[]) => {
        pub.comentarios = (todos || []).filter(c => c.publicacionId === pub.id);
        pub.mostrarComentarios = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar comentarios:', err);
        this.mostrarAlerta('Hubo un problema cargando los comentarios.', false);
      }
    });
  }

  eliminarComentario(comentarioId: number, pub: any) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este comentario? Esta acción es irreversible.');

    if (confirmacion) {
      this.comentarioService.eliminar(comentarioId).subscribe({
        next: (respuesta) => {
          this.mostrarAlerta('Comentario eliminado exitosamente del sistema.', true);
          pub.comentarios = pub.comentarios.filter((c: any) => c.id !== comentarioId);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al eliminar comentario:', err);
          if (err.status === 200 || err.status === 202) {
            this.mostrarAlerta('Comentario eliminado exitosamente del sistema.', true);
            pub.comentarios = pub.comentarios.filter((c: any) => c.id !== comentarioId);
          } else {
            this.mostrarAlerta('Hubo un error al intentar eliminar el comentario.', false);
          }
          this.cdr.detectChanges();
        }
      });
    }
  }

  // ==========================================
  //         MÉTODOS GENERALES (UI)
  // ==========================================
  cambiarVista(vista: any) {
    this.vistaActual = vista;
    if (vista === 'usuarios') {
      this.cargarUsuarios();
    } else if (vista === 'publicaciones') {
      this.cargarPublicaciones();
    }
    this.cdr.detectChanges();
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

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login-administrador']);
  }
}
