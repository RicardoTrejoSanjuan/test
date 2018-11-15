/*
 * @version 1.0 (09/10/2018)
 * @author rtrejo
 * @description Archivo de rutas para la calificación de solicitudes de captacion
 * @contributors Front-end team
 */
import { RouterModule, Routes } from '@angular/router';

/* Importación de de las bandejas de entrada de mesa de control  */
import { MesaControlDosBandejas } from './bandejas/bandejas.component';
import { MesaControlDosSolicitud } from './validacion-solicitud/solicitud.component';
import { MesaControlDosDocumento } from './validacion-documentos/document.component';

const RUTAS: Routes = [
  {
    path: "mesa-control2/captacion",
    component: MesaControlDosBandejas,
    pathMatch: "full"
  },
  {
   path: "mesa-control2/captacion/solicitud",
   component: MesaControlDosSolicitud,
   pathMatch: "full"
 },
 {
  path: "mesa-control2/captacion/solicitud/documento",
  component: MesaControlDosDocumento,
  pathMatch: "full"
}
  // {
  //   path: "mesa-control/captacion/solicitudes",
  //   component: MesaControlSolicitudes,
  //   pathMatch: "full"
  // },
  // {
  //   path: "mesa-control/captacion/solicitud/validacion",
  //   component: ValidacionSolicitudMC,
  //   pathMatch: "full"
  // }
];

export const MESA_CAPTACION = RouterModule.forRoot(RUTAS);
