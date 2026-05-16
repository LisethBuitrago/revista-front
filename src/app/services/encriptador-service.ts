import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncriptadorService {
  private http = inject(HttpClient);

  private readonly urlBase = 'http://localhost:8080/revista/publicaciones';

  cambiarCifrado$ = new Subject<void>();

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  encriptar(texto: string): Observable<string> {
    return this.http.post(`${this.urlBase}/encriptar-texto`, texto, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  desencriptar(textoCifrado: string): Observable<string> {
    return this.http.post(`${this.urlBase}/desencriptar-texto`, textoCifrado, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }
}
