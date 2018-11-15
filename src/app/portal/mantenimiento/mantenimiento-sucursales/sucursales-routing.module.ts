import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import {AuthGuard} from '../../../classGeneric/config';
import {SucursalesComponent} from './sucursales.component';

const routes: Routes = [
  {
    path: "mantenimientos/sucursales",
    component: SucursalesComponent,
    canActivate: [AuthGuard],
    pathMatch: "full"
  }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class SucursalRoutingModule {}