import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {
  img1 = "https://i.ytimg.com/vi/hlGbKDBzdw4/maxresdefault.jpg";
  img2="https://depor.com/resizer/v2/5UEDBTDAIVC67FUUJR474F7ITA.jpg?auth=3756e394f1de56526b8ab7abab8356273de8fc0e4bf7ed3ec12ec6677f8726f8&width=3000&height=3000&quality=75&smart=true";

  tarjetas = [
    { titulo: 'Las estrellas dicen...', tipo: 'HORÓSCOPO', imagen: this.img1 },
    { titulo: 'Gran estreno en cines', tipo: 'NOTICIA', imagen: this.img1 },
    { titulo: 'Tu signo este mes', tipo: 'HORÓSCOPO', imagen: this.img2 },
    { titulo: 'Tecnología hoy', tipo: 'NOTICIA', imagen: this.img1 },
    { titulo: 'Moda de invierno', tipo: 'NOTICIA', imagen: this.img1 },
    { titulo: 'Predicciones semanales', tipo: 'HORÓSCOPO', imagen: this.img2 }
  ];
}
