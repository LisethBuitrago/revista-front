import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ComentarioService } from '../services/comentario-service';

interface Tarjeta {
  id: number;
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
  usuario = {
    nombre: 'Comentador1',
    rol: 'Comentador',
    id: 1
  };

  vistaActual: 'lista' | 'comentar' = 'lista';
  noticiaSeleccionada: Tarjeta | null = null;
  comentarioTexto: string = '';
  mensajeError: string = '';
  enviando: boolean = false;

  tarjetas: Tarjeta[] = [
    {
      id: 1,
      titulo: 'Las estrellas dicen...',
      tipo: 'HORÓSCOPO',
      imagen: 'https://depor.com/resizer/v2/5UEDBTDAIVC67FUUJR474F7ITA.jpg?auth=3756e394f1de56526b8ab7abab8356273de8fc0e4bf7ed3ec12ec6677f8726f8&width=3000&height=3000&quality=75&smart=true'
    },
    {
      id: 2,
      titulo: 'Gran estreno en cines',
      tipo: 'NOTICIA',
      imagen: 'https://i.ytimg.com/vi/hlGbKDBzdw4/maxresdefault.jpg'
    }
  ];

  tarjetasFiltradas: Tarjeta[] = [...this.tarjetas];

  constructor(
    private router: Router,
    private comentarioService: ComentarioService,
    private cdr: ChangeDetectorRef
  ) {}

  validarLongitud(): void {
    if (this.comentarioTexto.length > 255) {
      this.mensajeError = '❌ El comentario no puede exceder los 255 caracteres.';
    } else {
      this.mensajeError = '';
    }
  }

  abrirComentario(noticia: Tarjeta): void {
    this.noticiaSeleccionada = noticia;
    this.comentarioTexto = '';
    this.mensajeError = '';
    this.vistaActual = 'comentar';
  }

  enviarComentario(): void {
    if (this.comentarioTexto.length > 255) {
      this.mensajeError = '❌ El comentario excede el límite de 255 caracteres.';
      return;
    }

    if (!this.comentarioTexto || this.comentarioTexto.trim() === '') {
      this.mensajeError = '❌ El comentario no puede estar vacío';
      return;
    }

    if (!this.noticiaSeleccionada) {
      this.mensajeError = '❌ No hay noticia seleccionada';
      return;
    }

    this.enviando = true;
    this.mensajeError = '';

    const comentarioParaEnviar = {
      texto: this.comentarioTexto.trim(),
      publicacionId: this.noticiaSeleccionada.id,
      editorId: this.usuario.id
    };

    this.comentarioService.crear(comentarioParaEnviar).subscribe({
      next: (respuesta) => {
        console.log('✅ Comentario enviado:', respuesta);
        this.enviando = false;
        this.comentarioTexto = '';
        this.noticiaSeleccionada = null;
        this.mensajeError = '';
        this.vistaActual = 'lista';

        this.cdr.detectChanges();
        alert('¡Comentario enviado exitosamente!');
      },
      error: (error) => {
        console.error('❌ Error al enviar:', error);

        if (error.status === 200 || error.status === 201) {
          this.enviando = false;
          this.comentarioTexto = '';
          this.noticiaSeleccionada = null;
          this.mensajeError = '';
          this.vistaActual = 'lista';

          this.cdr.detectChanges();
          alert('¡Comentario enviado exitosamente!');
        } else {
          this.mensajeError = `❌ Error ${error.status}: Intente nuevamente.`;
          this.enviando = false;

          this.cdr.detectChanges();
        }
      }
    });
  }

  filtrarPorCategoria(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const categoriaSeleccionada = selectElement.value.toUpperCase();

    if (categoriaSeleccionada === 'TODAS') {
      this.tarjetasFiltradas = [...this.tarjetas];
    } else {
      this.tarjetasFiltradas = this.tarjetas.filter(
        item => item.tipo === categoriaSeleccionada
      );
    }
  }

  cerrarSesion(): void {
    this.router.navigate(['/login-usuario']);
  }
}
