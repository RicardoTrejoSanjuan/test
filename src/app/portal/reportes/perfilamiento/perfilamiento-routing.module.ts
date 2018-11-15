import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../classGeneric/config';

import { ReportesPerfilamiento } from './grafica-perfilamiento/grafica-perfilamiento.component';

const RoutesModule: Routes = [
  {
    path: "reportes/perfilamiento",
    component: ReportesPerfilamiento,
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

export class PerfilamientoRoutingModule { }
