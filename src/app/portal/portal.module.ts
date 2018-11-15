// Importaciones generales
import { NgModule }      from '@angular/core';
import { SeguridadModule }     from './seguridad/seguridad.module';


import { TarjetasRemesaModule } from './tarjetas-remesas/tarjetas-remesa.module';

// // Importacion de modulo MESA DE CONTROL
import { MesaControlModule } from './mesa-control/mesa-control.module';

import { MesaControlDosModule } from './mesa-control2/mesa-control2.module';

// //Importacion del modulo de reportes
import { ReportesModule } from './reportes/reportes.module';

import { InfiniteDatosModule } from './infinite/infinite-datos.module';

import { MantenimientoModule } from './mantenimiento/mantenimiento.module';

import { MantenimientoInternosModule } from './mantenimiento-internos/mantenimientos-internos.module';

import { BeneficiosModule } from './beneficios/beneficios.module';
// import { DepositosReferenciadoModule } from './depositos/depositos.module';
// import {DomiciliacionPagosModule} from './domiciliacion-pagos/domiciliacion-pagos.module';



@NgModule({
  imports: [
    //SeguridadModule,
    MesaControlModule, //Modulo de MESA DE CONTROL
    MesaControlDosModule,
    ReportesModule, //Modulo de REPORTES
    InfiniteDatosModule,
    MantenimientoModule,
    MantenimientoInternosModule,
    BeneficiosModule,
    // DepositosReferenciadoModule,
    TarjetasRemesaModule,
    // DomiciliacionPagosModule,
  ],declarations: [
  ]
})

export class PortalModule { }
