import { Component } from '@angular/core';
import {Router} from '@angular/router';

interface Tarjeta {
  titulo: string;
  tipo: 'HORÓSCOPO' | 'NOTICIA';
  imagen: string;
}

@Component({
  selector: 'app-comentador',
  standalone: false,
  templateUrl: './comentador.html',
  styleUrl: './comentador.css',
})
export class Comentador {
  usuario = { nombre: 'Comentador1', rol: 'Comentador' };
  vistaActual: 'lista' | 'comentar' = 'lista';
  noticiaSeleccionada: Tarjeta | null = null;

  tarjetas: Tarjeta[] = [
    { titulo: 'Las estrellas dicen...', tipo: 'HORÓSCOPO', imagen:'https://depor.com/resizer/v2/5UEDBTDAIVC67FUUJR474F7ITA.jpg?auth=3756e394f1de56526b8ab7abab8356273de8fc0e4bf7ed3ec12ec6677f8726f8&width=3000&height=3000&quality=75&smart=true' },
    { titulo: 'Gran estreno en cines', tipo: 'NOTICIA', imagen:'https://i.ytimg.com/vi/hlGbKDBzdw4/maxresdefault.jpg' }
  ];
  tarjetasFiltradas: Tarjeta[] = [...this.tarjetas];

  constructor(private router: Router) {}

  abrirComentario(noticia: Tarjeta): void {
    this.noticiaSeleccionada = noticia;
    this.vistaActual = 'comentar';
  }

  filtrarPorCategoria(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const categoriaSeleccionada = selectElement.value.toUpperCase();
    if (categoriaSeleccionada === 'TODAS') {
      this.tarjetasFiltradas = this.tarjetas;
    } else {
      this.tarjetasFiltradas = this.tarjetas.filter(
        item => item.tipo === categoriaSeleccionada
      );
    }
  }
  cerrarSesion():void { this.router.navigate(['/login-usuario']); }
}
