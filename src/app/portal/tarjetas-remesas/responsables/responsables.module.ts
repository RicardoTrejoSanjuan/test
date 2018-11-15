import { NgModule,CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { HeaderModule } from '../../../header/header.module';
import { AnimateModule } from '../../../animate/animate.module';
import { AuthGuard} from '../../../classGeneric/config';

import { Ng2TablesModule } from '../../../ng2-tables/ng2-tables.module';

import { ResponsablesRemesaComponent } from './responsables.component';
import { ResponsablesRemesaRoutingModule } from './responsables-routing.module';

import { DirectivesModule } from '../../../directives/directive.module';
import { ValidationModule } from '../../../validator/validation.module';
import { ValidationService } from '../../../validator/validation.service';

@NgModule({
	imports: [
		ResponsablesRemesaRoutingModule,
		HeaderModule,
	    BrowserModule,
	    BrowserAnimationsModule,
	    SimpleNotificationsModule.forRoot(),
	    FormsModule,
	    ReactiveFormsModule,
	    AnimateModule,
	    Ng2TablesModule,
	    DirectivesModule,
	    ValidationModule
	],
	declarations: [ResponsablesRemesaComponent],
	providers: [AuthGuard,ValidationService],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ResponsablesRemesaModule {}