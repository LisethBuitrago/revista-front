import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComentarioModel } from '../models/comentario.model';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private http = inject(HttpClient);
  private readonly urlBase = 'http://localhost:8080/revista/comentarios';


  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  crear(comentario: Omit<ComentarioModel, 'id' | 'fechaComentario'>): Observable<string> {
    return this.http.post(`${this.urlBase}/crear`, comentario, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  listarTodos(): Observable<ComentarioModel[]> {
    return this.http.get<ComentarioModel[]>(`${this.urlBase}/listar`, {
      headers: this.getHeaders()
    });
  }

  actualizar(id: number, comentario: Partial<ComentarioModel>): Observable<string> {
    return this.http.put(`${this.urlBase}/actualizar/${id}`, comentario, {
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

  listarPorPublicacion(publicacionId: number): Observable<ComentarioModel[]> {
    return this.http.get<ComentarioModel[]>(`${this.urlBase}/buscar/publicacion/${publicacionId}`, {
      headers: this.getHeaders()
    });
  }
}
