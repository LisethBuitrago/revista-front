import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {EncriptadorService} from '../services/encriptador-service';
import {PublicacionService} from '../services/publicacion-service';
import {PublicacionModel} from '../models/publicacion.model';

@Component({
  selector: 'app-editor',
  standalone: false,
  templateUrl: './editor.html',
  styleUrls: ['./editor.css']
})
export class Editor implements OnInit {

  usuario = {nombre: 'Editor1', rol: 'Editor'};
  vistaActual: 'menu' | 'crear' | 'comentar_lista' | 'comentar_detalle' = 'menu';
  noticiaSeleccionada: any = null;

  img1 = "https://i.ytimg.com/vi/hlGbKDBzdw4/maxresdefault.jpg";
  img2 = "https://depor.com/resizer/v2/5UEDBTDAIVC67FUUJR474F7ITA.jpg?auth=3756e394f1de56526b8ab7abab8356273de8fc0e4bf7ed3ec12ec6677f8726f8&width=3000&height=3000&quality=75&smart=true";

  tarjetas: any[] = [];
  tarjetasFiltradas: any[] = [];

  public todoDesencriptado: boolean = false;

  private encriptadorService = inject(EncriptadorService);
  private publicacionService = inject(PublicacionService);

  constructor(private router: Router) {
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
          const esHoroscopo = item.tipo.toUpperCase() === 'HORÓSCOPO';

          const nuevaCard = {
            ...item,
            imagen: esHoroscopo ? this.img2 : this.img1
          };

          this.encriptadorService.encriptar(item.titulo).subscribe((res: any) => nuevaCard.titulo = res);
          this.encriptadorService.encriptar(item.contenido).subscribe((res: any) => nuevaCard.contenido = res);

          return nuevaCard;
        });

        this.tarjetasFiltradas = this.tarjetas;
        this.todoDesencriptado = false;
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
  }

  cerrarSesion() {
    this.router.navigate(['/login-usuario']);
  }

  cambiarVista(vista: 'menu' | 'crear' | 'comentar_lista' | 'comentar_detalle') {
    this.vistaActual = vista;
    if (vista === 'comentar_lista') {
      this.cargarPublicacionesDelSistema();
    }
  }

  abrirComentario(noticia: any): void {
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
        item => item.tipo.toUpperCase() === categoriaSeleccionada
      );
    }
  }
}
