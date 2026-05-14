import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Inicio} from './inicio/inicio';

const routes: Routes = [
  { path: '', component: Inicio },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
