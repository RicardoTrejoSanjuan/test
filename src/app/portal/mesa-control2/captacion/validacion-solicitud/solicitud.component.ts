/*
 * @version 1.0 (10/10/2018)
 * @author ezuñiga
 * @description Muestra el detalle de la solicitud que se encuentra en mesa de control por validación.
 * @contributors Front-end team
 */

/* IMPORTACION GENERAL */
import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Notifications } from '../../../../classGeneric/notifications';
import { ClassGenerica } from './../../../../classGeneric/config';
import { MESA_CONTROL } from './../../shared/constants/constants-url';
import { Service } from '../../../../service/service';
import { RubroActivo, Activo, HistorialNombres, Fechas, HandlerModal, ObjHandler } from '../captacion-mesa-control';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SolicitudController } from './solicitudController';
import { PaginationFron } from '../../../../classGeneric/paginationFront';
import { VisorDocumentos } from '../../visor-documentos/visor-documentos.component';
import { RevisionSolicitudService } from '../revisionSolicitud.service';
import { CatalogosValidacionMC } from './catalogos-validacion-mc';

@Component({
    selector: 'mesa-control-solicitud',
    templateUrl: 'solicitud.component.html',
    styleUrls: ['../../mesa-control2.component.css']
})

export class MesaControlDosSolicitud extends ClassGenerica implements AfterViewInit {
    @ViewChild('visorUno') visor_uno: VisorDocumentos;
    @ViewChild('visorDos') visor_dos: VisorDocumentos;

    public solicitudController: SolicitudController;
    public dataBoton: object = {};
    public usuarioBasic: any = {};
    public listFormAll: object = {};
    public dataUser: object = {};
    public banderaForm: boolean = false;
    public banderaSelfie: boolean = false;
    public banderaPdf: boolean = false;
    public imagesPdf: Array<any>;
    public historialVisible: boolean;
    public galleryImg: Array<any>;
    public listImgAll: Array<any> = [];
    public clickable: boolean = true;
    public usuarioCompl: any = {};
    public objHandler: any = new ObjHandler();
    public documentos: any;
    public activo: any = new Activo();
    public rubrosCalificacion: any;
    public showPdfViewer: boolean;
    public arrayPdfToJson: any = [];
    public isfatca: boolean = false;
    public pdfObjectViewer: SafeHtml;
    public isRequestValidator: boolean;
    public motivoRechazo: any;
    public jsonRequest: any;
    public handlerModal: any = new HandlerModal();
    public cont: number = 0;
    public variable: any = [];
    public infoTab: any = {};
    public dataTab: object = {};
    public activaClick : string;
    public perfil: boolean;
    public origen: boolean;


    constructor(private router: Router, private service: Service, private notifications: Notifications, private revisionService: RevisionSolicitudService, private catalogos: CatalogosValidacionMC, private sanitizer: DomSanitizer, private changeDetector: ChangeDetectorRef) {
        super();
        this.solicitudController = new SolicitudController();
        this.dataBoton = {};
        this.usuarioBasic = super.getAttr('Usuario');
        this.listFormAll = this.solicitudController.getListForm();
        this.documentos = null;
        this.getRequestInitData();
        this.rubrosCalificacion = this.catalogos.initRubros();
        this.showPdfViewer = false;
        this.isRequestValidator = false;
        this.pdfObjectViewer = null;
        this.jsonRequest = null;
        this.motivoRechazo = [];
        this.imagesPdf = [];
        this.infoTab =super.getAttr('lastRequest');
        this.dataUser = this.usuarioBasic;
        this.dataTab = this.infoTab;
    }
    ngOnInit() {
        
        this.historialVisible = true;
        this.perfil = this.dataUser['analista'];
        this.origen = (this.dataTab["estado"] == 5) ? true : false;
        this.activaClick = (!this.origen)?"disabledClick":"";
    }
    uploadDataInit() {
        let listImg = this.solicitudController.generaImagenes(this.documentos);
        this.listFormAll = this.solicitudController.integraImagenes(listImg, this.listFormAll);
        this.imagesPdf = this.solicitudController.extraeImg(listImg);
        this.listImgAll = this.solicitudController.getImagesGallery(this.documentos);
        this.galleryImg = this.solicitudController.creaGallery(this.listImgAll, this.listFormAll["imagenes"]);
    }
    ngAfterViewInit() {

        this.displayLeftViewer(false);
        this.displayRightViewer(false);

        this.isRequestValidator = this.usuarioBasic.estatus === 0 && this.usuarioBasic.analista;

        this.changeDetector.detectChanges();
    }

    validaSelfie(banderaSelfieUpdate) {
        this.banderaSelfie = banderaSelfieUpdate;
        this.validaBoton();
    };
    validaImagenesPdf(imagesPdf) {
        let dataImgValid = this.solicitudController.validImg(imagesPdf, this.listFormAll["imagenes"]);
        this.banderaPdf = dataImgValid[0];
        this.listFormAll["imagenes"] = dataImgValid[1];
        this.galleryImg = this.solicitudController.creaGallery(this.listImgAll, this.listFormAll["imagenes"]);
        this.validaBoton();
    }
    validaForm(banderaBoton) {
        this.banderaForm = banderaBoton;
        this.validaBoton();
    }
    validaBoton() {
        this.dataBoton = this.solicitudController.configButton(this.banderaForm, this.banderaSelfie, this.banderaPdf);
    }
    private enviaValidacion(paramsEnvioValid) {

        this.solicitudController.saveAll(paramsEnvioValid.accion, this.listFormAll);
        //this.router.navigate(['./mesa-control2/captacion']);
    }
    changeImage(dataImg) {
        let updateRubro;
        this.imagesPdf = this.solicitudController.extraeImg(this.listFormAll["imagenes"], dataImg.id);
        updateRubro = this.solicitudController.obtieneRubro(dataImg, this.rubrosCalificacion);
        this.SetRubro(updateRubro);
    }
    updateListForm(listFormUpdate) {
        this.listFormAll = this.solicitudController.updteListAll(listFormUpdate, this.listFormAll);
    };

    // Obtención de datos generales de la solicitud
    private getRequestInitData(): void {
        super.loading(true);
        if (this.usuarioBasic !== null) {
            // Consulta de datos generales de la solicitud
            this.getData({ idSolicitud: this.usuarioBasic.folio }, MESA_CONTROL.solicitudRevision).subscribe((data: any) => {
                if (data.codE === 0) {
                    this.usuarioCompl = data.jsonResultado.shift();
                    this.getRequestExtraData();
                } else {
                    super.loading(false);
                    this.notifications.alert('Mesa Control', 'No se cuenta con informacion del usuario seleccionado');
                }
            });
        } else {
            super.loading(false);
            this.notifications.alert('Mesa Control', 'No se cuenta con informacion del usuario seleccionado');
        }
    }
    // Obtención de datos complementarios de la solicitud
    private getRequestExtraData(): void {

        let revision = this.revisionService.getNumerorevisionSolicitud();
        let esBandejaEsp = this.revisionService.getEsBandejaEspecial();
        let objRequest = { "cuenta": this.usuarioCompl.cuenta, "estatus": ((revision === 1 && !esBandejaEsp) ? "M" : "A") };
        console.log("consultadocs", objRequest);
        // Consulta de conjunto de rutas de documentos en formato pdf
        this.getData(objRequest, MESA_CONTROL.consultaDocumentosPdf).subscribe((data: any) => {

            if (data.codE === 0) {
                this.documentos = this.FilterArrayCap(data.jsonResultado);
                this.uploadDataInit();
                this.SetRubro(this.rubrosCalificacion[1]);
            } else {
                super.loading(false);
                this.notifications.error('Consulta documentos', data.codE + " - " + data.msgE);
            }
        });
    }
    // Funcion que asigna el contenido para todo el espacio de trabajo en lo que respecta a los visores
    private SetRubro(_rubro: any): void {
        this.objHandler.resumen = false;
        if (!this.invalid(_rubro.idDocumento)) {

            this.activo = _rubro;

            for (let item of this.rubrosCalificacion) {
                item.active = (item.idRubro === _rubro.idRubro);
            }

            this.setContentDataLeftViewer(_rubro);
            this.setContentDataRightViewer(_rubro);

        }
    }

