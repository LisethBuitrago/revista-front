import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Tarjeta {
  titulo: string;
  tipo: 'HORÓSCOPO' | 'NOTICIA';
  imagen: string;
}

@Component({
  selector: 'app-editor',
  standalone: false,
  templateUrl: './editor.html',
  styleUrls: ['./editor.css']
})
export class Editor {

  usuario = {
    nombre: 'Editor1',
    rol: 'Editor'
  };

  vistaActual: 'menu' | 'crear' | 'comentar_lista' | 'comentar_detalle' = 'menu';

  noticiaSeleccionada: Tarjeta | null = null;
  tarjetas: Tarjeta[] = [
    { titulo: 'Las estrellas dicen...', tipo: 'HORÓSCOPO', imagen: 'https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/F403/production/_109476426_jheison3.png.webp' },
    { titulo: 'Gran estreno en cines', tipo: 'NOTICIA', imagen: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/UXETGRWJY5BS3MXAJLUPW2YBOQ.jpg' }
  ];
  tarjetasFiltradas: Tarjeta[] = [...this.tarjetas];

  constructor(private router: Router) {}

  cerrarSesion() {
    this.router.navigate(['/login-usuario']);
  }

  cambiarVista(vista: 'menu' | 'crear' | 'comentar_lista' | 'comentar_detalle') {
    this.vistaActual = vista;
    if(vista === 'comentar_lista') {
      this.tarjetasFiltradas = [...this.tarjetas];
    }
  }
  abrirComentario(noticia: Tarjeta): void {
    this.noticiaSeleccionada = noticia;
    this.vistaActual = 'comentar_detalle';
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
}
