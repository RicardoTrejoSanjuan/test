import { NgModule }      from '@angular/core';
import { RouterModule, Routes}   from '@angular/router';

import { AuthGuard} from '../../classGeneric/config';
import { BeneficiosComponent } from './beneficios.component';

const RoutesModule: Routes = [
  {
    path: "beneficios",
    component: BeneficiosComponent, //Clase del comonente
    canActivate: [AuthGuard],
    pathMatch: "full"
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(RoutesModule)
  ],
  exports: [
    RouterModule
  ]
})



export class BeneficiosRoutingModule { }