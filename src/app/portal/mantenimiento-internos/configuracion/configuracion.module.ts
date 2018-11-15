import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { ConfiguracionMIComponent } from './configuracion.component';
import { ConfiguracionMIRouting } from './configuracion.routes';
import { ParametrosModule } from './parametros/parametros.module';
import { GruposModule } from './grupos/grupos.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { HeaderModule} from '../../../header/header.module';
import { AnimateModule } from '../../../animate/animate.module';
import { Ng2TablesModule } from '../../../ng2-tables/ng2-tables.module';
import { SimpleNotificationsModule } from 'angular2-notifications';





@NgModule({
    imports: [
      BrowserModule,
      ConfiguracionMIRouting,
      HeaderModule,
      AnimateModule,
      FormsModule,
      ReactiveFormsModule,
      Ng2TablesModule,
      ParametrosModule,
      GruposModule,
      SimpleNotificationsModule.forRoot()
    ],
    declarations: [//Componentes
        ConfiguracionMIComponent
    ],
    providers: [
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
  })
  
  
  
  export class ConfiguracionMIModule { }