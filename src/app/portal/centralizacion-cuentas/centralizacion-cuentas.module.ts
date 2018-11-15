// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { FormsModule,ReactiveFormsModule}   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderModule } from '../../header/header.module';
import { AuthGuard} from '../../classGeneric/config';

import { AnimateModule } from '../../animate/animate.module';

import { CentralizacionCuentasRoutingModule } from './centralizacion-cuentas.routing';
// Importaciones routing app
// import { CentralizacionCuentasRoutingModule }     from './centralizacion-cuentas-routing.component';
import {AltaServicioComponent} from './alta-servicio/alta-servicio.component';
import {AltaCuentasPerifericasComponent } from './alta-cuentas-perifericas/alta-cuentas-perifericas.component';

// Component
import { CentralizacionCuentasComponent } from './centralizacion-cuentas.component';
// import { InfiniteMovimientosComponent } from './infinite-movimientos.component';

import {ValidationModule} from '../../validator/validation.module';
import {ValidationService} from '../../validator/validation.service';
import { SimpleNotificationsModule } from 'angular2-notifications';
import {DirectivesModule} from '../../directives/directive.module';
import { DragulaModule } from 'ng2-dragula';
import { MaterialAppModule } from '../../material/material.module';
import { Notifications } from '../../classGeneric/notifications';
import { TreeView } from "./alta-cuentas-perifericas/tree-view.component";
// import{ConsultaEstructuraComponent} from "./consulta-estructura/consulta-estructura.component";
import {ParametrizacionCuentaPrincipalComponent} from './parametrizacion-cuenta-principal/parametrizacion-cuenta-principal.component';


@NgModule({
  imports: [
    
    HeaderModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AnimateModule,
    
    // CentralizacionCuentasRoutingModule,
    ValidationModule,
    SimpleNotificationsModule.forRoot(),
    DirectivesModule,

    DragulaModule,
    CentralizacionCuentasRoutingModule,
    MaterialAppModule

  ],
  declarations: [//Componentes
    CentralizacionCuentasComponent,
    AltaCuentasPerifericasComponent,
    AltaServicioComponent,
    TreeView,
    /* ConsultaEstructuraComponent,*/
    ParametrizacionCuentaPrincipalComponent 
  ],
  providers: [
    AuthGuard,
    ValidationService,
    Notifications
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class CentralizacionCuentasModule { }
