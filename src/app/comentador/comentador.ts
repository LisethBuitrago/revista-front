import {Component, ChangeDetectorRef, OnInit, inject} from '@angular/core';
import {Router} from '@angular/router';
import {ComentarioService} from '../services/comentario-service';
import {EncriptadorService} from '../services/encriptador-service';
import {PublicacionService} from '../services/publicacion-service';
import {PublicacionModel} from '../models/publicacion.model';

@Component({
  selector: 'app-comentador',
  standalone: false,
  templateUrl: './comentador.html',
  styleUrl: './comentador.css',
})
export class Comentador implements OnInit {
  usuario = {
    nombre: 'Comentador1',
    role: 'Comentador',
    id: 1
  };

  vistaActual: 'lista' | 'comentar' = 'lista';
  noticiaSeleccionada: any = null;
  comentarioTexto: string = '';
  mensajeError: string = '';
  enviando: boolean = false;

  img1 = "https://i.ytimg.com/vi/hlGbKDBzdw4/maxresdefault.jpg";
  img2 = "https://depor.com/resizer/v2/5UEDBTDAIVC67FUUJR474F7ITA.jpg?auth=3756e394f1de56526b8ab7abab8356273de8fc0e4bf7ed3ec12ec6677f8726f8&width=3000&height=3000&quality=75&smart=true";

  tarjetas: any[] = [];
  tarjetasFiltradas: any[] = [];

  public todoDesencriptado: boolean = false;

  private router = inject(Router);
  private comentarioService = inject(ComentarioService);
  private encriptadorService = inject(EncriptadorService);
  private publicacionService = inject(PublicacionService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
  }

  ngOnInit(): void {
    this.cargarPublicacionesDelSistema();

    this.encriptadorService.cambiarCifrado$.subscribe(() => {
      this.alternarCifradoDesdeBackend();
    });
  }

  cargarPublicacionesDelSistema(): void {
    this.publicacionService.listarTodas().subscribe({
      next: (datos: PublicacionModel[]) => {
        this.tarjetas = datos.map(item => {
          const esHoroscopo = (item.tipo || '').toUpperCase() === 'HORÓSCOPO';

          const nuevaCard = {
            ...item,
            imagen: esHoroscopo ? this.img2 : this.img1
          };

          // 🔒 Requerimiento: Todo nace en estado encriptado en Base64
          this.encriptadorService.encriptar(item.titulo).subscribe((res: any) => nuevaCard.titulo = res);
          this.encriptadorService.encriptar(item.contenido).subscribe((res: any) => nuevaCard.contenido = res);

          return nuevaCard;
        });

        this.tarjetasFiltradas = [...this.tarjetas];
        this.todoDesencriptado = false;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error conectando a tu base de datos de Spring Boot:', err)
    });
  }

  alternarCifradoDesdeBackend(): void {
    if (this.tarjetas.length === 0) return;

    for (let i = 0; i < this.tarjetas.length; i++) {
      const item = this.tarjetas[i];
      if (!this.todoDesencriptado) {
        this.encriptadorService.desencriptar(item.titulo).subscribe((res: any) => item.titulo = res);
        this.encriptadorService.desencriptar(item.contenido).subscribe((res: any) => item.contenido = res);
      } else {
        this.encriptadorService.encriptar(item.titulo).subscribe((res: any) => item.titulo = res);
        this.encriptadorService.encriptar(item.contenido).subscribe((res: any) => item.contenido = res);
      }
    }

    if (this.noticiaSeleccionada) {
      const seleccionada = this.noticiaSeleccionada;
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

  validarLongitud(): void {
    if (this.comentarioTexto.length > 255) {
      this.mensajeError = 'El comentario no puede exceder los 255 caracteres.';
    } else {
      this.mensajeError = '';
    }
  }

  abrirComentario(noticia: any): void {
    this.noticiaSeleccionada = {...noticia};
    this.comentarioTexto = '';
    this.mensajeError = '';
    this.vistaActual = 'comentar';
  }

  enviarComentario(): void {
    if (this.comentarioTexto.length > 255) {
      this.mensajeError = 'El comentario excede el límite de 255 caracteres.';
      return;
    }

    if (!this.comentarioTexto || this.comentarioTexto.trim() === '') {
      this.mensajeError = 'El comentario no puede estar vacío';
      return;
    }

    if (!this.noticiaSeleccionada) {
      this.mensajeError = 'No hay noticia seleccionada';
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
        console.log('Comentario enviado:', respuesta);
        this.enviando = false;
        this.comentarioTexto = '';
        this.noticiaSeleccionada = null;
        this.mensajeError = '';
        this.vistaActual = 'lista';

        this.cdr.detectChanges();
        alert('¡Comentario enviado exitosamente!');
      },
      error: (error) => {
        console.error('Error al enviar:', error);

        if (error.status === 200 || error.status === 201) {
          this.enviando = false;
          this.comentarioTexto = '';
          this.noticiaSeleccionada = null;
          this.mensajeError = '';
          this.vistaActual = 'lista';

          this.cdr.detectChanges();
          alert('¡Comentario enviado exitosamente!');
        } else {
          this.mensajeError = `Error ${error.status}: Intente nuevamente.`;
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
        item => (item.tipo || '').toUpperCase() === categoriaSeleccionada
      );
    }
  }

  cerrarSesion(): void {
    this.router.navigate(['/login-usuario']);
  }
}
