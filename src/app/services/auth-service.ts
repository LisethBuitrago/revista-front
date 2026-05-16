import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {UsuarioModel} from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly urlBase = 'http://localhost:8080/revista/auth';

  login(credenciales: { nombre: string; contrasenia: string }): Observable<{ token: string; role: string }> {
    return this.http.post<{ token: string; role: string }>(`${this.urlBase}/login`, credenciales).pipe(
      tap(res => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('rol', res.role);
        }
      })
    );
  }

  loginConCorreo(correo: string, contrasenia: string): Observable<{ token: string; role: string; id: number; nombre: string }> {

    const credenciales = {
      nombre: correo,
      contrasenia: contrasenia
    };

    return this.http.post<{ token: string; role: string; id: number; nombre: string }>(`${this.urlBase}/login`, credenciales).pipe(
      tap(res => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('rol', res.role);
          localStorage.setItem('idUsuario', res.id.toString());
          localStorage.setItem('nombre', res.nombre);
        }
      })
    );
  }

  registrar(usuario: Omit<UsuarioModel, 'id'>): Observable<string> {
    return this.http.post(`${this.urlBase}/register`, usuario, {responseType: 'text'});
  }

  logout(): void {
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
