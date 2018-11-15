import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { AuthGuard  } from '../../../classGeneric/config';

import { TarjetasComponent } from './tarjetas.component';

const routes: Routes = [
  {
    path: "tarjetas-remesa/tarjetas",
    component: TarjetasComponent,
    canActivate: [AuthGuard],
    pathMatch: "full"
  }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class TarjetasRoutingModule {}