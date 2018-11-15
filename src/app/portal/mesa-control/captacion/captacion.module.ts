/*
 * @version 1.0 (04-07-2017)
 * @author lfgonzalezr
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
import { MesaControlBandejas } from './bandejas/bandejas.component';
import { MesaControlSolicitudes } from './solicitudes/solicitudes.component';
import { ValidacionSolicitudMC } from './validacion-solicitud/validacion.component';
import { AvatarModule } from '../avatar-usuario/avatar.module';
//import { MesaControlAvatarUsuario } from '../avatar-usuario/avatar.component';

import { MaterialAppModule } from '../../../material/material.module';

//Catalogos de mesa de control
import { CatalogosMC } from '../../../classGeneric/constants-mesa-control';
import { CatalogosValidacionMC } from './validacion-solicitud/catalogos-validacion-mc';
//Importacion de modulo para manejo de forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Importacion visor de documentos
import { VisorDocumentosModule } from '../visor-documentos/visor-documentos.module';

import { RevisionSolicitudService } from '../captacion/revisionSolicitud.service';

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
        VisorDocumentosModule,
        AvatarModule,
        MaterialAppModule
    ],
    declarations: [
        MesaControlBandejas,
        MesaControlSolicitudes,
        ValidacionSolicitudMC,
    ],
    providers: [
        CatalogosMC,
        CatalogosValidacionMC,
        RevisionSolicitudService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class MesaControlCaptacion {
}
