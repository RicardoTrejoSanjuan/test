import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { HeaderModule} from '../../../header/header.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule}   from '@angular/forms';

//Importacion de los componentes del modulo de reportes de mesa de control
import { MesaControlReportesEstados } from './reportes-estados/reportes-estados.component';
import { MesaControlReportesAnalista } from './reportes-analista/reportes-analista.component';
import { MesaControlReportesEmpresas } from './reportes-empresas/reportes-empresas.component';
import { Empresas } from './empresas/empresas.component';
import { GraficaModule } from '../../../graficas-highchart/graficas-highchart.module';
//Archivo de configuracion de rutas de mesa de control
import { MESA_REPORTES } from './reportes.routes';
import { AuthGuard} from '../../../classGeneric/config';
import { ValidationService } from '../../../validator/validation.service';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AnimateModule } from '../../../animate/animate.module';
import { ValidationModule } from '../../../validator/validation.module';
//Agregando componente para paginacion con todos los registros disponibles
import { PaginationFron } from '../../../classGeneric/paginationFront';

import { MaterialAppModule } from '../../../material/material.module';

@NgModule({
  imports: [
    MESA_REPORTES,
    BrowserModule,
    HeaderModule,
    GraficaModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    AnimateModule,
    ValidationModule,
    MaterialAppModule,
  ],
  declarations: [
    MesaControlReportesAnalista,
    MesaControlReportesEstados,
    MesaControlReportesEmpresas,
    Empresas,
  ],
  providers: [AuthGuard,ValidationService,PaginationFron ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class MesaControlReportes { }
