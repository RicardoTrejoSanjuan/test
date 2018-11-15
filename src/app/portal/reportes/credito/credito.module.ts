import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule}   from '@angular/forms';

/* Modulos de la aplicaion Portal */
import { HeaderModule} from '../../../header/header.module';
import { AuthGuard} from '../../../classGeneric/config';
import { CreditoRoutingModule } from './credito-routing.module';
import { SimpleNotificationsModule } from 'angular2-notifications';

/* Modulos para la generacion de graficas de highchart */
import { GraficaModule } from '../../../graficas-highchart/graficas-highchart.module';
/* Importacion de componentes */
//import { ReportesCredito } from './credito.component';
import { ReportesCreditoInstituciones } from './grafica-instituciones/grafica-instituciones.component';
import { ReportesEmpleados} from './grafica-empleados/empleados.component';
import { ReportesCreditoAsesor } from './grafica-asesor/grafica-asesor.component';
import { ReportesCreditoGeneral } from './grafica-credito-general/grafica-credito-general.component';
import { ReportesBalance } from './grafica-balance/balance.component';
import { ReportesDetalleCredito } from './grafica-detalle-credito/detalle-credito.component';
import { ReporteEmbudoSolicitudes } from './grafica-embudo-solicitudes/grafica-embudo-solicitudes.component';
import { ReporteColocacionCreditos } from './grafica-colocacion-creditos/grafica-colocacion-creditos.component';
import { MonitoreoCreditoComponent } from './monitoreo-credito/monitoreo-credito.component';
import { ReporteColocacionGeneral } from './grafica-colocacion/grafica-colocacion.component';

import { AnimateModule } from '../../../animate/animate.module';

import { MaterialAppModule } from '../../../material/material.module';

@NgModule({
  imports: [
    CreditoRoutingModule,
    HeaderModule,
    BrowserModule,
    FormsModule,
    GraficaModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    AnimateModule,
    MaterialAppModule
  ],
  declarations: [
    ReportesCreditoGeneral,
    ReportesCreditoInstituciones,
    ReportesEmpleados,
    ReportesCreditoAsesor,
    ReportesBalance,
    ReportesDetalleCredito,
    ReporteEmbudoSolicitudes,
    ReporteColocacionCreditos,
    MonitoreoCreditoComponent,
    ReporteColocacionGeneral
  ],
  providers: [AuthGuard
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class CreditoModule{}
