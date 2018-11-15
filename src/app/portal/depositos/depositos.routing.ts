import { AuthGuard } from '../../classGeneric/config';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DepositoMenuComponent } from './depositos.component';
import { BusquedaComponent } from './alta-servicio-daz/alta.component';
import { AutorizacionComponent } from './autorizacion/autorizacion.component';


const countryRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DepositoMenuComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'altadeserviciodaz',
        component: BusquedaComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'autorizacion',
        component: AutorizacionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'reportes',
        loadChildren: 'src/app/portal/depositos/reportes/reportes.module#ReportesModule',
      }, 
      {
        path: 'parametrizacioncontratos',
        loadChildren: 'src/app/portal/depositos/parametrizacion-contratos-daz/parametrizacion.module#ParametrizacionModule',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(countryRoutes)],
  exports: [RouterModule]
})
export class routes { }
