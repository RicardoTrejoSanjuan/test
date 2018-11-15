/*
 * @version 1.0 (09/10/2018)
 * @author rtrejo
 * @description Muestra las solicitudes que se encuentras en mesa de control (Pendientes por revision, Devueltas, Rechazadas y Liberadas)
 * @contributors Front-end team
 */

import { RouterModule, Routes } from '@angular/router';


import { MesaControlDosMenu } from './shared/components/menu/menu.component';
const MESA_RUTAS: Routes = [
  {
    path: "mesa-control2",
    component: MesaControlDosMenu,
    pathMatch: "full"
  }
];
export const MESA_ROUTING = RouterModule.forRoot(MESA_RUTAS);
