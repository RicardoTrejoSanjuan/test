import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../classGeneric/config';
import { NgModule } from '@angular/core';

//Importacion de los componentes del modulo de reportes de mesa de control
import { MesaControlReportesAnalista } from './reportes-analista/reportes-analista.component';
import { MesaControlReportesEstados } from './reportes-estados/reportes-estados.component';
import { MesaControlReportesEmpresas } from './reportes-empresas/reportes-empresas.component';
import { Empresas } from './empresas/empresas.component';

const RUTAS: Routes = [
  {
    path: "mesa-control/reportes",
    canActivate: [AuthGuard],
    component: MesaControlReportesEmpresas,
    pathMatch: "full"
  },
  {
    path: "mesa-control/reportes/reportes-empresa",
    redirectTo: "mesa-control/reportes",
    pathMatch: "full"
  },
  {
    path: "mesa-control/reportes/reportes-estado",
    canActivate: [AuthGuard],
    component: MesaControlReportesEstados,
    pathMatch: "full"
  },
  {
    path: "mesa-control/reportes/reportes-analistas",
    canActivate: [AuthGuard],
    component: MesaControlReportesAnalista,
    pathMatch: "full"
  },
  {
    path: "mesa-control/reportes/empresa",
    canActivate: [AuthGuard],
    component: Empresas,
    pathMatch: "full"
  }
];

export const MESA_REPORTES = RouterModule.forRoot(RUTAS);
