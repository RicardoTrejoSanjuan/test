import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderModule } from '../../../header/header.module';
import { REPORTES_CAPTACION_ROUTING } from './captacion.routes';

import { FormsModule,ReactiveFormsModule}   from '@angular/forms';

import { ReportesCaptacion } from './captacion.component';
import { PorcentajeSolicitudesPipe } from './captacion.pipe';

import { GraficaModule } from '../../../graficas-highchart/graficas-highchart.module';

import { AnimateModule } from '../../../animate/animate.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthGuard } from '../../../classGeneric/config';

import { ReportesDispersiones } from './grafica-dispersiones/grafica-dispersiones.component';

import { SimpleNotificationsModule } from 'angular2-notifications';

import { MaterialAppModule } from '../../../material/material.module';
@NgModule({
  imports: [
    AnimateModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HeaderModule,
    BrowserAnimationsModule,
    REPORTES_CAPTACION_ROUTING,
    GraficaModule,
    SimpleNotificationsModule.forRoot(),
    MaterialAppModule
  ],
  declarations: [
    ReportesCaptacion,
    ReportesDispersiones,
    PorcentajeSolicitudesPipe
  ],
  providers: [AuthGuard],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportesCaptacionModule { }
