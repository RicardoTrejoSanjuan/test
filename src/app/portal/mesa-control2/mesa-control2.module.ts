/*
 * @version 1.0 (04-07-2017)
 * @author lfgonzalezr
 * @description Modulo general para la mesa de control
 * @contributors Front-end team
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MESA_ROUTING } from './mesa-control2.routes';
import { HeaderModule } from '../../header/header.module';

/* Importacion de modulos para manejo de notificaiones */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { MesaControlDosMenu } from './shared/components/menu/menu.component';
import { MenuContainer } from './shared/components/menu-container/menu-container.component';

import { MesaControlDosCaptacion } from './captacion/captacion.module';
import { MesaControlDosAsesor } from './asesor/asesor.module';
import { SharedModule } from './shared/share-module.module';

@NgModule({
    imports: [
        BrowserModule,
        MESA_ROUTING,
        HeaderModule,
        BrowserAnimationsModule,
        SimpleNotificationsModule,
        FormsModule,
        ReactiveFormsModule ,
        //modulos de mesa de control
        MesaControlDosCaptacion,
        MesaControlDosAsesor,
        SharedModule

    ],
    declarations: [
        MesaControlDosMenu,
        MenuContainer
    ],
    providers: []
})

export class MesaControlDosModule {
    constructor() {
    }
}
