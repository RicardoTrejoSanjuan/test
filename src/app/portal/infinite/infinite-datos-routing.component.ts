
// Importaciones generales
import { NgModule }      from '@angular/core';
import { RouterModule, Routes}   from '@angular/router';

import { AuthGuard} from '../../classGeneric/config';

// Component
import { InfiniteDatosComponent } from './infinite-datos.component';
import { InfiniteMovimientosComponent } from './infinite-movimientos.component';

const RoutesModule: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: InfiniteDatosComponent,
        canActivate: [AuthGuard],
      },
      { 
        path: 'infinite/movimientos',
        component: InfiniteMovimientosComponent,
        canActivate: [AuthGuard],
      },
    ]
  }
  /*{
    path: "infinite/datos",
    component: InfiniteDatosComponent, //Clase del comonente
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "infinite/movimientos",
    component: InfiniteMovimientosComponent,
    canActivate: [AuthGuard],
    pathMatch: "full"
  }*/
];


@NgModule({
  imports: [
    RouterModule.forChild(RoutesModule),
  ],
  exports: [
    RouterModule

  ]
})



export class InfiniteDatosRoutingModule { }