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

  listaUsuarios = [
    { nombre: 'Usuario1', correo: 'usuario1@gmail.com', rol: 'usuario' },
    { nombre: 'Usuario2', correo: 'usuario2@gmail.com', rol: 'editor' },
    { nombre: 'Usuario3', correo: 'usuario3@gmail.com', rol: 'comentador' }
  ];
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
