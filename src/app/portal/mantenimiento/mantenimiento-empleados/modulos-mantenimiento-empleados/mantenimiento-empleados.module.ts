// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule}   from '@angular/forms';
import { HeaderModule } from '../../../../header/header.module';

import { AuthGuard} from '../../../../classGeneric/config';

import { AnimateModule } from '../../../../animate/animate.module';

// Component
 import { MantenimientoEmpleadosRoutingModule } from './mantenimiento-empleados-routing.component';
// import { InfiniteMovimientosComponent } from './infinite-movimientos.component';

import {ValidationModule} from '../../../../validator/validation.module';
import {ValidationService} from '../../../../validator/validation.service';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { DatosEmpleoComponent } from './datos-empleo/datos-empleo.component';
import { DatosHogarComponent } from './datos-hogar/datos-hogar.component';
import { DispersionesComponent  } from './dispersiones/dispersiones.component';
import { DatosBasicosComponent } from './datos-basicos/datos-basicos.component';

import {DirectivesModule} from '../../../../directives/directive.module';
import { SearchFilterPipe  } from '../searchfilter';

import { MaterialAppModule } from '../../../../material/material.module';

@NgModule({
  imports: [
    HeaderModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AnimateModule,
    MantenimientoEmpleadosRoutingModule,
    ValidationModule,
    SimpleNotificationsModule.forRoot(),
    DirectivesModule,
    MaterialAppModule
  ],
  declarations: [//Componentes
   DatosEmpleoComponent,
   DatosHogarComponent,
   DispersionesComponent,
   DatosBasicosComponent,
   SearchFilterPipe
  ],
  providers: [
    AuthGuard,
    ValidationService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class MantenimientoEmpleadoModule { }