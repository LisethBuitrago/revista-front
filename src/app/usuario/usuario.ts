import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PublicacionService } from '../services/publicacion-service';
import { PublicacionModel } from '../models/publicacion.model';

@Component({
  selector: 'app-usuario',
  standalone: false,
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class Usuario implements OnInit {

  private router = inject(Router);
  private publicacionService = inject(PublicacionService);

  usuario = {
    nombre: 'Usuario',
    rol: 'USUARIO'
  };

  img1 = "https://i.ytimg.com/vi/hlGbKDBzdw4/maxresdefault.jpg";
  img2 = "https://depor.com/resizer/v2/5UEDBTDAIVC67FUUJR474F7ITA.jpg?auth=3756e394f1de56526b8ab7abab8356273de8fc0e4bf7ed3ec12ec6677f8726f8&width=3000&height=3000&quality=75&smart=true";

  tarjetas: any[] = [];
  tarjetasFiltradas: any[] = [];

  modalVisible = false;
  publicacionSeleccionada: any = null;

  ngOnInit(): void {
    const nombreGuardado = localStorage.getItem('nombre');
    const rolGuardado = localStorage.getItem('rol');

    this.usuario.nombre = nombreGuardado || 'Lector Anónimo';
    this.usuario.rol = rolGuardado || 'USUARIO';

    this.cargarPublicaciones();
  }

  cargarPublicaciones(): void {
    this.publicacionService.listarTodas().subscribe({
      next: (datos: PublicacionModel[]) => {
        this.tarjetas = datos.map(item => ({
          ...item,
          imagen: item.tipo.toUpperCase() === 'HOROSCOPO' ? this.img2 : this.img1
        }));
        this.tarjetasFiltradas = [...this.tarjetas];
      },
      error: (err) => console.error('Error al cargar publicaciones:', err)
    });
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
  }

  abrirPublicacion(item: any) {
    this.publicacionSeleccionada = item;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.publicacionSeleccionada = null;
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login-usuario']);
  }
}
