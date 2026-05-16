import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UsuarioModel} from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private readonly urlBase = 'http://localhost:8080/revista/usuarios';

  eliminar(id: number): Observable<string> {
    return this.http.delete(`${this.urlBase}/eliminar/${id}`, {responseType: 'text'});
  }

  verificarNombre(username: string): Observable<boolean> {
    const params = new HttpParams().set('username', username);
    return this.http.get<boolean>(`${this.urlBase}/verificar-nombre`, {params});
  }

  contarTotal(): Observable<number> {
    return this.http.get<number>(`${this.urlBase}/contar`);
  }

  buscarPorNombre(nombre: string): Observable<UsuarioModel[]> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<UsuarioModel[]>(`${this.urlBase}/buscar/nombre`, {params});
  }

  buscarPorCorreo(correo: string): Observable<UsuarioModel[]> {
    const params = new HttpParams().set('correo', correo);
    return this.http.get<UsuarioModel[]>(`${this.urlBase}/buscar/correo`, {params});
  }

  buscarPorRol(rol: string): Observable<UsuarioModel[]> {
    const params = new HttpParams().set('rol', rol);
    return this.http.get<UsuarioModel[]>(`${this.urlBase}/buscar/rol`, {params});
  }
}
