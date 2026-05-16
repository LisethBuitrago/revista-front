import {Component, inject} from '@angular/core';
import {EncriptadorService} from '../services/encriptador-service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  logo = "https://res.cloudinary.com/dqmacbgi6/image/upload/f_auto,q_auto/Gemini_Generated_Image_1516in1516in1516-removebg-preview_lgypxt";

  private encriptadorService = inject(EncriptadorService);

  onDesencriptar(event: Event): void {
    event.preventDefault();
    this.encriptadorService.cambiarCifrado$.next();
  }
}
