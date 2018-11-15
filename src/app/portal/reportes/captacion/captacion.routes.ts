import { NgModule }      from '@angular/core';

import { AuthGuard} from '../../../classGeneric/config';

import { RouterModule, Routes } from '@angular/router';
import { ReportesCaptacion } from './captacion.component';
import { ReportesDispersiones } from './grafica-dispersiones/grafica-dispersiones.component';

const RUTAS_REPORTES_CAPTACION: Routes = [
  {
    path: "reportes/captacion",
    component: ReportesCaptacion,
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "reportes/captacion/estatus",
    redirectTo: "reportes/captacion",
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "reportes/captacion/dispersiones",
    component: ReportesDispersiones,
    canActivate: [AuthGuard],
    pathMatch: "full"
  }
];
export const REPORTES_CAPTACION_ROUTING = RouterModule.forRoot(RUTAS_REPORTES_CAPTACION);
