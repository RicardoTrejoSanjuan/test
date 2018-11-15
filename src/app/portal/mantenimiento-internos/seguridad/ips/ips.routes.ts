// Importaciones generales
import { NgModule }      from '@angular/core';
import { RouterModule, Routes}   from '@angular/router';

import { AuthGuard} from '../../../../classGeneric/config';

import { IpsComponent } from './ips.component';


const RoutesModule: Routes = [
  {
    path: "mantenimientos-internos/seguridad/ips",
    component: IpsComponent, //Clase del comonente
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



export class IpsRouting { }