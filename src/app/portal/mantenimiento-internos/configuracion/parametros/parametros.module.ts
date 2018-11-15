import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { ParametrosComponent } from './parametros.component';
import { ParametrosRouting } from './parametros.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { HeaderModule} from '../../../../header/header.module';
import { AnimateModule } from '../../../../animate/animate.module';
import { Ng2TablesModule } from '../../../../ng2-tables/ng2-tables.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
// import { OrderrByPipe } from './parametros.pipe';




@NgModule({
    imports: [
      BrowserModule,
      ParametrosRouting,
      HeaderModule,
      AnimateModule,
      FormsModule,
      ReactiveFormsModule,
      Ng2TablesModule,
     
      SimpleNotificationsModule.forRoot()
    ],
    declarations: [//Componentes
        ParametrosComponent
       
    ],
    providers: [
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
  })
  
  
  
  export class ParametrosModule { }