import { NgModule }      from '@angular/core';
import { RouterModule, Routes}   from '@angular/router';

import { AuthGuard} from '../../../classGeneric/config';

// Component
import { EmpleadoComponent } from './empleados.component';
// import { InfiniteMovimientosComponent } from './infinite-movimientos.component';

const RoutesModule: Routes = [
  {
    path: "mantenimientos/empleados",
    component: EmpleadoComponent, //Clase del comonente
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

export class EmpleadosRoutingModuule { }