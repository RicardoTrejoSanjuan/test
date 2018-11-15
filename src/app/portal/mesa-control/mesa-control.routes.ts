/*
 * @version 1.0 (07-06-2017)
 * @author lfgonzalezr
 * @description Archivo general de rutas para la mesa de control
 * @contributors Front-end team
 */
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard} from '../../classGeneric/config';


import { MesaControlMenu } from './menu/menu.component';
const MESA_RUTAS: Routes = [
  {
    path: "mesa-control",
    component: MesaControlMenu,
    pathMatch: "full"
  }
];
export const MESA_ROUTING = RouterModule.forRoot(MESA_RUTAS);
