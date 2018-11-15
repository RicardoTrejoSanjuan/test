import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { AuthGuard  } from '../../classGeneric/config';
import { TarjetasRemesaComponent } from './tarjetas-remesa.component';
import { TarjetasDetalleComponent } from './tarjetas/tarjetas-detalle/tarjetas-detalle.component';

const routes: Routes = [
  {
    path: "tarjetas-remesa",
    component: TarjetasRemesaComponent,
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "tarjetas-remesa/detalle-tarjetas",
    component: TarjetasDetalleComponent,
    canActivate: [AuthGuard],
    pathMatch: "full"
  }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class TarjetasRemesaRoutingModule {}