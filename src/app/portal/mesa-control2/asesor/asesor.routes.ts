/*
 * @version 1.0 (09/10/2018)
 * @author rtrejo
 * @description Archivo de rutas para la calificación de solicitudes de captacion
 * @contributors Front-end team
 */
import { RouterModule, Routes } from '@angular/router';

/* Importación de de las bandejas de entrada de mesa de control  */
import { AsesorBandejas } from './bandejas/bandejas.component';

const RUTAS: Routes = [
  {
    path: "mesa-control2/AsesorCentral",
    component: AsesorBandejas,
    pathMatch: "full"
  }
];

export const MESA_CAPTACION = RouterModule.forRoot(RUTAS);
