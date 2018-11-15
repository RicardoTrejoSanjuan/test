/*
 * @version 1.0 (21-11-2017)
 * @author lfgonzalezr
 * @description
 * @contributors Front-end team
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* Importacion de modulos para manejo de notificaiones */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AnimateModule } from '../../../../animate/animate.module';
/*Modulos de BIG*/
import { HeaderModule } from '../../../../header/header.module';
import { Ng2TablesModule } from '../../../../ng2-tables/ng2-tables.module';
import { ValidationModule } from '../../../../validator/validation.module';
import { ValidationService } from '../../../../validator/validation.service';
import { DirectivesModule } from '../../../../directives/directive.module';
import { MONITOREO_MANTENIMIENTOS_ROUTING } from './monitoreo-mantenimientos.routes';
/*Impotación de componentes de mantenimientos de monitoreo*/
import { MonitoreoCatalogosAreas } from './areas/catalogos-areas.component';
import { MonitoreoCatalogosEnlace } from './enlace-flujo/catalogos-enlace.component';
import { MonitoreoCatalogosEtapas } from './etapas/catalogos-etapas.component';
import { MonitoreoCatalogosResponsables } from './responsables/catalogos-responsables.component';
import { MonitoreoCatalogosAsesor } from './asesor/catalogos-asesor.component';
import { MonitoreoCatalogosFlujo } from './tipo-flujo/catalogos-tipo-flujo.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        SimpleNotificationsModule,
        AnimateModule,
        HeaderModule,
        Ng2TablesModule,
        ValidationModule,
        DirectivesModule,
        MONITOREO_MANTENIMIENTOS_ROUTING
    ],
    declarations: [
        MonitoreoCatalogosAreas,
        MonitoreoCatalogosEnlace,
        MonitoreoCatalogosEtapas,
        MonitoreoCatalogosResponsables,
        MonitoreoCatalogosAsesor,
        MonitoreoCatalogosFlujo
    ],
    providers: [
        ValidationService
    ]
})

export class MonitoreoMantenimientosModule { }
