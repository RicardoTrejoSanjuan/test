// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule}   from '@angular/forms';
import { HeaderModule } from '../../../header/header.module';

import { AuthGuard} from '../../../classGeneric/config';

import { AnimateModule } from '../../../animate/animate.module';

// Component
 import { PromocionesRoutingModule } from './promociones-routing.component';
// import { InfiniteMovimientosComponent } from './infinite-movimientos.component';

import {ValidationModule} from '../../../validator/validation.module';
import {ValidationService} from '../../../validator/validation.service';
import {SimpleNotificationsModule } from 'angular2-notifications';

import {DirectivesModule} from '../../../directives/directive.module';
import { ConfiguracionPromocionesComponent } from './configuracionPromociones/configuracionPromociones.component';
import { AsignacionPromocionesComponent } from './asignacionPromociones/asignacionPromociones.component';
import { DraggableDirective } from '../drag-drop/draggable.directive';
import { DropTargetDirective } from '../drag-drop/drop-target.directive';
import { DragService } from '../drag-drop/drag.service';

@NgModule({
  imports: [
    HeaderModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AnimateModule,
    PromocionesRoutingModule,
    ValidationModule,
    SimpleNotificationsModule.forRoot(),
    DirectivesModule
  ],
  declarations: [//Componentes
    ConfiguracionPromocionesComponent,
    AsignacionPromocionesComponent,
    DraggableDirective, 
    DropTargetDirective
  ],
  providers: [
    AuthGuard,
    ValidationService,
    DragService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class PromocionesModule { }