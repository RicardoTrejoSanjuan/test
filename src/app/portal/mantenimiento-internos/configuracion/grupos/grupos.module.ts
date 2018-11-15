import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { GruposComponent } from './grupos.component';
import { GruposRouting } from './grupos.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { HeaderModule} from '../../../../header/header.module';
import { AnimateModule } from '../../../../animate/animate.module';
import { Ng2TablesModule } from '../../../../ng2-tables/ng2-tables.module';
import { SimpleNotificationsModule } from 'angular2-notifications';





@NgModule({
    imports: [
      BrowserModule,
      GruposRouting,
      HeaderModule,
      AnimateModule,
      FormsModule,
      ReactiveFormsModule,
      Ng2TablesModule,
      SimpleNotificationsModule.forRoot()
    ],
    declarations: [//Componentes
        GruposComponent
    ],
    providers: [
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
  })
  
  
  
  export class GruposModule { }