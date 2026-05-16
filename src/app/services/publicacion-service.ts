import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PublicacionModel} from '../models/publicacion.model';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private http = inject(HttpClient);
  private readonly urlBase = 'http://localhost:8080/revista/publicaciones';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('Token recuperado del navegador:', token);
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  crear(publicacion: Omit<PublicacionModel, 'id' | 'fechaCreacion'>): Observable<string> {
    return this.http.post(`${this.urlBase}/crear`, publicacion, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  listarTodas(): Observable<PublicacionModel[]> {
    return this.http.get<PublicacionModel[]>(`${this.urlBase}/listar`, {
      headers: this.getHeaders()
    });
  }

  actualizar(id: number, publicacion: Partial<PublicacionModel>): Observable<string> {
    return this.http.put(`${this.urlBase}/actualizar/${id}`, publicacion, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  eliminar(id: number): Observable<string> {
    return this.http.delete(`${this.urlBase}/eliminar/${id}`, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  buscarPorTipo(tipo: string): Observable<PublicacionModel[]> {
    const params = new HttpParams().set('tipo', tipo);
    return this.http.get<PublicacionModel[]>(`${this.urlBase}/buscar/tipo`, {
      headers: this.getHeaders(),
      params
    });
  }

  buscarPorTitulo(palabra: string): Observable<PublicacionModel[]> {
    const params = new HttpParams().set('palabra', palabra);
    return this.http.get<PublicacionModel[]>(`${this.urlBase}/buscar/titulo`, {
      headers: this.getHeaders(),
      params
    });
  }

  buscarPorEditor(editorId: number): Observable<PublicacionModel[]> {
    return this.http.get<PublicacionModel[]>(`${this.urlBase}/buscar/editor/${editorId}`, {
      headers: this.getHeaders()
    });
  }
}
