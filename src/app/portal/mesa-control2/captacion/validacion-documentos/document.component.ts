/*
 * @version 1.0 (09/22/2018)
 * @author rtrejo
 * @description Muestra los documentos correspondientes o un mensaje si el documento no existiera.
 * @contributors Front-end team
 */

/* IMPORTACION GENERAL */
import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ClassGenerica } from './../../../../classGeneric/config';
import { DocumentoController } from './documentController';

import { Employee } from '../../shared/models/employee';
import { CatalogosMC } from './../../shared/constants/constants-mesa-control';
import { Document } from '../../shared/models/document';
import { Notifications } from '../../../../classGeneric/notifications';
import { __await } from 'tslib';
import { FilterPipe } from './../../shared/pipe/filterDocument.pipe';

@Component({
    selector: 'mesa-control-document',
    templateUrl: 'document.component.html',
    styleUrls: ['../../mesa-control2.component.css']
})

export class MesaControlDosDocumento extends ClassGenerica {

    public pdfObjectViewer: SafeHtml;
    public arrayPdfToJson: any = [];
    public empleado: Employee;
    public complementaryUser: any = {};
    public currentlyDocument: Document = new Document();
    public listDocuments: Document[];

    public infoDocuments: any = {};

    constructor(private controller: DocumentoController, private catalogos?: CatalogosMC, private notifications?: Notifications, private sanitizer?: DomSanitizer) {
        super();
        this.pdfObjectViewer = null;
        this.listDocuments = this.controller.documentList();
        this.currentlyDocument = this.controller.getDocumentActive(this.listDocuments);
        this.empleado = super.getAttr('Usuario');
        this.getComplementaryInfoUser();
    }

    // Obtener datos complementarios del usuario 
    private async getComplementaryInfoUser() {
        let parameterRequest = { idSolicitud: this.empleado.folio };
        super.loading(true);
        this.complementaryUser = await this.controller.getComplementaryInfoUser(parameterRequest);
        super.loading(false);

        this.getInfoDocuments();
    }

    // Obtenemos el detalle de los documentos
    private async getInfoDocuments() {
        let parameterRequest = { 'idSolicitud': 160 };//this.empleado.folio }; 160
        super.loading(true);
        this.infoDocuments = await this.controller.getInfoDocuments(parameterRequest);
        super.loading(false);

        if (this.infoDocuments !== 0) {
            this.getDocuments();
        }
    }

    // Obtiene las rutas de los documentos
    private async getDocuments() {
        let parameterRequest = { 'cuenta': this.complementaryUser.cuenta };
        super.loading(true);
        let jsonDocuments = await this.controller.getDocuments(parameterRequest);
        super.loading(false);

        this.listDocuments = this.currentlyDocument.setArrayDocument(this.listDocuments, jsonDocuments, this.infoDocuments);
        this.currentlyDocument = this.controller.getDocumentActive(this.listDocuments);
    }

    private openDocument(_document: Document): void {
        this.currentlyDocument = this.controller.getDocumentById(this.listDocuments, _document.idDocument)
    }

    private setCurrentlyDocument(_document: any): void {
        this.currentlyDocument = _document;
        this.setPDFToViewer(this.currentlyDocument);
    }

    private setPDFToViewer(_document: any): void {
        if (!this.controller.invalid(_document)) {
            try {
                console.log('currentDocument');
                console.log(this.currentlyDocument);
                if (!this.controller.invalid(this.currentlyDocument)) {
                    console.log('### URLS ORIGINALES EN ARREGLO DE RUTAS ### ', this.currentlyDocument.rutasHttp);
                    // if (!this.isfatca) {
                    let patternUrlPdf = /([a-zA-Z0-9_/\.\-])+(.pdf)$/i;
                    let arrPdfFiltered = this.currentlyDocument.rutasHttp.filter(function (urlDoc) { return patternUrlPdf.test(urlDoc); });

                    if (arrPdfFiltered.length > 0) {
                        this.urlpdftobase64(arrPdfFiltered.slice(-1));
                    }
                }
            } catch (error) {
                this.notifications.error('Ocurrio un fallo', error.message);
            }
        }
    }

    private async urlpdftobase64(data) {
        console.log('### ULTIMA URL EN ARREGLO DE RUTAS ### ', data);
        if (data !== null && (Array.isArray(data) && data.length > 0)) {
            let urlpdf = data[0];

            super.loading(true);

            // Comprueba si ya existe el documento cargado
            let geturlpdftojson = this.arrayPdfToJson.filter((element) => {
                return element.urlpdf === urlpdf;
            });

            // Si el documento no existe se genera el base64
            if (geturlpdftojson.length === 0) {

                let jsonDocuments = await this.controller.getDigitalizacion({ "urlDigitalizacion": urlpdf });
                super.loading(false);
                
                if (jsonDocuments != 0) {
                    this.arrayPdfToJson.push({
                        "urlpdf": urlpdf,
                        "jsonPdf": jsonDocuments,
                    });
                    this.pdfObjectViewer = !this.controller.invalid(jsonDocuments) ? this.sanitizer.bypassSecurityTrustHtml("<iframe src='data:application/pdf;base64, " + jsonDocuments + "' width='100%' height='100%'> </iframe>") : null;
                }
            } else {
                this.pdfObjectViewer = !this.controller.invalid(geturlpdftojson[0]) ? this.sanitizer.bypassSecurityTrustHtml("<iframe src='data:application/pdf;base64, " + geturlpdftojson[0].jsonPdf + " ' width='100%' height='100%'> </iframe>") : null;
                super.loading(false);
            }
        }
    }

    private async documentationGenerator(_document: Document) {
        debugger;
        let parameterUpdateStatus = {
            idExp: parseInt(this.complementaryUser.idExpediente),
            StatusDoc: 1  // Obtener el status para elcambio de status
        };

        try {
            super.loading(true);
            let resultUpdate = await this.controller.updateStatusDocument(parameterUpdateStatus);

            if (resultUpdate) {
                let parameterBuildDocument = {
                    idEmpleado: parseInt(this.complementaryUser.idCliente)
                };

                let resultBuild = await this.controller.updateStatusDocument(parameterBuildDocument);
                /**
                 * operaciónes
                 */
            }
        } catch (error) {
            this.notifications.error('Ocurrio un fallo', error.message);
        } finally {
            super.loading(false);
        }


        // let parameterRequest = { idEmpleado: parseInt(this.complementaryUser.idCliente) };
        // super.loading(true);
        // this.complementaryUser = await this.controller.getSign(parameterRequest);
        // super.loading(false);


        // console.log(this.complementaryUser);
        // console.log(_document);
        // let request = {
        //     idBig: this.complementaryUser.idCliente,
        //     tipoFirma: ($rootScope.validacionFirma)?1: 2,
        //     firma: ($rootScope.validacionFirma)?imagenBase64Firma: ""
        // }
    }
}