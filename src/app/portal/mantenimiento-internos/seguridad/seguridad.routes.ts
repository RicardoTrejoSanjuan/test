// Importaciones generales
import { NgModule }      from '@angular/core';
import { RouterModule, Routes}   from '@angular/router';

import { AuthGuard} from '../../../classGeneric/config';

import { SeguridadIpsComponent } from './seguridad.component';


const RoutesModule: Routes = [
  {
    path: "mantenimientos-internos/seguridad",
    component: SeguridadIpsComponent, //Clase del comonente
    canActivate: [AuthGuard],
    pathMatch: "full"
  }
];


@NgModule({
imports: [
  RouterModule.forChild(RoutesModule)
],
exports: [
  RouterModule
]
})



export class SeguridadIpsRouting { }