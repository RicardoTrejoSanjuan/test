import { NgModule }      from '@angular/core';
import { RouterModule, Routes}   from '@angular/router';

import { AuthGuard} from '../../../classGeneric/config';

// Component
import { ConfiguracionPromocionesComponent } from './configuracionPromociones/configuracionPromociones.component';
import { AsignacionPromocionesComponent } from './asignacionPromociones/asignacionPromociones.component';
// import { InfiniteMovimientosComponent } from './infinite-movimientos.component';

const RoutesModule: Routes = [
  {
    path: "beneficios/configuracion",
    component: ConfiguracionPromocionesComponent, //Clase del comonente
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "beneficios/asignacion",
    component: AsignacionPromocionesComponent,
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

export class PromocionesRoutingModule { }