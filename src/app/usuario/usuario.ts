import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-usuario',
  standalone: false,
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class Usuario implements OnInit {

  usuario = {
    nombre: 'Usuario1',
    rol: 'Usuario'
  };

  img1 = "https://i.ytimg.com/vi/hlGbKDBzdw4/maxresdefault.jpg";
  img2="https://depor.com/resizer/v2/5UEDBTDAIVC67FUUJR474F7ITA.jpg?auth=3756e394f1de56526b8ab7abab8356273de8fc0e4bf7ed3ec12ec6677f8726f8&width=3000&height=3000&quality=75&smart=true";


  tarjetas = [
    { titulo: 'Lanzamiento oficial de Pokedes', tipo: 'NOTICIA', imagen: this.img1 },
    { titulo: 'Gran estreno en cines', tipo: 'NOTICIA', imagen: this.img1 },
    { titulo: 'Tu signo este mes', tipo: 'HORÓSCOPO', imagen: this.img2 },
    { titulo: 'Tecnología hoy', tipo: 'NOTICIA', imagen: this.img1 },
    { titulo: 'Moda de invierno', tipo: 'NOTICIA', imagen: this.img2 },
    { titulo: 'Predicciones semanales', tipo: 'HORÓSCOPO', imagen: this.img2 }
  ];

  tarjetasFiltradas = [...this.tarjetas];
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.tarjetasFiltradas = this.tarjetas;
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

  cerrarSesion() {
    this.router.navigate(['/login-usuario']);
  }

}
