// Importaciones generales
import { NgModule }      from '@angular/core';
import { RouterModule, Routes}   from '@angular/router';

import { AuthGuard} from '../../../../classGeneric/config';

import { ParametrosComponent } from './parametros.component';


const RoutesModule: Routes = [
  {
    path: "mantenimientos-internos/configuracion/parametros",
    component: ParametrosComponent, //Clase del componente
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



export class ParametrosRouting { }