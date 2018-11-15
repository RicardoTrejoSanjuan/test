// Importaciones generales
import { NgModule }      from '@angular/core';
import { RouterModule, Routes}   from '@angular/router';
// Seguridad para las Url
import { AuthGuard} from '../../../../classGeneric/config';
// Component
// import { GruposComponent } from './grupos.component';

const RoutesModule: Routes = [
  {
    path: "mantenimientos-internos/empleados/tracking",
    // component: GruposComponent,//Clase del comonente
    canActivate: [AuthGuard],
    redirectTo: "mantenimientos-internos/empleados",
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



export class TrackerRoutingModule { }