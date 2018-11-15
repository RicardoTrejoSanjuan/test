// Importaciones generales
import { NgModule }      from '@angular/core';
import { RouterModule, Routes}   from '@angular/router';

import { AuthGuard} from '../../../../classGeneric/config';


// import { MantenimientoInstitucionesBusqueda } from './alta-servicio-daz/busqueda/busqueda.component';
import { ReferenciaSPEI } from './referencia-spei.component';

const RoutesModule: Routes = [
  {
    path: "depositos-referenciado/parametrizacioncontratos/spei-referencia",
    component: ReferenciaSPEI,
    canActivate: [AuthGuard],
    pathMatch: "full"
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(RoutesModule),
  ],
  exports: [
    RouterModule
  ]
})

export class ReferenciaSPEIRoutin { }
