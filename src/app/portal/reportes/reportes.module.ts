import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderModule } from '../../header/header.module';
import { REPORTES_ROUTES } from './reportes.routes';

import { CreditoModule } from './credito/credito.module';
import { ReportesCaptacionModule } from './captacion/captacion.module';
import { ReportesMenu } from './menu/menu.component';

import { ColocacionModule } from './colocacion/colocacion.module';
import { PerfilamientoModule } from './perfilamiento/perfilamiento.module';
import { MonitoreoModule } from './monitoreo/monitoreo.module';
import { FormsModule}   from '@angular/forms';
import {ReportesProductoModule} from './producto/producto.module';
@NgModule({
  imports: [
    BrowserModule,
    HeaderModule,
    REPORTES_ROUTES,
    CreditoModule,
    ColocacionModule,
    ReportesCaptacionModule,
    ReportesProductoModule,
    PerfilamientoModule,
    MonitoreoModule,
    FormsModule
  ],
  declarations: [
    ReportesMenu
  ],
  providers: []
})
export class ReportesModule {}
