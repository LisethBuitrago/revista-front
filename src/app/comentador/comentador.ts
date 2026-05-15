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
    { titulo: 'Las estrellas dicen...', tipo: 'HORÓSCOPO', imagen: 'https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/F403/production/_109476426_jheison3.png.webp' },
    { titulo: 'Gran estreno en cines', tipo: 'NOTICIA', imagen: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/UXETGRWJY5BS3MXAJLUPW2YBOQ.jpg' }
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
