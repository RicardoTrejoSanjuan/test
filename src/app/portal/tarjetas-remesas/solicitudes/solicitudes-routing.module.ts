import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { AuthGuard  } from '../../../classGeneric/config';

import { SolicitudesRemesaComponent } from './solicitudes.component';

const routes: Routes = [
  {
    path: "tarjetas-remesa/solicitudes",
    component: SolicitudesRemesaComponent,
    canActivate: [AuthGuard],
    pathMatch: "full"
  }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class SolicitudesRemesaRoutingModule {}