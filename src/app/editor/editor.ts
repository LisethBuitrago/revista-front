import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { EncriptadorService } from '../services/encriptador-service';
import { PublicacionService} from '../services/publicacion-service';
import { PublicacionModel } from '../models/publicacion.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-editor',
  standalone: false,
  templateUrl: './editor.html',
  styleUrls: ['./editor.css']
})
export class Editor implements OnInit {

  private router = inject(Router);
  private publicacionService = inject(PublicacionService);
  private encriptadorService = inject(EncriptadorService);
  private cdr = inject(ChangeDetectorRef);

  usuario = {
    id: 0,
    nombre: '',
    rol: ''
  };

  vistaActual: 'menu' | 'crear' | 'comentar_lista' | 'comentar_detalle' = 'menu';
  noticiaSeleccionada: any = null;

  img1 = "https://i.ytimg.com/vi/hlGbKDBzdw4/maxresdefault.jpg";
  img2 = "https://depor.com/resizer/v2/5UEDBTDAIVC67FUUJR474F7ITA.jpg?auth=3756e394f1de56526b8ab7abab8356273de8fc0e4bf7ed3ec12ec6677f8726f8&width=3000&height=3000&quality=75&smart=true";

  tarjetas: any[] = [];
  tarjetasFiltradas: any[] = [];

  nuevoTitulo = '';
  nuevoTipo = 'NOTICIA';
  nuevaImagen = '';
  nuevoContenido = '';
  cargando = false;

  alertaVisible = false;
  alertaMensaje = '';
  alertaEsExito = false;

  public todoDesencriptado: boolean = false;

  constructor() {}

  ngOnInit(): void {
    const idGuardado = localStorage.getItem('idUsuario');
    const nombreGuardado = localStorage.getItem('nombre');
    const rolGuardado = localStorage.getItem('rol');

    this.usuario.id = idGuardado ? parseInt(idGuardado, 10) : 0;
    this.usuario.nombre = nombreGuardado || 'Editor Anónimo';
    this.usuario.rol = rolGuardado || 'EDITOR';

    this.cargarPublicacionesDelSistema();

    this.encriptadorService.cambiarCifrado$.subscribe(() => {
      this.alternarCifradoDesdeBackend();
    });
  }

  cargarPublicacionesDelSistema(): void {
    this.publicacionService.listarTodas().subscribe({
      next: (datos: PublicacionModel[]) => {
        this.tarjetas = datos.map(item => {
          const esHoroscopo = item.tipo.toUpperCase() === 'HORÓSCOPO';

          const nuevaCard = {
            ...item,
            imagen: esHoroscopo ? this.img2 : this.img1
          };

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
      if (!this.todoDesencriptado) {
        this.encriptadorService.desencriptar(this.noticiaSeleccionada.titulo).subscribe((res: any) => this.noticiaSeleccionada.titulo = res);
        this.encriptadorService.desencriptar(this.noticiaSeleccionada.contenido).subscribe((res: any) => this.noticiaSeleccionada.contenido = res);
      } else {
        this.encriptadorService.encriptar(this.noticiaSeleccionada.titulo).subscribe((res: any) => this.noticiaSeleccionada.titulo = res);
        this.encriptadorService.encriptar(this.noticiaSeleccionada.contenido).subscribe((res: any) => this.noticiaSeleccionada.contenido = res);
      }
    }

    this.todoDesencriptado = !this.todoDesencriptado;
    this.cdr.detectChanges();
  }

  cambiarVista(vista: 'menu' | 'crear' | 'comentar_lista' | 'comentar_detalle') {
    this.vistaActual = vista;
    if (vista === 'comentar_lista') {
      this.cargarPublicacionesDelSistema();
    }
    this.cdr.detectChanges();
  }

  abrirComentario(noticia: any): void {
    this.noticiaSeleccionada = noticia;
    this.cambiarVista('comentar_detalle');
  }

  filtrarPorCategoria(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const categoria = selectElement.value.toUpperCase();

    if (categoria === 'TODAS') {
      this.tarjetasFiltradas = [...this.tarjetas];
    } else {
      this.tarjetasFiltradas = this.tarjetas.filter(
        item => item.tipo.toUpperCase() === categoria
      );
    }
    this.cdr.detectChanges();
  }

  crearPublicacion() {
    if (!this.nuevoTitulo || !this.nuevoContenido) {
      this.mostrarAlerta('¡Por favor llena todos los campos obligatorios (Título y Contenido)!', false);
      return;
    }

    this.cargando = true;

    const imagenAutomatica = this.nuevoTipo === 'HORÓSCOPO' ? this.img2 : this.img1;

    const nuevaPublicacion = {
      titulo: this.nuevoTitulo,
      tipo: this.nuevoTipo,
      imagen: imagenAutomatica,
      contenido: this.nuevoContenido,
      editorId: this.usuario.id
    };

    console.log('-> Intentando crear publicación automática:', nuevaPublicacion);

    this.publicacionService.crear(nuevaPublicacion)
      .pipe(
        finalize(() => {
          this.cargando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (respuestaTexto) => {
          console.log('-> Publicación creada con éxito:', respuestaTexto);
          this.mostrarAlerta('¡Publicación creada exitosamente en Prisma Magazine!', true);
          this.limpiarFormulario();
        },
        error: (err) => {
          console.error('-> Error al crear publicación:', err);
          this.mostrarAlerta(`Error: ${err.error || 'No se pudo guardar la publicación.'}`, false);
        }
      });
  }

  limpiarFormulario() {
    this.nuevoTitulo = '';
    this.nuevoTipo = 'NOTICIA';
    this.nuevaImagen = '';
    this.nuevoContenido = '';
  }

  mostrarAlerta(mensaje: string, exito: boolean) {
    this.alertaMensaje = mensaje;
    this.alertaEsExito = exito;
    this.alertaVisible = true;
    this.cdr.detectChanges();
  }

  cerrarAlerta() {
    this.alertaVisible = false;
    if (this.alertaEsExito) {
      this.cambiarVista('menu');
    }
    this.cdr.detectChanges();
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login-usuario']);
  }
}
