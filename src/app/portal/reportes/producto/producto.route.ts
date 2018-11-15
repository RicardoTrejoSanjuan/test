import { NgModule }      from '@angular/core';

import { AuthGuard} from '../../../classGeneric/config';

import { RouterModule, Routes } from '@angular/router';
import { ReportesProducto } from './producto.component';

const RUTAS_REPORTES_PRODUCTO: Routes = [
  {
    path: "reportes/captacion/producto",
    component: ReportesProducto,
    canActivate: [AuthGuard],
    pathMatch: "full"
  }
];
export const REPORTES_PRODUCTO_ROUTING = RouterModule.forRoot(RUTAS_REPORTES_PRODUCTO);
