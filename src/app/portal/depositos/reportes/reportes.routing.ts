import { AuthGuard } from '../../../classGeneric/config';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BusquedaComponent } from './reportes.component';
import { TransaccionalidadComponent } from './transaccionalidad/transaccionalidad.component';
import { ComisionesComponent } from './comisiones/comisiones.component';


const countryRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TransaccionalidadComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'transaccionalidad',
        component: TransaccionalidadComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'comisionesventanilla',
        component: ComisionesComponent,
        canActivate: [AuthGuard],
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(countryRoutes)],
  exports: [RouterModule]
})
export class routes { }


