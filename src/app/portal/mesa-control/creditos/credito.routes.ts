/*
 * @version 1.0 (07-06-2017)
 * @author lfgonzalezr
 * @description Archivo de rutas de los documentos de crédito
 * @contributors Front-end team
 */
import { RouterModule, Routes } from '@angular/router';

/* Importacion de los componentes para la validacion de los documentos de credito */
import { MesaControlBusquedaCreditos } from './busqueda/busqueda.component';
import { MesaControlDocumentosCredito } from './documentos-credito/documentos.component';

const RUTAS: Routes = [
  {
    path: "mesa-control/credito",
    component: MesaControlBusquedaCreditos,
    pathMatch: "full"
  },
  {
    path: "mesa-control/credito/documentos",
    component: MesaControlDocumentosCredito,
    pathMatch: "full"
  }
];

export const MESA_CREDITO = RouterModule.forRoot(RUTAS);
