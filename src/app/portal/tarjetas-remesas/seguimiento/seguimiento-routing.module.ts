import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { AuthGuard  } from '../../../classGeneric/config';

import { SeguimientoRemesaComponent } from './seguimiento.component';

const routes: Routes = [
  {
    path: "tarjetas-remesa/seguimiento",
    component: SeguimientoRemesaComponent,
    canActivate: [AuthGuard],
    pathMatch: "full"
  }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class SeguimientoRemesaRoutingModule {}