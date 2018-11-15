import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule,ReactiveFormsModule}   from '@angular/forms';
import { HeaderModule} from '../../../header/header.module';
import { AuthGuard} from '../../../classGeneric/config';
import { PerfilamientoRoutingModule } from './perfilamiento-routing.module';

import { ReportesPerfilamiento } from './grafica-perfilamiento/grafica-perfilamiento.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';

/* Modulos para la generacion de graficas de highchart */
import { GraficaModule } from '../../../graficas-highchart/graficas-highchart.module';

import { MaterialAppModule } from '../../../material/material.module';

@NgModule({
  imports: [
    PerfilamientoRoutingModule,
    HeaderModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    GraficaModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule,
    MaterialAppModule
  ],
  declarations: [
    ReportesPerfilamiento,
  ],
  providers: [
      AuthGuard
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class PerfilamientoModule{}
