// Importaciones generales
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../classGeneric/config';

/* Importacion de componentes*/
import { ReportesCreditoInstituciones } from './grafica-instituciones/grafica-instituciones.component';
import { ReportesCreditoAsesor } from './grafica-asesor/grafica-asesor.component';
import { ReportesEmpleados } from './grafica-empleados/empleados.component';

import { ReportesCreditoGeneral } from './grafica-credito-general/grafica-credito-general.component';
import { ReportesBalance } from './grafica-balance/balance.component';
import { ReportesDetalleCredito } from './grafica-detalle-credito/detalle-credito.component';
import { ReporteEmbudoSolicitudes } from './grafica-embudo-solicitudes/grafica-embudo-solicitudes.component';
import { ReporteColocacionCreditos } from './grafica-colocacion-creditos/grafica-colocacion-creditos.component';
import { MonitoreoCreditoComponent } from './monitoreo-credito/monitoreo-credito.component';
import { ReporteColocacionGeneral } from './grafica-colocacion/grafica-colocacion.component'; 



//Declaracion de la rutas
const RoutesModule: Routes = [
  {
    path: "reportes/creditos",
    component: ReportesCreditoGeneral,
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "reportes/creditos/credito-general",
    redirectTo: "reportes/creditos",
    pathMatch: "full"
  },
  {
    path: "reportes/creditos/credito-general",
    component: ReportesCreditoGeneral,
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "reportes/creditos/instituciones-credito-general",
    component: ReportesCreditoInstituciones,
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "reportes/creditos/empleados-creditos-general",
    component: ReportesEmpleados,
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "reportes/creditos/asesor-credito-general",
    component: ReportesCreditoAsesor,
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "reportes/creditos/balance-credito-general",
    component: ReportesBalance,
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "reportes/creditos/detalle-credito-general",
    component: ReportesDetalleCredito,
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "reportes/creditos/embudo-solicitudes",
    component: ReporteEmbudoSolicitudes,
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "reportes/creditos/colocacion-creditos",
    component: ReporteColocacionCreditos,
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "reportes/creditos/perfilamiento",
    component: MonitoreoCreditoComponent,
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "reportes/creditos/colocacion-general",
    component: ReporteColocacionGeneral,
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



export class CreditoRoutingModule { }
