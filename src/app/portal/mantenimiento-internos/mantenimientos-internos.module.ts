import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderModule } from '../../header/header.module';

import { MantenimientoInternoRoutingModule } from './mantenimientos-internos.routes';
import { SeguridadIpsModule } from './seguridad/seguridad.module';
import { ConfiguracionMIModule } from './configuracion/configuracion.module';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { MantenimientosInternosMenu } from './menu/menu.component';



import { EmpleadosModules } from './empleados/empleados.module';
// import { MesaControlCredito } from './creditos/credito.module';



@NgModule({
    imports: [
        BrowserModule,
        HeaderModule,
        BrowserAnimationsModule,
        SimpleNotificationsModule,
        MantenimientoInternoRoutingModule,
        EmpleadosModules,
        SeguridadIpsModule,
        ConfiguracionMIModule
       
        // MesaControlCredito

    ],
    declarations: [
        MantenimientosInternosMenu
    ],
    providers: []
})

export class MantenimientoInternosModule {}
