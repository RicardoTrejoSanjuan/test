// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { FormsModule,ReactiveFormsModule}   from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HeaderModule } from '../../header/header.module';

import { AuthGuard} from '../../classGeneric/config';

import { AnimateModule } from '../../animate/animate.module';

import { MaterialAppModule } from '../../material/material.module';

// Importaciones routing app
import { InfiniteDatosRoutingModule }     from './infinite-datos-routing.component';

// Component
import { InfiniteDatosComponent } from './infinite-datos.component';
import { InfiniteMovimientosComponent } from './infinite-movimientos.component';

import {ValidationModule} from '../../validator/validation.module';
import {ValidationService} from '../../validator/validation.service';
import { SimpleNotificationsModule } from 'angular2-notifications';
@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    FormsModule,
    ReactiveFormsModule,
    AnimateModule,
    InfiniteDatosRoutingModule,
    ValidationModule,
    SimpleNotificationsModule.forRoot(),
    MaterialAppModule
  ],
  declarations: [//Componentes
    InfiniteDatosComponent,
    InfiniteMovimientosComponent,
  ],
  providers: [
    AuthGuard,
    ValidationService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class InfiniteDatosModule { }

