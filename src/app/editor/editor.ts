import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { PublicacionService } from '../services/publicacion-service';
import { finalize } from 'rxjs';

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
export class Editor implements OnInit {


  private router = inject(Router);
  private publicacionService = inject(PublicacionService);
  private cdr = inject(ChangeDetectorRef);

  // 1. Objeto usuario dinámico mapeado con el localStorage
  usuario = {
    id: 0,
    nombre: '',
    rol: ''
  };

  // 2. Variables vinculadas netamente a los [(ngModel)] de tu formulario de creación en el HTML
  nuevoTitulo = '';
  nuevoTipo = 'NOTICIA'; // Valor inicial por defecto del <select>
  nuevaImagen = '';
  nuevoContenido = '';
  cargando = false;

  // 3. Variables de control para las alertas modales del HTML (*ngIf="alertaVisible")
  alertaVisible = false;
  alertaMensaje = '';
  alertaEsExito = false;

  // 4. Control de navegación interna (*ngIf="vistaActual === '...'")
  vistaActual: 'menu' | 'crear' | 'comentar_lista' | 'comentar_detalle' = 'menu';

  // 5. Gestión de comentarios y datos de prueba estructurados para tus tarjetas
  noticiaSeleccionada: Tarjeta | null = null;
  tarjetas: Tarjeta[] = [
    { titulo: 'Las estrellas dicen...', tipo: 'HORÓSCOPO', imagen: 'https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/F403/production/_109476426_jheison3.png.webp' },
    { titulo: 'Gran estreno en cines', tipo: 'NOTICIA', imagen: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/UXETGRWJY5BS3MXAJLUPW2YBOQ.jpg' }
  ];
  tarjetasFiltradas: Tarjeta[] = [...this.tarjetas];

  ngOnInit(): void {
    // Recuperamos netamente los datos que guardamos en el login
    const idGuardado = localStorage.getItem('idUsuario');
    const nombreGuardado = localStorage.getItem('nombre');
    const rolGuardado = localStorage.getItem('rol');

    this.usuario.id = idGuardado ? parseInt(idGuardado, 10) : 0;
    this.usuario.nombre = nombreGuardado || 'Editor Anónimo';
    this.usuario.rol = rolGuardado || 'EDITOR';
  }

  // Cambiar entre las vistas del panel principal
  cambiarVista(vista: 'menu' | 'crear' | 'comentar_lista' | 'comentar_detalle') {
    this.vistaActual = vista;
    if (vista === 'comentar_lista') {
      this.tarjetasFiltradas = [...this.tarjetas]; // Reinicia los filtros al listar
    }
    this.cdr.detectChanges();
  }

  // Abre la noticia seleccionada para comentar en la vista de detalle
  abrirComentario(noticia: Tarjeta): void {
    this.noticiaSeleccionada = noticia;
    this.cambiarVista('comentar_detalle');
  }

  // Filtra las publicaciones basándose en el <select> de categorías del HTML
  filtrarPorCategoria(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const categoria = selectElement.value;

    if (categoria === 'TODAS') {
      this.tarjetasFiltradas = [...this.tarjetas];
    } else {
      this.tarjetasFiltradas = this.tarjetas.filter(t => t.tipo === categoria);
    }
    this.cdr.detectChanges();
  }

  // Método conectado al (ngSubmit)="crearPublicacion()" de tu formulario HTML
  crearPublicacion() {
    // 1. Validamos solo título y contenido (ya no exigimos que el usuario suba imagen)
    if (!this.nuevoTitulo || !this.nuevoContenido) {
      this.mostrarAlerta('¡Por favor llena todos los campos obligatorios (Título y Contenido)!', false);
      return;
    }

    this.cargando = true;

    // 2. Definimos las imágenes fijas para cada tipo
    const img1 = "https://i.ytimg.com/vi/hlGbKDBzdw4/maxresdefault.jpg"; // Para NOTICIA
    const img2 = "https://depor.com/resizer/v2/5UEDBTDAIVC67FUUJR474F7ITA.jpg?auth=3756e394f1de56526b8ab7abab8356273de8fc0e4bf7ed3ec12ec6677f8726f8&width=3000&height=3000&quality=75&smart=true"; // Para HORÓSCOPO

    // 3. Asignamos de forma automática la URL basándonos en la selección del <select>
    const imagenAutomatica = this.nuevoTipo === 'HORÓSCOPO' ? img2 : img1;

    // 4. Armamos el objeto con la propiedad 'imagen' calculada automáticamente para cumplir con el backend
    const nuevaPublicacion = {
      titulo: this.nuevoTitulo,
      tipo: this.nuevoTipo,
      imagen: imagenAutomatica, // 🌟 Se envía automáticamente
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
  // Resetea el formulario tras un registro exitoso
  limpiarFormulario() {
    this.nuevoTitulo = '';
    this.nuevoTipo = 'NOTICIA';
    this.nuevaImagen = '';
    this.nuevoContenido = '';
  }

  // Controladores visuales de alertas para las ventanas modales del HTML
  mostrarAlerta(mensaje: string, exito: boolean) {
    this.alertaMensaje = mensaje;
    this.alertaEsExito = exito;
    this.alertaVisible = true;
    this.cdr.detectChanges();
  }

  cerrarAlerta() {
    this.alertaVisible = false;
    if (this.alertaEsExito) {
      this.cambiarVista('menu'); // Si fue exitoso, regresa al menú de inicio
    }
    this.cdr.detectChanges();
  }

  // Cierra la sesión limpiando el ecosistema del localStorage
  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login-usuario']);
  }
}
