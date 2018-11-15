import {NgModule} from '@angular/core';

import {Routes,RouterModule} from '@angular/router';

import {AuthGuard} from '../../../classGeneric/config';

import {ReporteColocacionGeneral} from './grafica-colocacion-general/grafica-colocacion.component';

const routes: Routes = [
  {
    path: "reportes/colocacion",
    component: ReporteColocacionGeneral,
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "reportes/colocacion/general",
    redirectTo: "reportes/colocacion",
    canActivate: [AuthGuard],
    pathMatch: "full"
  }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class ColocacionRoutingModule { }