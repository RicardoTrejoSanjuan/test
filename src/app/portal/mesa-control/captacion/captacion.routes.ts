/*
 * @version 1.0 (07-06-2017)
 * @author lfgonzalezr
 * @description Archivo de rutas para la calificación de solicitudes de captacion
 * @contributors Front-end team
 */
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../classGeneric/config';

/* Importación de de las bandejas de entrada de mesa de control  */
import { MesaControlBandejas } from './bandejas/bandejas.component';
import { MesaControlSolicitudes } from './solicitudes/solicitudes.component';
import { ValidacionSolicitudMC } from './validacion-solicitud/validacion.component';

const RUTAS: Routes = [
  {
    path: "mesa-control/captacion",
    component: MesaControlBandejas,
    pathMatch: "full"
  },
  {
    path: "mesa-control/captacion/solicitudes",
    component: MesaControlSolicitudes,
    pathMatch: "full"
  },
  {
    path: "mesa-control/captacion/solicitud/validacion",
    component: ValidacionSolicitudMC,
    pathMatch: "full"
  }
];

export const MESA_CAPTACION = RouterModule.forRoot(RUTAS);
