import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Inicio } from './inicio/inicio';
import { Navbar } from './navbar/navbar';
import { LoginUsuario } from './login-usuario/login-usuario';
import { CrearCuentaUsuario } from './crear-cuenta-usuario/crear-cuenta-usuario';
import { FormsModule } from '@angular/forms';
import { LoginAdministrador } from './login-administrador/login-administrador';
import { Editor } from './editor/editor';
import { Usuario } from './usuario/usuario';
import { Comentador } from './comentador/comentador';
import { Admin } from './admin/admin';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    App,
    Inicio,
    Navbar,
    LoginUsuario,
    CrearCuentaUsuario,
    LoginAdministrador,
    Editor,
    Usuario,
    Comentador,
    Admin,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [App],
})
export class AppModule {}
