import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { IpsComponent } from './ips.component';
import { IpsRouting } from './ips.routes';

import { BrowserModule } from '@angular/platform-browser';



@NgModule({
    imports: [
      BrowserModule,
      IpsRouting
    ],
    declarations: [//Componentes
      IpsComponent
    ],
    providers: [
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
  })
  
  
  
  export class IpsModule { }