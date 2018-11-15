// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- This one
import { FormsModule, ReactiveFormsModule}   from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';


// Component
import { DialogComponent } from './animate.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
  ],
  declarations: [
    DialogComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [DialogComponent]
})



export class AnimateModule { }
