// Importaciones generales
import { NgModule }      from '@angular/core';
import { RouterModule, Routes}   from '@angular/router';

import { AuthGuard} from '../../classGeneric/config';

// Component
import { MantenimientoComponent } from './mantenimiento.component';
// import { InfiniteMovimientosComponent } from './infinite-movimientos.component';

const RoutesModule: Routes = [
      {
        path: 'mantenimientos',
        component: MantenimientoComponent,//Clase del comonente
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

export class MantenimientoRoutingModule { }
