import { NgModule,CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { HeaderModule } from '../../header/header.module';
import { AnimateModule } from '../../animate/animate.module';
import { AuthGuard} from '../../classGeneric/config';

import { GraficaModule } from '../../graficas-highchart/graficas-highchart.module';

import { TarjetasRemesaComponent } from './tarjetas-remesa.component';
import { TarjetasDetalleComponent } from './tarjetas/tarjetas-detalle/tarjetas-detalle.component';
import { TarjetasRemesaRoutingModule } from './tarjetas-remesa-routing.module';

import { SolicitudesRemesaModule } from './solicitudes/solicitudes.module';
import { RemesasModule } from './remesas/remesas.module';
import { FoliosRemesaModule } from './folios/folios.module';
import { ResponsablesRemesaModule } from './responsables/responsables.module';
import { TarjetasModule } from './tarjetas/tarjetas.module';
import { SeguimientoRemesaModule } from './seguimiento/seguimiento.module';

import { MaterialAppModule } from '../../material/material.module';

@NgModule({
	imports: [
		HeaderModule,
	    BrowserModule,
	    BrowserAnimationsModule,
	    SimpleNotificationsModule.forRoot(),
	    FormsModule,
	    ReactiveFormsModule,
	    AnimateModule,
	    GraficaModule,
	    TarjetasRemesaRoutingModule,
	    SolicitudesRemesaModule,
	    RemesasModule,
	    FoliosRemesaModule,
	    ResponsablesRemesaModule,
	    TarjetasModule,
		SeguimientoRemesaModule,
		MaterialAppModule
	],
	declarations: [TarjetasRemesaComponent,TarjetasDetalleComponent],
	providers: [AuthGuard],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TarjetasRemesaModule {}