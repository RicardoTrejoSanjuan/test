/*
 * @version 1.0 (21-11-2017)
 * @author lfgonzalezr
 * @description Monitoreo de instituciones
 * @contributors Front-end team
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* Importacion de modulos para manejo de notificaiones */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AnimateModule } from '../../../animate/animate.module';

import { HeaderModule } from '../../../header/header.module';
import { Ng2TablesModule } from '../../../ng2-tables/ng2-tables.module';
import { ValidationModule } from '../../../validator/validation.module';
import { ValidationService } from '../../../validator/validation.service';
import { DirectivesModule } from '../../../directives/directive.module';
import { MONITOREO_ROUTING } from './monitoreo.routes';
/*Importación modulo de mantenimientos de monitoreo*/
import { MonitoreoMantenimientosModule } from './monitoreo-mantenimientos/monitoreo-mantenimientos.module';
/*Importación de componentes*/
import { MonitoreoMenu } from './monitoreo-menu/monitoreo-menu.component';
import { MonitoreoAltaProspecto } from './monitoreo-alta-prospecto/monitoreo-alta-prospecto.component';
import { MonitoreoSeguimientoBusqueda } from './monitoreo-seguimiento/seguimiento-busqueda/seguimiento-busqueda.component';
import { MonitoreoSeguimientoValidacion } from './monitoreo-seguimiento/seguimiento-validacion/seguimiento-validacion.component';
import { MonitoreoConfiguracion } from './monitoreo-configuracion/monitoreo-configuracion.component';

import { MaterialAppModule } from '../../../material/material.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HeaderModule,
        BrowserAnimationsModule,
        SimpleNotificationsModule,
        AnimateModule,
        MonitoreoMantenimientosModule,
        Ng2TablesModule,
        ValidationModule,
        DirectivesModule,
        MONITOREO_ROUTING,
        MaterialAppModule
    ],
    declarations: [
        MonitoreoMenu,
        MonitoreoAltaProspecto,
        MonitoreoSeguimientoBusqueda,
        MonitoreoSeguimientoValidacion,
        MonitoreoConfiguracion
    ],
    providers: [
        ValidationService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class MonitoreoModule { }
