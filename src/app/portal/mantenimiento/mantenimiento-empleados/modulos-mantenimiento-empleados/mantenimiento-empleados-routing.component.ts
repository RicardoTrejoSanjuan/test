import { NgModule }      from '@angular/core';
import { RouterModule, Routes}   from '@angular/router';

import { AuthGuard} from '../../../../classGeneric/config';

// Component
import { DatosEmpleoComponent } from './datos-empleo/datos-empleo.component';
import { DatosHogarComponent } from './datos-hogar/datos-hogar.component';
import { DispersionesComponent  } from './dispersiones/dispersiones.component';
import { DatosBasicosComponent } from './datos-basicos/datos-basicos.component';
// import { InfiniteMovimientosComponent } from './infinite-movimientos.component';

const RoutesModule: Routes = [
  {
    path: "mantenimientos/empleados/datos-empleo",
    component: DatosEmpleoComponent, //Clase del comonente
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "mantenimientos/empleados/datos-hogar",
    component: DatosHogarComponent, //Clase del comonente
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "mantenimientos/empleados/dipersiones",
    component: DispersionesComponent, //Clase del comonente
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "mantenimientos/empleados/datos-basicos",
    component: DatosBasicosComponent,
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

export class MantenimientoEmpleadosRoutingModule { }