import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private readonly urlBase = 'http://localhost:8080/revista/usuarios';

  /**
   * Elimina un usuario de la base de datos a partir de su ID.
   */
  eliminar(id: number): Observable<string> {
    return this.http.delete(`${this.urlBase}/eliminar/${id}`, { responseType: 'text' });
  }

  /**
   * Consulta al servidor si un nombre de usuario se encuentra registrado.
   * Devuelve un valor booleano (true/false).
   */
  verificarNombre(username: string): Observable<boolean> {
    const params = new HttpParams().set('username', username);
    return this.http.get<boolean>(`${this.urlBase}/verificar-nombre`, { params });
  }

  /**
   * Devuelve la cantidad numérica total de cuentas creadas en el sistema.
   */
  contarTotal(): Observable<number> {
    return this.http.get<number>(`${this.urlBase}/contar`);
  }

  /**
   * Busca usuarios cuyo nombre coincida con el criterio enviado.
   */
  buscarPorNombre(nombre: string): Observable<any[]> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<any[]>(`${this.urlBase}/buscar/nombre`, { params });
  }

  /**
   * Filtra las cuentas registradas buscando por un correo electrónico exacto.
   */
  buscarPorCorreo(correo: string): Observable<any[]> {
    const params = new HttpParams().set('correo', correo);
    return this.http.get<any[]>(`${this.urlBase}/buscar/correo`, { params });
  }

  /**
   * Lista los usuarios que pertenezcan a un rol específico (ADMINISTRADOR, EDITOR, etc.).
   */
  buscarPorRol(rol: string): Observable<any[]> {
    const params = new HttpParams().set('rol', rol);
    return this.http.get<any[]>(`${this.urlBase}/buscar/rol`, { params });
  }
}
