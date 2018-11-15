import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { AuthGuard  } from '../../../classGeneric/config';

import { FoliosRemesaComponent } from './folios.component';
import { FoliosDetalleComponent } from './folios-detalle/folios-detalle.component';

const routes: Routes = [
  {
    path: "tarjetas-remesa/folios",
    component: FoliosRemesaComponent,
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "tarjetas-remesa/detalle-folios",
    component: FoliosDetalleComponent,
    canActivate: [AuthGuard],
    pathMatch: "full"
  }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class FoliosRemesaRoutingModule {}