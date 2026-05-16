import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private http = inject(HttpClient);
  private readonly urlBase = 'http://localhost:8080/revista/comentarios';

  /**
   * Envía un comentario vinculándolo a una publicación y a un autor específico.
   */
  crear(comentario: { texto: string; publicacionId: number; editorId: number }): Observable<string> {
    return this.http.post(`${this.urlBase}/crear`, comentario, { responseType: 'text' });
  }

  /**
   * Recupera el listado global de todos los comentarios (Uso administrativo).
   */
  listarTodos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlBase}/listar`);
  }

  /**
   * Modifica el texto de un comentario previamente almacenado.
   */
  actualizar(id: number, comentario: { texto: string }): Observable<string> {
    return this.http.put(`${this.urlBase}/actualizar/${id}`, comentario, { responseType: 'text' });
  }

  /**
   * Borra permanentemente un comentario mediante su ID.
   */
  eliminar(id: number): Observable<string> {
    return this.http.delete(`${this.urlBase}/eliminar/${id}`, { responseType: 'text' });
  }

  /**
   * Obtiene exclusivamente los comentarios asociados a un artículo o noticia específica.
   */
  listarPorPublicacion(publicacionId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlBase}/buscar/publicacion/${publicacionId}`);
  }
}