    // Funcion que construye y asigna datos a el visor de datos del lado izquierdo
    private setContentDataLeftViewer(_rubro: any): void {

        if (!this.invalid(_rubro)) {

            try {

                let visorPdfActivo: boolean = this.showPdfViewer,
                    currentDocument: any = this.GetCurrentDocument(_rubro);
                this.showPdfViewer = false;

                if (!this.invalid(currentDocument)) {
                    super.loading(false);
                    if (_rubro.idDocumento === "1") {
                        setTimeout(() => {
                            currentDocument.rutasHttp = currentDocument.rutasHttp.reverse();
                            this.displayLeftViewer(!visorPdfActivo);
                            this.visor_uno.initVisor(currentDocument);
                            this.visor_uno.setConfig({ downloable: false, controlllers: true });
                        }, 100);
                    } else {
                        setTimeout(() => {
                            this.displayLeftViewer(!visorPdfActivo);
                            this.setNotFoundContentLeftViewer(_rubro.textoMenu);
                        }, 1000);

                    }
                } else {
                    setTimeout(() => {
                        this.displayLeftViewer(!visorPdfActivo);
                        this.setNotFoundContentLeftViewer(_rubro.textoMenu);
                    }, 1000);
                }
            } catch (error) {
                this.notifications.error('Ocurrio un fallo', error.message);
            }
        }
    }
    private displayLeftViewer(display) {
        if (!display) {
            this.visor_uno.show();
            this.visor_uno.reset();
            this.visor_uno.setConfig({ downloable: false, controlllers: false });
        }
    }
    private setNotFoundContentLeftViewer(nombreDoc) {
        this.visor_uno.setDisabled();
        this.visor_uno.setConfig({ downloable: false, controlllers: false });
        this.notifications.info('Documentos solicitud', 'No fue posible localizar el documento "' + nombreDoc + '"');
    }
    // Funcion que construye y asigna datos a el visor de datos del lado derecho
    private setContentDataRightViewer(_rubro: any): void {
        if (!this.invalid(_rubro)) {
            try {

                let visorActivo: boolean = (this.objHandler.vistaEnabled === 0);

                this.objHandler.vistaEnabled = 0;
                this.rubrosCalificacion
                this.documentos
                setTimeout(() => {
                    super.loading(false);
                    this.displayRightViewer(visorActivo);
                    let currentDocument: any = this.GetCurrentDocument({ idDocumento: "2" });
                    if (!this.invalid(currentDocument)) {
                        this.visor_dos.initVisor(currentDocument);
                        this.visor_dos.setConfig({ downloable: false, controlllers: true });
                    } else {
                        this.visor_dos.setDisabled();
                        this.visor_dos.setConfig({ downloable: false, controlllers: false });
                        this.notifications.info('Documentos solicitud', 'No fue posible localizar el comprobante de domicilio del cliente');
                        this.objHandler.vistaEnabled = _rubro.idRubro;
                    }

                }, 1000);

            } catch (error) {
                this.notifications.error('Ocurrio un fallo', error.message);
            }
        }
    }
    private displayRightViewer(display) {
        if (!display) {
            this.visor_dos.show();
            this.visor_dos.reset();
        }
    }
    //Metodo para regresar a la bandeja de las solicitudes
    public Regresar() {
        this.router.navigate(['./mesa-control2/captacion']);
    }
    // Funcion que filtra los documentos por medio de la parala "CAP" en su nombre
    private FilterArrayCap(_array: any): any {
        let arrayDocumentos: any = {};
        for (let item in _array) {
            if (_array.hasOwnProperty(item)) {
                let result: boolean = /^CAP/.test(item);
                if (result) {
                    arrayDocumentos[item] = _array[item];
                } else if (_array[item].idDocumento === "8-16") {
                    arrayDocumentos[item] = _array[item];
                }
            }
        }
        return arrayDocumentos;
    }
    //Recupera el motivo de rechazon con su comentario
    private getMotivosRechazo(_idMotivo: any, _comentario: string): any {
        let description: any = this.catalogos.getTitleRechazo(_idMotivo);
        description = this.invalid(description) ? 'Motivo de rechazo' : description;
        _comentario = this.invalid(_comentario) ? '' : ' - ' + _comentario;
        return description + '' + _comentario;
    }
    //Recupera el array de url del documento a revisar
    private GetCurrentDocument(_rubro: any): void {
        let arrDocs: any = this.documentos;
        for (let item in arrDocs) {
            if (arrDocs.hasOwnProperty(item)) {
                if (arrDocs[item].idDocumento === _rubro.idDocumento) {
                    return arrDocs[item];
                }
            }
        }
        return null;
    }
    //Metodo para obtener la informacion
    private getData = (_params: any, _url: string): Observable<Object> => {
        let observable: any = Observable.create(observer => {
            this.service.post(_params, _url, 3).subscribe(
                (data: any) => {
                    let response = JSON.parse(JSON.stringify(data));
                    observer.next(response);
                    observer.complete();
                },
                error => { observer.next(error); observer.complete(); }
                // () => { observer.next(null); observer.complete(); }
            );
        });
        return observable;
    }
    private ConsultarDocumentoVisor1(_params: any): void {
        this.clickable = false;
        this.service.getBase64({ url: _params.url }, MESA_CONTROL.getBase64Image, 3).subscribe((response: any) => {
            this.clickable = true;
            if (response.codE === 0) {
                this.visor_uno.updateImage(response.jsonResultado, _params.idDocumento, _params.page);
            } else {
                this.visor_uno.updateImage(null, _params.idDocumento, _params.page);
            }
        });
    }
    private ConsultarDocumentoVisor2(_params: any): void {
        this.clickable = false;
        this.service.getBase64({ url: _params.url }, MESA_CONTROL.getBase64Image, 3).subscribe((response: any) => {
            this.clickable = true;
            if (response.codE === 0) {
                this.visor_dos.updateImage(response.jsonResultado, _params.idDocumento, _params.page);
            } else {
                this.visor_dos.updateImage(null, _params.idDocumento, _params.page);
            }
        });
    }
    //Validacion de elementos
    private invalid(_item: any): boolean {
        return (_item === null || typeof (_item) === 'undefined' || _item === "" || _item === 'null');
    }
    ////
}
