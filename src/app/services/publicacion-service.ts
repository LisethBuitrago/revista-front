import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private http = inject(HttpClient);
  private readonly urlBase = 'http://localhost:8080/revista/publicaciones';

  /**
   * Envía los datos para crear una nueva publicación (NOTICIA u HOROSCOPO).
   */
  crear(publicacion: { titulo: string; contenido: string; tipo: string; editorId: number }): Observable<string> {
    return this.http.post(`${this.urlBase}/crear`, publicacion, { responseType: 'text' });
  }

  /**
   * Recupera el catálogo completo de publicaciones almacenadas en el sistema.
   */
  listarTodas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlBase}/listar`);
  }

  /**
   * Modifica el contenido, título o tipo de una publicación existente.
   */
  actualizar(id: number, publicacion: { titulo: string; contenido: string; tipo: string }): Observable<string> {
    return this.http.put(`${this.urlBase}/actualizar/${id}`, publicacion, { responseType: 'text' });
  }

  /**
   * Remueve una publicación del sistema mediante su ID numérico.
   */
  eliminar(id: number): Observable<string> {
    return this.http.delete(`${this.urlBase}/eliminar/${id}`, { responseType: 'text' });
  }

  /**
   * Filtra las publicaciones del sistema según su categoría (NOTICIA u HOROSCOPO).
   * Mapea con precisión el parámetro @RequestParam de Spring.
   */
  buscarPorTipo(tipo: string): Observable<any[]> {
    const params = new HttpParams().set('tipo', tipo);
    return this.http.get<any[]>(`${this.urlBase}/buscar/tipo`, { params });
  }

  /**
   * Busca publicaciones cuyos títulos contengan la palabra clave proporcionada.
   * Mapea con precisión el parámetro @RequestParam de Spring.
   */
  buscarPorTitulo(palabra: string): Observable<any[]> {
    const params = new HttpParams().set('palabra', palabra);
    return this.http.get<any[]>(`${this.urlBase}/buscar/titulo`, { params });
  }

  /**
   * Obtiene la lista de publicaciones desarrolladas por un redactor específico mediante su ID.
   * Mapea con precisión la variable de ruta @PathVariable de Spring.
   */
  buscarPorEditor(editorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlBase}/buscar/editor/${editorId}`);
  }
}
