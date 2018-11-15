// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule}   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SimpleNotificationsModule } from 'angular2-notifications';

import { HeaderModule} from '../../../../header/header.module';

import { AuthGuard} from '../../../../classGeneric/config';

import { AnimateModule } from '../../../../animate/animate.module';

// Importaciones routing app
import { TrackerRoutingModule }     from './tracker-routing.module';

// Component
import { TrackerComponent } from './tracker.component';


// Validator
import { ValidationModule } from '../../../../validator/validation.module';
import { ValidationService } from '../../../../validator/validation.service';




@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HeaderModule,
    TrackerRoutingModule,
    AnimateModule,
    ValidationModule
  ],
  declarations: [//Componentes
    TrackerComponent,
  ],
  providers: [AuthGuard,ValidationService,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class TrackerModule { }