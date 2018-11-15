/*
 * @version 1.0 (07-06-2017)
 * @author lfgonzalezr
 * @description Modulo para la validacion de los documentos de credito
 * @contributors Front-end team
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
/* Importacion de modulos y componentes del portal */
import { AnimateModule } from '../../../animate/animate.module';
import { HeaderModule } from '../../../header/header.module';
import { Ng2TablesModule } from '../../../ng2-tables/ng2-tables.module';
/* Importación del archivo de rutas para a validacion de los documentos de credito de mesa de control */
import { MESA_CREDITO } from './credito.routes';
/* Importacion de componentes de credito de mesa de control */
import { MesaControlBusquedaCreditos } from './busqueda/busqueda.component';
import { MesaControlDocumentosCredito } from './documentos-credito/documentos.component';
//Catalogos de mesa de control
import { VisorDocumentosModule } from '../visor-documentos/visor-documentos.module';
import { CatalogosMC } from '../../../classGeneric/constants-mesa-control';
import { AvatarModule } from '../avatar-usuario/avatar.module';
import { MaterialAppModule } from '../../../material/material.module';


@NgModule({
    imports: [
        BrowserModule,
        HeaderModule,
        BrowserAnimationsModule,
        SimpleNotificationsModule,
        AnimateModule,
        MESA_CREDITO,
        FormsModule,
        ReactiveFormsModule,
        VisorDocumentosModule,
        Ng2TablesModule,
        AvatarModule,
        MaterialAppModule
    ],
    declarations: [
        MesaControlBusquedaCreditos,
        MesaControlDocumentosCredito
    ],
    providers: [
        CatalogosMC
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
    
})
export class MesaControlCredito { }
