import { NgModule,CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { HeaderModule } from '../../../header/header.module';
import { AnimateModule } from '../../../animate/animate.module';
import { AuthGuard} from '../../../classGeneric/config';

import { Ng2TablesModule } from '../../../ng2-tables/ng2-tables.module';

import { TarjetasComponent } from './tarjetas.component';
import { TarjetasRoutingModule } from './tarjetas-routing.module';

import { DirectivesModule } from '../../../directives/directive.module';

@NgModule({
	imports: [
		TarjetasRoutingModule,
		HeaderModule,
	    BrowserModule,
	    BrowserAnimationsModule,
	    SimpleNotificationsModule.forRoot(),
	    FormsModule,
	    ReactiveFormsModule,
	    AnimateModule,
	    Ng2TablesModule,
	    DirectivesModule
	],
	declarations: [TarjetasComponent],
	providers: [AuthGuard],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TarjetasModule {}