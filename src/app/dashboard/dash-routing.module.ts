// Importaciones generales
import { NgModule }      from '@angular/core';
import { RouterModule, Routes}   from '@angular/router';

import { AuthGuard} from '../classGeneric/config';

// Component
import { DashboardComponent } from './dash.component';


const DashRoutes: Routes = [
      {
        path: 'dashboard',
        component: DashboardComponent,//Clase del comonente
        canActivate: [AuthGuard]
      }
];


@NgModule({
  imports: [
    RouterModule.forChild(DashRoutes)
  ],
  exports: [
    RouterModule
  ]
})



export class DashRoutingModule { }