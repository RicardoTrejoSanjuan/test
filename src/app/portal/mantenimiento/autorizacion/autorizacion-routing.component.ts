
import { NgModule }      from '@angular/core';
import { RouterModule, Routes}   from '@angular/router';

import { AuthGuard} from '../../../classGeneric/config';

// Component
import { AutorizacionComponent } from './autorizacion.component';
// import { InfiniteMovimientosComponent } from './infinite-movimientos.component';

const RoutesModule: Routes = [
      {
        path: 'mantenimientos/autorizacion',
        component: AutorizacionComponent,//Clase del comonente
        canActivate: [AuthGuard]
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

export class AutorizacionRoutingModule { }