import { NgModule,CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { HeaderModule } from '../../../header/header.module';
import { AnimateModule } from '../../../animate/animate.module';

import { SeguimientoRemesaComponent } from './seguimiento.component';
import { SeguimientoRemesaRoutingModule } from './seguimiento-routing.module';

@NgModule({
	imports: [
		SeguimientoRemesaRoutingModule,
		HeaderModule,
	    BrowserModule,
	    BrowserAnimationsModule,
	    SimpleNotificationsModule.forRoot(),
	    FormsModule,
	    ReactiveFormsModule,
	    AnimateModule
	],
	declarations: [SeguimientoRemesaComponent],
	providers: [],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SeguimientoRemesaModule {}