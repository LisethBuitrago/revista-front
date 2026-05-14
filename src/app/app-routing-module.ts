import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Inicio} from './inicio/inicio';
import {LoginUsuario} from './login-usuario/login-usuario';
import {CrearCuentaUsuario} from './crear-cuenta-usuario/crear-cuenta-usuario';
import {LoginAdministrador} from './login-administrador/login-administrador';
import {Editor} from './editor/editor';
import {Usuario} from './usuario/usuario';

const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'login-usuario', component: LoginUsuario },
  {path: 'crear-cuenta-usuario', component: CrearCuentaUsuario },
  {path: 'login-administrador', component: LoginAdministrador },
  {path:'editor', component: Editor },
  {path:'usuario', component: Usuario },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
