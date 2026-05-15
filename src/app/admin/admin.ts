import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  usuario = { nombre: 'Administrador', rol: 'Administrador' };
  vistaActual: 'menu' | 'usuarios' | 'publicaciones' | 'crear-usuario' | 'editar-usuario' = 'menu';
  usuarioSeleccionado: any = null;
  constructor(private router: Router) {}
  cambiarVista(vista: any) {
    this.vistaActual = vista;
  }
  abrirEditarUsuario(user: any) {
    this.usuarioSeleccionado = { ...user };
    this.vistaActual = 'editar-usuario';
  }
  cerrarSesion() {
    this.router.navigate(['/login-administrador']);
  }
}
