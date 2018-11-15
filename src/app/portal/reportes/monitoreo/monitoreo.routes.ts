/*
 * @version 1.0 (21-11-2017)
 * @author lfgonzalezr
 * @description Monitoreo de instituciones
 * @contributors Front-end team
 */
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../classGeneric/config';
/*Importación de componentes*/
import { MonitoreoMenu } from './monitoreo-menu/monitoreo-menu.component';
import { MonitoreoAltaProspecto } from './monitoreo-alta-prospecto/monitoreo-alta-prospecto.component';
import { MonitoreoSeguimientoBusqueda } from './monitoreo-seguimiento/seguimiento-busqueda/seguimiento-busqueda.component';
import { MonitoreoSeguimientoValidacion } from './monitoreo-seguimiento/seguimiento-validacion/seguimiento-validacion.component';
import { MonitoreoConfiguracion } from './monitoreo-configuracion/monitoreo-configuracion.component';

const MONITOREO_RUTAS: Routes = [
    { path: 'reportes/monitoreo', component: MonitoreoMenu, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: 'reportes/monitoreo/alta-prospecto', component: MonitoreoAltaProspecto, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: 'reportes/monitoreo/seguimiento', component: MonitoreoSeguimientoBusqueda, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: 'reportes/monitoreo/seguimiento/validacion', component: MonitoreoSeguimientoValidacion, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: 'reportes/monitoreo/configuracion', component: MonitoreoConfiguracion, canActivate: [AuthGuard], pathMatch: 'full' }
];

export const MONITOREO_ROUTING = RouterModule.forRoot(MONITOREO_RUTAS);
