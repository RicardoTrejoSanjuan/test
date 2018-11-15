// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule}   from '@angular/forms';


import { HeaderModule } from '../../../header/header.module';

import { AuthGuard} from '../../../classGeneric/config';

import { AnimateModule } from '../../../animate/animate.module';
import { TransaccionalidadComponent } from './transaccionalidad/transaccionalidad.component';
import { ComisionesComponent } from './comisiones/comisiones.component';



// Importaciones routing app
import { routes }     from './reportes.routing';
import { BusquedaComponent } from './reportes.component';


import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
  imports: [
    HeaderModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AnimateModule,
    routes,
    SimpleNotificationsModule.forRoot(),
  ],
  declarations: [//Componentes
    BusquedaComponent,
    TransaccionalidadComponent,
    ComisionesComponent
  ],
  providers: [
    AuthGuard,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class ReportesModule { }
