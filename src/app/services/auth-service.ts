import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly urlBase = 'http://localhost:8080/revista/auth';

  /**
   * Envía las credenciales al servidor para iniciar sesión.
   * Guarda el token y el rol en el LocalStorage si la operación es exitosa.
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
   * Registra un nuevo usuario en la plataforma.
   * Recibe un texto plano como confirmación desde el backend.
   */
  registrar(usuario: { nombre: string; correo: string; contrasenia: string; rol?: string }): Observable<string> {
    return this.http.post(`${this.urlBase}/register`, usuario, { responseType: 'text' });
  }

  /**
   * Limpia las credenciales almacenadas en el navegador, cerrando la sesión de forma segura.
   */
  logout(): void {
    localStorage.clear();
  }

  /**
   * Recupera el token JWT vigente guardado en el navegador.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Recupera el rol del usuario autenticado (ADMINISTRADOR, EDITOR, COMENTADOR, USUARIO).
   */
  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  /**
   * Comprueba si existe una sesión activa actualmente.
   */
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
