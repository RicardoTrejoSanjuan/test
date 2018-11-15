import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { AuthGuard  } from '../../../classGeneric/config';

import { RemesasComponent } from './remesas.component';
import { RemesasDetalleComponent } from './remesas-detalle/remesas-detalle.component';

const routes: Routes = [
  {
    path: "tarjetas-remesa/remesas",
    component: RemesasComponent,
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "tarjetas-remesa/detalle-remesas",
    component: RemesasDetalleComponent,
    canActivate: [AuthGuard],
    pathMatch: "full"
  }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class RemesasRoutingModule {}