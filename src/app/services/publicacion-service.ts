import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; // 馃毄 Importado HttpHeaders
import { Observable } from 'rxjs';
import { PublicacionModel } from '../models/publicacion.model';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private http = inject(HttpClient);
  private readonly urlBase = 'http://localhost:8080/revista/publicaciones';

  /**
   * 馃攽 M脡TODO AUXILIAR PRIVADO
   * Recupera el Token que se gener贸 al iniciar sesi贸n y arma la cabecera 'Authorization'
   * para que Spring Security valide los permisos de cada acci贸n.
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Crea una publicaci贸n (Omitimos el ID y la fecha ya que se generan en el Backend).
   */
  crear(publicacion: Omit<PublicacionModel, 'id' | 'fechaCreacion'>): Observable<string> {
    return this.http.post(`${this.urlBase}/crear`, publicacion, {
      headers: this.getHeaders(), // 馃毄 Inyectamos cabeceras de seguridad
      responseType: 'text'
    });
  }

  listarTodas(): Observable<PublicacionModel[]> {
    return this.http.get<PublicacionModel[]>(`${this.urlBase}/listar`, {
      headers: this.getHeaders() // 馃毄 Inyectamos cabeceras de seguridad
    });
  }

  actualizar(id: number, publicacion: Partial<PublicacionModel>): Observable<string> {
    return this.http.put(`${this.urlBase}/actualizar/${id}`, publicacion, {
      headers: this.getHeaders(), // 馃毄 Inyectamos cabeceras de seguridad
      responseType: 'text'
    });
  }

  eliminar(id: number): Observable<string> {
    return this.http.delete(`${this.urlBase}/eliminar/${id}`, {
      headers: this.getHeaders(), // 馃毄 Inyectamos cabeceras de seguridad
      responseType: 'text'
    });
  }

  buscarPorTipo(tipo: string): Observable<PublicacionModel[]> {
    const params = new HttpParams().set('tipo', tipo);
    return this.http.get<PublicacionModel[]>(`${this.urlBase}/buscar/tipo`, {
      headers: this.getHeaders(), // 馃毄 Inyectamos cabeceras de seguridad
      params
    });
  }

  buscarPorTitulo(palabra: string): Observable<PublicacionModel[]> {
    const params = new HttpParams().set('palabra', palabra);
    return this.http.get<PublicacionModel[]>(`${this.urlBase}/buscar/titulo`, {
      headers: this.getHeaders(), // 馃毄 Inyectamos cabeceras de seguridad
      params
    });
  }

  buscarPorEditor(editorId: number): Observable<PublicacionModel[]> {
    return this.http.get<PublicacionModel[]>(`${this.urlBase}/buscar/editor/${editorId}`, {
      headers: this.getHeaders() // 馃毄 Inyectamos cabeceras de seguridad
    });
  }
}
