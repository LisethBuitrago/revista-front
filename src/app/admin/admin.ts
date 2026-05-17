import {Component, OnInit, inject, ChangeDetectorRef} from '@angular/core';
import {Router} from '@angular/router';
import {UsuarioService} from '../services/usuario-service';
import {PublicacionService} from '../services/publicacion-service';
import {ComentarioService} from '../services/comentario-service';
import {EncriptadorService} from '../services/encriptador-service';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  usuario = {nombre: 'Administrador', rol: 'ADMINISTRADOR'};

  vistaActual: 'menu' | 'usuarios' | 'publicaciones' | 'crear-usuario' | 'editar-usuario' | 'editar-publicacion' = 'menu';

  usuarioSeleccionado: any = null;
  listaUsuarios: any[] = [];
  nuevoUsuario = {
    nombre: '',
    correo: '',
    rol: '',
    contrasenia: ''
  };

  listaPublicaciones: any[] = [];
  publicacionSeleccionada: any = null;
  alertaVisible = false;
  alertaMensaje = '';
  alertaEsExito = false;

  public todoDesencriptado: boolean = false;

  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private publicacionService = inject(PublicacionService);
  private comentarioService = inject(ComentarioService);
  private encriptadorService = inject(EncriptadorService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const nombreGuardado = localStorage.getItem('nombre');
    const rolGuardado = localStorage.getItem('rol');
    this.usuario.nombre = nombreGuardado || 'Administrador';
    this.usuario.rol = rolGuardado || 'ADMINISTRADOR';
    this.cargarUsuarios();

    // Escucha permanente al botón global de desencriptar del Navbar
    this.encriptadorService.cambiarCifrado$.subscribe(() => {
      this.alternarCifradoDesdeBackend();
    });
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
        this.nuevoUsuario = {nombre: '', correo: '', rol: '', contrasenia: ''};
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

  abrirEditarUsuario(user: any) {
    this.usuarioSeleccionado = {...user};
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

  cargarPublicaciones(): void {
    this.publicacionService.listarTodas().subscribe({
      next: (datos) => {
        this.listaPublicaciones = (datos || []).map(item => {
          const pub = {...item};

          this.encriptadorService.encriptar(pub.titulo).subscribe((res: any) => pub.titulo = res);
          this.encriptadorService.encriptar(pub.contenido).subscribe((res: any) => pub.contenido = res);

          return pub;
        });
        this.todoDesencriptado = false;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar publicaciones:', err)
    });
  }

  alternarCifradoDesdeBackend(): void {
    if (this.listaPublicaciones.length === 0) return;

    for (let i = 0; i < this.listaPublicaciones.length; i++) {
      const pub = this.listaPublicaciones[i];
      if (!this.todoDesencriptado) {
        this.encriptadorService.desencriptar(pub.titulo).subscribe((res: any) => pub.titulo = res);
        this.encriptadorService.desencriptar(pub.contenido).subscribe((res: any) => pub.contenido = res);
      } else {
        this.encriptadorService.encriptar(pub.titulo).subscribe((res: any) => pub.titulo = res);
        this.encriptadorService.encriptar(pub.contenido).subscribe((res: any) => pub.contenido = res);
      }
    }

    if (this.publicacionSeleccionada) {
      const seleccionada = this.publicacionSeleccionada;
      if (!this.todoDesencriptado) {
        this.encriptadorService.desencriptar(seleccionada.titulo).subscribe((res: any) => seleccionada.titulo = res);
        this.encriptadorService.desencriptar(seleccionada.contenido).subscribe((res: any) => seleccionada.contenido = res);
      } else {
        this.encriptadorService.encriptar(seleccionada.titulo).subscribe((res: any) => seleccionada.titulo = res);
        this.encriptadorService.encriptar(seleccionada.contenido).subscribe((res: any) => seleccionada.contenido = res);
      }
    }

    this.todoDesencriptado = !this.todoDesencriptado;
    this.cdr.detectChanges();
  }

  abrirEditarPublicacion(pub: any) {
    this.publicacionSeleccionada = {...pub};
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
