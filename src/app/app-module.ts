import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
