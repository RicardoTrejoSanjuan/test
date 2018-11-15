import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule}   from '@angular/forms';


import { AnimateModule } from '../../../animate/animate.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';


/* Modulos de la aplicaion Portal */
import { HeaderModule } from '../../../header/header.module';
import { AuthGuard } from '../../../classGeneric/config';

import { ReporteColocacionGeneral } from './grafica-colocacion-general/grafica-colocacion.component';
import { ColocacionRoutingModule } from './colocacion-routing.module';


/* Modulos para la generacion de graficas de highchart */
import { GraficaModule } from '../../../graficas-highchart/graficas-highchart.module';

import { MaterialAppModule } from '../../../material/material.module';

@NgModule({
	imports: [
		AnimateModule,
	    HeaderModule,
	    BrowserModule,
	    FormsModule,
	    GraficaModule,
	    ReactiveFormsModule,
	    ColocacionRoutingModule,
	    BrowserAnimationsModule,
		SimpleNotificationsModule.forRoot(),
		MaterialAppModule
	],
	declarations: [
		ReporteColocacionGeneral
	],
	providers: [AuthGuard],
	schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})

export class ColocacionModule { }