// Importaciones generales
import { NgModule }      from '@angular/core';
import { RouterModule, Routes}   from '@angular/router';

import { AuthGuard} from '../../../../classGeneric/config';

import { GruposComponent } from './grupos.component';


const RoutesModule: Routes = [
  {
    path: "mantenimientos-internos/configuracion/grupos",
    component: GruposComponent, //Clase del componente
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



export class GruposRouting { }