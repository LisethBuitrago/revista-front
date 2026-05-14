import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editor',
  standalone: false,
  templateUrl: './editor.html',
  styleUrls: ['./editor.css']
})
export class Editor {

  usuario = {
    nombre: 'Angie Villarreal',
    rol: 'Editor'
  };
  vistaActual: 'menu' | 'crear' | 'comentar' = 'menu';
  constructor(private router: Router) {}
  cerrarSesion() {
    this.router.navigate(['/login-usuario']);
  }
  cambiarVista(vista: 'menu' | 'crear' | 'comentar') {
    this.vistaActual = vista;
  }
}
