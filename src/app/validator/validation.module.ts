// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';


import { ControlMessagesComponent} from './control-messages.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    JsonpModule,
  ],
  declarations: [
    ControlMessagesComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [ControlMessagesComponent]
})



export class ValidationModule { }
