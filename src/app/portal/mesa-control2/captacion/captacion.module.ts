/*
 * @version 1.0 (09/10/2018)
 * @author rtrejo
 * @description Modulo para la calificacion de las solicitudes de mesa de control
 * @contributors Front-end team
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderModule } from '../../../header/header.module';
/* Importacion de modulos para manejo de notificaiones */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AnimateModule } from '../../../animate/animate.module';
/* Importación de las rutas de captacion de mesa de control */
import { MESA_CAPTACION } from './captacion.routes';
/* Importación de los componentes de  captacion de mesa de control */
import { MesaControlDosBandejas } from './bandejas/bandejas.component';

import { MaterialAppModule } from '../../../material/material.module';
import { SharedModule } from './../shared/share-module.module';
/*Validación Solicitud*/
import { MesaControlDosSolicitud } from './validacion-solicitud/solicitud.component';
import { MesaControlDosDocumento } from './validacion-documentos/document.component';
import { validaImagenesPdf } from './validacion-solicitud/validacion-imagenPdf/imagenPdf.component';

//Catalogos de mesa de control
import { CatalogosMC } from './../shared/constants/constants-mesa-control';
import { CatalogosValidacionMC } from './validacion-solicitud/catalogos-validacion-mc';
//Importacion de modulo para manejo de forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RevisionSolicitudService } from '../captacion/revisionSolicitud.service';
import { BandejaController } from './bandejas/bandejasController';
import { DocumentoController } from './validacion-documentos/documentController';
import { VisorDocumentosModule } from '../visor-documentos/visor-documentos.module';


@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SimpleNotificationsModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        AnimateModule,
        MESA_CAPTACION,
        HeaderModule,
        MaterialAppModule,
        SharedModule,
        VisorDocumentosModule
    ],
    declarations: [
        MesaControlDosBandejas,
        MesaControlDosSolicitud,
        MesaControlDosDocumento,
        validaImagenesPdf
    ],
    providers: [
        CatalogosMC,
        RevisionSolicitudService,
        BandejaController,
        DocumentoController,
        CatalogosValidacionMC
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class MesaControlDosCaptacion {
}
