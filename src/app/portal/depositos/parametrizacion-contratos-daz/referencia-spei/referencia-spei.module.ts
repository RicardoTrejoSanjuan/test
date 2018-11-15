// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule}   from '@angular/forms';

import { HeaderModule } from '../../../../header/header.module';

import { AuthGuard} from '../../../../classGeneric/config';

import { AnimateModule } from '../../../../animate/animate.module';



// Importaciones routing app
import { ReferenciaSPEIRoutin }     from './referencia-spei.routing';
import { ReferenciaSPEI } from './referencia-spei.component';


import { SimpleNotificationsModule } from 'angular2-notifications';

import { MaterialAppModule } from '../../../../material/material.module';

@NgModule({
  imports: [
    HeaderModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AnimateModule,
    ReferenciaSPEIRoutin,
    SimpleNotificationsModule.forRoot(),
    MaterialAppModule,
  ],
  declarations: [//Componentes
    ReferenciaSPEI
  ],
  providers: [
    AuthGuard,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class ReferenciaSPEIModule { }
