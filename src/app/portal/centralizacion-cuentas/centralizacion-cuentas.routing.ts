// Importaciones generales
import { NgModule }      from '@angular/core';
import { RouterModule, Routes}   from '@angular/router';

import { AuthGuard} from '../../classGeneric/config';

// Component
import { CentralizacionCuentasComponent } from './centralizacion-cuentas.component';
import { AltaCuentasPerifericasComponent  } from './alta-cuentas-perifericas/alta-cuentas-perifericas.component';
import { AltaServicioComponent } from './alta-servicio/alta-servicio.component';
//import {ConsultaEstructuraComponent} from './consulta-estructura/consulta-estructura.component';
import {ParametrizacionCuentaPrincipalComponent} from './parametrizacion-cuenta-principal/parametrizacion-cuenta-principal.component';
// import { InfiniteMovimientosComponent } from './infinite-movimientos.component';

const RoutesModule: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CentralizacionCuentasComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'alta-servicio',
        component: AltaServicioComponent,//Clase del comonente
        canActivate: [AuthGuard]
      },
      
      {
        path: 'parametrizacion-cuenta-principal',
        component: ParametrizacionCuentaPrincipalComponent,//Clase del comonente
        canActivate: [AuthGuard],
      },
      {
        path: 'alta-cuentas-perifericas',
        component: AltaCuentasPerifericasComponent ,//Clase del comonente
        canActivate: [AuthGuard],
      },
      /*{
        path: 'consulta-estructura',
        component: ConsultaEstructuraComponent ,//Clase del comonente
        canActivate: [AuthGuard],
      }*/
    ]
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

export class CentralizacionCuentasRoutingModule { }
