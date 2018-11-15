import { NgModule,CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { HeaderModule } from '../../../header/header.module';
import { AnimateModule } from '../../../animate/animate.module';
import { AuthGuard} from '../../../classGeneric/config';

import { FoliosRemesaComponent } from './folios.component';
import { FoliosDetalleComponent } from './folios-detalle/folios-detalle.component';
import { FoliosRemesaRoutingModule } from './folios-routing.module';

import { DirectivesModule } from '../../../directives/directive.module';
import { ValidationModule } from '../../../validator/validation.module';
import { ValidationService } from '../../../validator/validation.service';
import { Ng2TablesModule } from '../../../ng2-tables/ng2-tables.module';

@NgModule({
	imports: [
		FoliosRemesaRoutingModule,
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
	declarations: [FoliosRemesaComponent,FoliosDetalleComponent],
	providers: [AuthGuard,ValidationService],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class FoliosRemesaModule {}