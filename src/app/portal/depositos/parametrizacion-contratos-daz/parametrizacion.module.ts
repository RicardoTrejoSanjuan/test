// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule}   from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';

import { HeaderModule } from '../../../header/header.module';

import { AuthGuard} from '../../../classGeneric/config';

import { AnimateModule } from '../../../animate/animate.module';

import { LiquidacionComponent } from './liquidacion/liquidacion.component';
import { CanalesComponent } from './canales/canales.component';

// Importaciones routing app
import { ParametrizacionRoutin }     from './parametrizacion.routing';
import { ParametrizacionComponent } from './parametrizacion.component';
import { EmisorComponent } from './comisionemisor/comisionemisor.component';
import { ClienteComponent } from './comisioncliente/comisioncliente.component';
import { ReferenciaDepositos } from './referencia/referencia.component';
import { LayoutComponent } from './layout/layout.component';

import { SimpleNotificationsModule } from 'angular2-notifications';
import { Notifications } from '../../../classGeneric/notifications';


import { MaterialAppModule } from '../../../material/material.module';

@NgModule({
  imports: [
    HeaderModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AnimateModule,
    ParametrizacionRoutin,
    SimpleNotificationsModule.forRoot(),
    MaterialAppModule,
    DragulaModule,
  ],
  declarations: [//Componentes
    ParametrizacionComponent,
    LiquidacionComponent,
    CanalesComponent,
    EmisorComponent,
    ClienteComponent,
    ReferenciaDepositos,
    LayoutComponent,
  ],
  providers: [
    AuthGuard,
    Notifications
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class ParametrizacionModule { }
