// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule}   from '@angular/forms';

import { HeaderModule } from '../../header/header.module';

import { AuthGuard} from '../../classGeneric/config';

import { AnimateModule } from '../../animate/animate.module';

import { MaterialAppModule } from '../../material/material.module';

// Importaciones routing app
import { BeneficiosRoutingModule }     from './beneficios-routing.component';

// Component
import { BeneficiosComponent } from './beneficios.component';
import { PromocionesModule } from './promociones/promociones.module';

import {ValidationModule} from '../../validator/validation.module';
import {ValidationService} from '../../validator/validation.service';
import { SimpleNotificationsModule } from 'angular2-notifications';
@NgModule({
  imports: [
    HeaderModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AnimateModule,
    BeneficiosRoutingModule,
    ValidationModule,
    PromocionesModule,
    SimpleNotificationsModule.forRoot(),
    MaterialAppModule
  ],
  declarations: [//Componentes
    BeneficiosComponent
  ],
  providers: [
    AuthGuard,
    ValidationService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class BeneficiosModule { }