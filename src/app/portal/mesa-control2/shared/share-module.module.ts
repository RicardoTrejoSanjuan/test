/*
 * @version 1.0 (09/10/2018)
 * @author rtrejo
 * @description Permite compartir componentes entre modulos
 * @contributors Front-end team
 */
import { Return } from './components/return/return.component';
import { WorkQueue } from './components/workqueue/workqueue.component';
import { Tabs } from './components/tab/tab.component';
import { Formulario } from './components/formulario/formulario.component';
import { AvatarUsuario } from './components/avatar/avatar.component';
import { ListDocument } from './components/list-document/list-document.component';
import { Historial } from './components/historial/historial.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialAppModule } from '../../../material/material.module';

import { ServiceMCService } from './services/serviceMC.service';
import { FilterPipe } from './pipe/filterDocument.pipe';




@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialAppModule

    ],
    declarations: [
        Return,
        WorkQueue,
        Tabs,
        Formulario,
        AvatarUsuario,
        ListDocument,
        Historial,
        FilterPipe
    ],
    providers: [
        ServiceMCService
    ],
    exports: [
        Return,
        WorkQueue,
        Tabs,
        Formulario,
        AvatarUsuario,
        ListDocument,
        Historial,
        FilterPipe
    ]
})

export class SharedModule {
    constructor() {
    }
}
