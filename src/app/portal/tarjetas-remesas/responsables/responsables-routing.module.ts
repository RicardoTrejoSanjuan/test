import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { AuthGuard  } from '../../../classGeneric/config';

import { ResponsablesRemesaComponent } from './responsables.component';

const routes: Routes = [
  {
    path: "tarjetas-remesa/responsables",
    component: ResponsablesRemesaComponent,
    canActivate: [AuthGuard],
    pathMatch: "full"
  }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class ResponsablesRemesaRoutingModule {}