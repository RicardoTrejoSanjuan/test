/*
 * @version 1.0 (21-11-2017)
 * @author lfgonzalezr
 * @description
 * @contributors Front-end team
 */
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../../classGeneric/config';
/*Impotación de componentes de mantenimientos de monitoreo*/
import { MonitoreoCatalogosAreas } from './areas/catalogos-areas.component';
import { MonitoreoCatalogosEtapas } from './etapas/catalogos-etapas.component';
import { MonitoreoCatalogosResponsables } from './responsables/catalogos-responsables.component';
import { MonitoreoCatalogosEnlace } from './enlace-flujo/catalogos-enlace.component';
import { MonitoreoCatalogosAsesor } from './asesor/catalogos-asesor.component';
import { MonitoreoCatalogosFlujo } from './tipo-flujo/catalogos-tipo-flujo.component';


const MONITOREO_RUTAS_MANTENIMIENTOS: Routes = [
    { path: 'reportes/monitoreo/mantenimientos', component: MonitoreoCatalogosAreas, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: 'reportes/monitoreo/mantenimientos/areas', redirectTo: 'reportes/monitoreo/mantenimientos', canActivate: [AuthGuard], pathMatch: 'full' },
    { path: 'reportes/monitoreo/mantenimientos/etapas', component: MonitoreoCatalogosEtapas, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: 'reportes/monitoreo/mantenimientos/responsables', component: MonitoreoCatalogosResponsables, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: 'reportes/monitoreo/mantenimientos/enlaces', component: MonitoreoCatalogosEnlace, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: 'reportes/monitoreo/mantenimientos/asesor', component: MonitoreoCatalogosAsesor, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: 'reportes/monitoreo/mantenimientos/flujo', component: MonitoreoCatalogosFlujo, canActivate: [AuthGuard], pathMatch: 'full' }
];

export const MONITOREO_MANTENIMIENTOS_ROUTING = RouterModule.forRoot(MONITOREO_RUTAS_MANTENIMIENTOS);
