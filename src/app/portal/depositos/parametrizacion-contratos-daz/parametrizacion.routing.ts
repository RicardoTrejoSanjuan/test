import { AuthGuard } from '../../../classGeneric/config';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ParametrizacionComponent } from './parametrizacion.component';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';
import { CanalesComponent } from './canales/canales.component';
import { EmisorComponent } from './comisionemisor/comisionemisor.component';
import { ClienteComponent } from './comisioncliente/comisioncliente.component';
import { ReferenciaDepositos } from './referencia/referencia.component';
import { LayoutComponent } from './layout/layout.component';

const countryRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ParametrizacionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'parametrizacioncontratos',
        component: ParametrizacionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'liquidacion',
        component: LiquidacionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'canales',
        component: CanalesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'comisiones-emisor',
        component: EmisorComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'comisiones-cliente',
        component: ClienteComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'referencia',
        component: ReferenciaDepositos,
        canActivate: [AuthGuard],
      },
      {
        path: 'layout',
        component: LayoutComponent,
        canActivate: [AuthGuard],
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(countryRoutes)],
  exports: [RouterModule]
})
export class ParametrizacionRoutin { }



