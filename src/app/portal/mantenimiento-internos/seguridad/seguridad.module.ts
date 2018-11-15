import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { SeguridadIpsComponent } from './seguridad.component';
import { SeguridadIpsRouting } from './seguridad.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { IpsModule } from '../seguridad/ips/ips.module';
import { HeaderModule} from '../../../header/header.module';
import { AnimateModule } from '../../../animate/animate.module';
import { Ng2TablesModule } from '../../../ng2-tables/ng2-tables.module';
import { SimpleNotificationsModule } from 'angular2-notifications';




@NgModule({
    imports: [
      BrowserModule,
      SeguridadIpsRouting,
      IpsModule,
      HeaderModule,
      AnimateModule,
      FormsModule,
      ReactiveFormsModule,
      Ng2TablesModule,
      SimpleNotificationsModule.forRoot()
    ],
    declarations: [//Componentes
        SeguridadIpsComponent
    ],
    providers: [
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
  })
  
  
  
  export class SeguridadIpsModule { }