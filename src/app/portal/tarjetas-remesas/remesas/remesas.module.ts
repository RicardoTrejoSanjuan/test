import { NgModule,CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { HeaderModule } from '../../../header/header.module';
import { AnimateModule } from '../../../animate/animate.module';
import { AuthGuard} from '../../../classGeneric/config';

import { RemesasComponent } from './remesas.component';
import { RemesasDetalleComponent } from './remesas-detalle/remesas-detalle.component';
import { RemesasRoutingModule } from './remesas-routing.module';

import { DirectivesModule } from '../../../directives/directive.module';
import { ValidationModule } from '../../../validator/validation.module';
import { ValidationService } from '../../../validator/validation.service';
import { Ng2TablesModule } from '../../../ng2-tables/ng2-tables.module';

@NgModule({
	imports: [
		RemesasRoutingModule,
		HeaderModule,
	    BrowserModule,
	    BrowserAnimationsModule,
	    SimpleNotificationsModule.forRoot(),
	    FormsModule,
	    ReactiveFormsModule,
	    AnimateModule,
	    ValidationModule,
	    Ng2TablesModule,
	    DirectivesModule
	],
	declarations: [RemesasComponent,RemesasDetalleComponent],
	providers: [AuthGuard,ValidationService],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class RemesasModule {}