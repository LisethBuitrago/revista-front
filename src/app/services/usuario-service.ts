import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
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

  listarTodos(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.urlBase}/listar`, { headers });
  }
  actualizar(id: number, usuario: any): Observable<string> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log("2. EN EL SERVICIO (usuario-service.ts):");
    console.log("URL de destino:", `${this.urlBase}/actualizar/${id}`);
    console.log("JSON plano que se enviará al backend:", JSON.stringify(usuario));

    return this.http.put(`${this.urlBase}/actualizar/${id}`, usuario, { headers, responseType: 'text' });
  }

  crear(usuario: any): Observable<string> {
    const token = localStorage.getItem('token');
    const params = new HttpParams()
      .set('nombre', usuario.nombre)
      .set('correo', usuario.correo)
      .set('contrasenia', usuario.contrasenia)
      .set('rol', usuario.rol);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.urlBase}/crear`, usuario, { headers, params, responseType: 'text' });
  }
}
