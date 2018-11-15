/*
 * @version 1.0 (09/10/2018)
 * @author rtrejo
 * @description Muestra las solicitudes que se encuentras en mesa de control (Pendientes por revision, Devueltas, Rechazadas y Liberadas)
 * @contributors Front-end team
 */
import { Injectable } from "@angular/core";
import { ServiceMCService } from './../../shared/services/serviceMC.service';
import { Service } from '../../../../service/service';
import { Notifications } from '../../../../classGeneric/notifications';
import { MESA_CONTROL } from '../../shared/constants/constants-url';
import { Document } from './../../shared/models/document';

@Injectable()
export class DocumentoController {

    private serviceMC: ServiceMCService;

    constructor(private service?: Service, private notifications?: Notifications) {
        this.serviceMC = new ServiceMCService(service);
    };

    public getComplementaryInfoUser(_parameter: Object): any {
        return this.serviceMC.callPost(_parameter, MESA_CONTROL.solicitudRevision, 3).then(result => {
            let jsonResultado = JSON.parse(JSON.stringify(result));
            console.log('1. ComplementaryInfo');
            console.log(jsonResultado);
            if (jsonResultado.codE === 0) {
                return jsonResultado.jsonResultado[0];
            } else {
                this.notifications.alert('Mesa Control', 'No se cuenta con informacion del usuario seleccionado');
                return 0;
            }
        });
    }

    public getInfoDocuments(_params: any): any {
        return this.serviceMC.callPost(_params, MESA_CONTROL.consultaStatusDocument, 3).then(result => {
            let jsonResultado = JSON.parse(JSON.stringify(result));
            console.log('2. InfoDocument');
            console.log(jsonResultado);
            if (jsonResultado.codE === 0) {
                if (jsonResultado.jsonResultado.documentos.length == 0) {
                    this.notifications.info('Mesa Control', 'Cliente no cuenta con referencias a documentos');
                    jsonResultado.jsonResultado.documentos = [];
                }
                return jsonResultado.jsonResultado;
            } else {
                this.notifications.info('Mesa Control', 'Cliente no cuenta con referencias a documentos');
                return 0;
            }
        });
    }

    public getDocuments(_params: any): any {
        return this.serviceMC.callPost(_params, MESA_CONTROL.consultaDocumentosPdf, 3).then(result => {
            let jsonResultado = JSON.parse(JSON.stringify(result));
            console.log('3. DetailDocuments');
            console.log(jsonResultado);
            if (jsonResultado.codE === 0) {
                return jsonResultado.jsonResultado;
            } else {
                this.notifications.info('Mesa Control', 'Cliente no cuenta con documentos');
                return 0;
            }
        });
    }

    public getDigitalizacion(_params: any): any {
        return this.serviceMC.callPost(_params, MESA_CONTROL.consultaDocumentosPdfDigitalizacion, 3).then(result => {
            let jsonResultado = JSON.parse(JSON.stringify(result));
            console.log('Digitalizacion del documento' + jsonResultado);
            if (jsonResultado.codE === 0) {
                return jsonResultado.jsonResultado;
            } else {
                this.notifications.info('Mesa Control', 'Cliente no cuenta con documento');
                return 0;
            }
        });
    }

    public documentList(){
        let _documentsList: Document[] = [];

        let menuDocument = new Document();
        menuDocument.idDocument= 'menu';
        menuDocument.name= 'Documentos';
        menuDocument.rutasHttp= [];
        menuDocument.status= 0;
        menuDocument.icon= 'documentos.png';
        menuDocument.claseFondo= 'verde-04-active';
        menuDocument.claseico= 'verde-04-ico';
        menuDocument.claseActive= 'verde-04-active';
        menuDocument.active= true;

        _documentsList.push(menuDocument);

        return _documentsList;
    }

    public getDocumentActive(_listDocuments: Document[]): Document {
        return _listDocuments.find((document: Document) => document.active == true);
    }

    public getDocumentById(_listDocuments: Document[], idDocument: string): any {
        return _listDocuments.find((document: Document) => document.idDocument == idDocument);
    }

    //Validacion de elementos
    public invalid(_item: any): boolean {
        return (_item === null || typeof (_item) === 'undefined' || _item === "" || _item === 'null');
    }

    // Actualiza status documento
    public updateStatusDocument(_params: any): any {
        return this.serviceMC.callPost(_params, MESA_CONTROL.cambioEstatusDocumento, 3).then(result => {
            let jsonResultado = JSON.parse(JSON.stringify(result));
            debugger;
            console.log('update status');
            if (jsonResultado.codE === 0) {
                // if (jsonResultado.jsonResultado.documentos.length == 0) {
                //     this.notifications.info('Mesa Control', 'Cliente no cuenta con referencias a documentos');
                //     jsonResultado.jsonResultado.documentos = [];
                // }
                return jsonResultado.jsonResultado;
            } else {
                // this.notifications.info('Mesa Control', 'Cliente no cuenta con referencias a documentos');
                return 0;
            }
        });
    }

    // Obtener firma
    public getSign(_params: any): any {
        return this.serviceMC.callPost(_params, MESA_CONTROL.getSign, 1).then(result => {
            let jsonResultado = JSON.parse(JSON.stringify(result));
            debugger;
            console.log('sign');
            if (jsonResultado.codE === 0) {
                // if (jsonResultado.jsonResultado.documentos.length == 0) {
                //     this.notifications.info('Mesa Control', 'Cliente no cuenta con referencias a documentos');
                //     jsonResultado.jsonResultado.documentos = [];
                // }
                return jsonResultado.jsonResultado;
            } else {
                // this.notifications.info('Mesa Control', 'Cliente no cuenta con referencias a documentos');
                return 0;
            }
        });
    }

    
    // private FilterArrayCap(_array: any): any {
    //     let arrayDocumentos: any = {};
    //     for (let item in _array) {
    //         if (_array.hasOwnProperty(item)) {
    //             let result: boolean = /^CAP/.test(item);
    //             if (result) {
    //                 arrayDocumentos[item] = _array[item];
    //             } else if (_array[item].idDocumento === "8-16") {
    //                 arrayDocumentos[item] = _array[item];
    //             }
    //         }
    //     }
    //     return arrayDocumentos;
    // }

}