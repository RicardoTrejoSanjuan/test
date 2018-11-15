import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderModule } from '../../../header/header.module';

import { FormsModule,ReactiveFormsModule}   from '@angular/forms';
import { GraficaModule } from '../../../graficas-highchart/graficas-highchart.module';

import { AnimateModule } from '../../../animate/animate.module';

import { ReportesProducto } from './producto.component';

import { REPORTES_PRODUCTO_ROUTING } from './producto.route';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { MaterialAppModule } from '../../../material/material.module';


@NgModule({
  imports: [
    BrowserModule,
    HeaderModule,
    REPORTES_PRODUCTO_ROUTING,
    GraficaModule,
    ReactiveFormsModule,
    FormsModule,
    AnimateModule,
    SimpleNotificationsModule.forRoot(),
    MaterialAppModule
  ],
  declarations: [
    ReportesProducto
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportesProductoModule { }
