// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeaderModule } from '../../header/header.module';
import { AuthGuard} from '../../classGeneric/config';

import { AnimateModule } from '../../animate/animate.module';

import { BusquedaComponent } from './alta-servicio-daz/alta.component';
import { AutorizacionComponent } from './autorizacion/autorizacion.component';

// Importaciones routing app
import { routes }     from './depositos.routing';
import { DepositoMenuComponent } from './depositos.component';


import { SimpleNotificationsModule } from 'angular2-notifications';
import { Notifications } from '../../classGeneric/notifications';



@NgModule({
  imports: [
    HeaderModule, 
    CommonModule,
    FormsModule,
    AnimateModule,
    SimpleNotificationsModule.forRoot(),
    routes,
  ],
  declarations: [//Componentes
    DepositoMenuComponent,
    BusquedaComponent,
    AutorizacionComponent,
  ],
  providers: [
    AuthGuard,
    Notifications,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})


export class DepositosReferenciadoModule {}