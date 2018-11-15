// Importaciones generales
import { NgModule }      from '@angular/core';
import { RouterModule, Routes}   from '@angular/router';

import { AuthGuard} from '../../../../classGeneric/config';


// import { MantenimientoInstitucionesBusqueda } from './alta-servicio-daz/busqueda/busqueda.component';
import { NegocioComponent } from './negocios.component';

const RoutesModule: Routes = [
  {
    path: "depositos-referenciado/parametrizacioncontratos/negocios",
    component: NegocioComponent,
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

export class NegociosRoutin { }
