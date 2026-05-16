import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ComentarioModel} from '../models/comentario.model';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private http = inject(HttpClient);
  private readonly urlBase = 'http://localhost:8080/revista/comentarios';

  crear(comentario: Omit<ComentarioModel, 'id' | 'fechaComentario'>): Observable<string> {
    return this.http.post(`${this.urlBase}/crear`, comentario, {responseType: 'text'});
  }

  listarTodos(): Observable<ComentarioModel[]> {
    return this.http.get<ComentarioModel[]>(`${this.urlBase}/listar`);
  }

  actualizar(id: number, comentario: Partial<ComentarioModel>): Observable<string> {
    return this.http.put(`${this.urlBase}/actualizar/${id}`, comentario, {responseType: 'text'});
  }

  eliminar(id: number): Observable<string> {
    return this.http.delete(`${this.urlBase}/eliminar/${id}`, {responseType: 'text'});
  }

  listarPorPublicacion(publicacionId: number): Observable<ComentarioModel[]> {
    return this.http.get<ComentarioModel[]>(`${this.urlBase}/buscar/publicacion/${publicacionId}`);
  }
}
