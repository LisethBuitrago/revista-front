import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PublicacionModel} from '../models/publicacion.model';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private http = inject(HttpClient);
  private readonly urlBase = 'http://localhost:8080/revista/publicaciones';

  /**
   * Crea una publicación (Omitimos el ID y la fecha ya que se generan en el Backend).
   */
  crear(publicacion: Omit<PublicacionModel, 'id' | 'fechaCreacion'>): Observable<string> {
    return this.http.post(`${this.urlBase}/crear`, publicacion, {responseType: 'text'});
  }

  listarTodas(): Observable<PublicacionModel[]> {
    return this.http.get<PublicacionModel[]>(`${this.urlBase}/listar`);
  }

  actualizar(id: number, publicacion: Partial<PublicacionModel>): Observable<string> {
    return this.http.put(`${this.urlBase}/actualizar/${id}`, publicacion, {responseType: 'text'});
  }

  eliminar(id: number): Observable<string> {
    return this.http.delete(`${this.urlBase}/eliminar/${id}`, {responseType: 'text'});
  }

  buscarPorTipo(tipo: string): Observable<PublicacionModel[]> {
    const params = new HttpParams().set('tipo', tipo);
    return this.http.get<PublicacionModel[]>(`${this.urlBase}/buscar/tipo`, {params});
  }

  buscarPorTitulo(palabra: string): Observable<PublicacionModel[]> {
    const params = new HttpParams().set('palabra', palabra);
    return this.http.get<PublicacionModel[]>(`${this.urlBase}/buscar/titulo`, {params});
  }

  buscarPorEditor(editorId: number): Observable<PublicacionModel[]> {
    return this.http.get<PublicacionModel[]>(`${this.urlBase}/buscar/editor/${editorId}`);
  }
}
