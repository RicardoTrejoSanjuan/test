// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule}   from '@angular/forms';

import { HeaderModule } from '../../../header/header.module';

import { AuthGuard} from '../../../classGeneric/config';

import { AnimateModule } from '../../../animate/animate.module';

import {DirectivesModule} from '../../../directives/directive.module';

// Importaciones routing app
import { EmpleadosRoutingModuule }     from './empleados-routing.component';


// Component
 import { EmpleadoComponent } from './empleados.component';
// import { InfiniteMovimientosComponent } from './infinite-movimientos.component';

import {ValidationModule} from '../../../validator/validation.module';
import {ValidationService} from '../../../validator/validation.service';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { MantenimientoEmpleadoModule } from './modulos-mantenimiento-empleados/mantenimiento-empleados.module';
import { DatosHogarComponent } from './modulos-mantenimiento-empleados/datos-hogar/datos-hogar.component';
import { DispersionesComponent  } from './modulos-mantenimiento-empleados/dispersiones/dispersiones.component';

import { MaterialAppModule } from '../../../material/material.module';

@NgModule({
  imports: [
    HeaderModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AnimateModule,
    EmpleadosRoutingModuule,
    ValidationModule,
    SimpleNotificationsModule.forRoot(),
    MantenimientoEmpleadoModule,
    DirectivesModule,
    MaterialAppModule
  ],
  declarations: [//Componentes
   EmpleadoComponent,
   
  ],
  providers: [
    AuthGuard,
    ValidationService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class EmpleadoModule { }