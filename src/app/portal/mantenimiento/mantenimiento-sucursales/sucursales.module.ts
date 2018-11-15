import {NgModule, CUSTOM_ELEMENTS_SCHEMA}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule,ReactiveFormsModule}   from '@angular/forms';


import {HeaderModule} from '../../../header/header.module';
import {AuthGuard} from '../../../classGeneric/config';
import {AnimateModule} from '../../../animate/animate.module';


import {ValidationModule} from '../../../validator/validation.module';
import {ValidationService} from '../../../validator/validation.service';
import {SimpleNotificationsModule} from 'angular2-notifications';


import {SucursalRoutingModule}     from './sucursales-routing.module';
import {SucursalesComponent} from './sucursales.component';

import {DirectivesModule} from '../../../directives/directive.module';

import { MaterialAppModule } from '../../../material/material.module';


@NgModule({
	imports: [
		 HeaderModule,
	    BrowserModule,
	    FormsModule,
	    ReactiveFormsModule,
	    AnimateModule,
	    SucursalRoutingModule,
	    ValidationModule,
	    SimpleNotificationsModule.forRoot(),
		DirectivesModule,
		MaterialAppModule
	],
	declarations: [SucursalesComponent],
	providers: [AuthGuard,ValidationService],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SucursalesModule {}