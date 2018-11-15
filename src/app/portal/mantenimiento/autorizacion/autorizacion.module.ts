// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule}   from '@angular/forms';

import { HeaderModule } from '../../../header/header.module';

import { AuthGuard} from '../../../classGeneric/config';

import { AnimateModule } from '../../../animate/animate.module';


// Importaciones routing app
import { AutorizacionRoutingModule }     from './autorizacion-routing.component';

// Component
 import { AutorizacionComponent } from './autorizacion.component';

import {DirectivesModule} from '../../../directives/directive.module';

import {ValidationModule} from '../../../validator/validation.module';
import {ValidationService} from '../../../validator/validation.service';
import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
  imports: [
    HeaderModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AnimateModule,
    AutorizacionRoutingModule,
    ValidationModule,
    DirectivesModule,
    SimpleNotificationsModule.forRoot(),
  ],
  declarations: [//Componentes
   AutorizacionComponent
  ],
  providers: [
    AuthGuard,
    ValidationService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class AutorizacionModule { }