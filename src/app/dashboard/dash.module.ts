// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';


import { HeaderModule} from '../header/header.module';

import { AuthGuard} from '../classGeneric/config';

// Importaciones routing app
import { DashRoutingModule }     from './dash-routing.module';

// Component
import { DashboardComponent } from './dash.component';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  imports: [
    HeaderModule,
    CommonModule,
    FormsModule,
    DashRoutingModule,
    SimpleNotificationsModule.forRoot(),
  ],
  declarations: [//Componentes
    DashboardComponent,
  ],
  providers: [
    AuthGuard
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class DashboardModule { }
