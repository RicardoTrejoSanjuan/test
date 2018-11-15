/*
 * @version 1.0 (04-07-2017)
 * @author lfgonzalezr
 * @description Modulo general para la mesa de control
 * @contributors Front-end team
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MESA_ROUTING } from './mesa-control.routes';
import { HeaderModule } from '../../header/header.module';

/* Importacion de modulos para manejo de notificaiones */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';


import { MesaControlMenu } from './menu/menu.component';
import { MesaControlCaptacion } from './captacion/captacion.module';
import { MesaControlReportes } from './reportes/reportes.module';
import { MesaControlCredito } from './creditos/credito.module';



@NgModule({
    imports: [
        BrowserModule,
        MESA_ROUTING,
        HeaderModule,
        BrowserAnimationsModule,
        SimpleNotificationsModule,
        //modulos de mesa de control
        MesaControlCaptacion,
        MesaControlReportes,
        MesaControlCredito

    ],
    declarations: [
        MesaControlMenu
    ],
    providers: []
})

export class MesaControlModule {
    constructor() {
    }
}
