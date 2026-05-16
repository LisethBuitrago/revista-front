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

  /**
   * Valida credenciales contra el Backend.
   * Guarda el Token JWT y el Rol en el ecosistema del navegador.
   */
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

  /**
   * Valida credenciales contra el Backend usando el Correo.
   * 🌟 CORRECCIÓN: La firma del Observable ahora incluye id y nombre
   * @param correo - Correo electrónico del usuario
   * @param contrasenia - Contraseña del usuario
   */
  loginConCorreo(correo: string, contrasenia: string): Observable<{ token: string; role: string; id: number; nombre: string }> {
    // El backend espera "nombre" en el JSON, pero nosotros enviamos el correo.
    // ¡Esto está perfecto si aplicaste el cambio en el AuthController.java!
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

  /**
   * Registra un nuevo usuario omitiendo campos opcionales o autogenerados.
   * Espera texto plano desde el controlador.
   */
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
