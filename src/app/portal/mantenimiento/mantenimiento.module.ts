// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule}   from '@angular/forms';

import { HeaderModule } from '../../header/header.module';

import { AuthGuard} from '../../classGeneric/config';

import { AnimateModule } from '../../animate/animate.module';


// Importaciones routing app
import { MantenimientoRoutingModule }     from './mantenimiento-routing.component';

// Component
 import { MantenimientoComponent } from './mantenimiento.component';
// import { InfiniteMovimientosComponent } from './infinite-movimientos.component';

import {ValidationModule} from '../../validator/validation.module';
import {ValidationService} from '../../validator/validation.service';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { EmpleadoModule } from './mantenimiento-empleados/empleados.module';
import { InstitucionesModule } from './mantenimiento-instituciones/instituciones.module';
import { SucursalesModule } from './mantenimiento-sucursales/sucursales.module';
import { AutorizacionModule } from './autorizacion/autorizacion.module';
import {DirectivesModule} from '../../directives/directive.module';

@NgModule({
  imports: [
    HeaderModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AnimateModule,
    MantenimientoRoutingModule,
    ValidationModule,
    SimpleNotificationsModule.forRoot(),
    EmpleadoModule,
    InstitucionesModule,
    SucursalesModule,
    AutorizacionModule,
    DirectivesModule
  ],
  declarations: [//Componentes
   MantenimientoComponent
  ],
  providers: [
    AuthGuard,
    ValidationService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class MantenimientoModule { }
