// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule}   from '@angular/forms';

import { HeaderModule } from '../../../../header/header.module';

import { AuthGuard} from '../../../../classGeneric/config';

import { AnimateModule } from '../../../../animate/animate.module';

import { DragulaModule } from 'ng2-dragula';


// Importaciones routing app
import { NegociosRoutin }     from './negocios.routing';
import { NegocioComponent } from './negocios.component';


import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
  imports: [
    HeaderModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AnimateModule,
    NegociosRoutin,
    SimpleNotificationsModule.forRoot(),
    DragulaModule,
  ],
  declarations: [//Componentes
    NegocioComponent
  ],
  providers: [
    AuthGuard,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class NegociosModule { }
