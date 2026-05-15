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
  usuarioSeleccionado: { nombre: string; rol: string } | null = null;
  constructor(private router: Router) {}
  cambiarVista(vista: 'menu' | 'usuarios' | 'publicaciones' | 'crear-usuario' | 'editar-usuario'): void {
    this.vistaActual = vista;
  }
  abrirEditarUsuario(user: { nombre: string; rol: string }): void {
    this.usuarioSeleccionado = { ...user };
    this.vistaActual = 'editar-usuario';
  }
  cerrarSesion():void {
    this.router.navigate(['/login-administrador']);
  }
}
