/*
 * @version 1.0 (01-06-2017)
 * @author lfgonzalezr
 * @description Componente utilizado para mostrar y realizar la calificación de los rubros de las solicitudes
 * @contributors Front-end team
 */
import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Notifications } from '../../../../classGeneric/notifications';
import { ClassGenerica } from '../../../../classGeneric/config';
import { Service } from '../../../../service/service';
import { MESA_CONTROL } from '../../constants-url';
import { VisorDocumentos } from '../../visor-documentos/visor-documentos.component';
import { MesaControlAvatarUsuario } from '../../avatar-usuario/avatar.component';
import { RubroActivo, Activo, HistorialNombres, Fechas, HandlerModal, ObjHandler } from '../captacion-mesa-control';

import { RevisionSolicitudService } from '../revisionSolicitud.service';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CatalogosValidacionMC } from './catalogos-validacion-mc';

@Component({
    selector: 'validacion-solicitud-mc',
    templateUrl: 'validacion.component.html',
    styleUrls: ['../../mesa-control.component.css']
})

export class ValidacionSolicitudMC extends ClassGenerica implements AfterViewInit {

    @ViewChild('visorUno') visor_uno: VisorDocumentos;
    @ViewChild('visorDos') visor_dos: VisorDocumentos;
    @ViewChild('avatarUsuario') avatar: MesaControlAvatarUsuario;

    public usuarioBasic: any = {};
    public usuarioCompl: any = {};
    public rubrosCalificacion: any;
    public activo: any = new Activo();
    public objHandler: any = new ObjHandler();
    public documentos: any;
    public historialRevisiones: any;
    public RubroEnRevision = new RubroActivo(null, false);
    public HistorialNombres: any;
    public Vigencias: any;
    public formRechazos: any;
    public formFinal: any;
    public motivoRechazo: any;
    public jsonRequest: any;
    public handlerModal: any = new HandlerModal();
    public clickable: boolean = true;

    public isRequestValidator: boolean;
    public pdfObjectViewer: SafeHtml;
    public showPdfViewer: boolean;

    public cont: number = 0;
    public isfatca: boolean = false;
    public newRubroDoc: any = [];
    public arrayPdfToJson: any = [];
    public variable: any = [];

    constructor(private service: Service, private catalogos: CatalogosValidacionMC, private router: Router, private notifications: Notifications, private formBuilder: FormBuilder, private sanitizer: DomSanitizer, private changeDetector: ChangeDetectorRef, private revisionService: RevisionSolicitudService) {

        super();


        this.pdfObjectViewer = null;
        this.showPdfViewer = false;
        this.isRequestValidator = false;
        this.documentos = null;
        this.historialRevisiones = null;
        this.jsonRequest = null;
        this.motivoRechazo = [];
        this.HistorialNombres = [];
        this.Vigencias = { comprobante: null, identificacion: null };
        this.rubrosCalificacion = this.catalogos.initRubros();
        this.formRechazos = new FormGroup({
            idRechazo: new FormControl(null),
            comentario: new FormControl(null)
        });
        this.formFinal = new FormGroup({ observaciones: new FormControl(null) });

        this.usuarioBasic = super.getAttr('Usuario');

        this.getRequestInitData();
    }
    // Funcion que se ejecuta al terminar la carga del DOM
    ngAfterViewInit() {
        console.log("Datos usuario iniciales: ", this.usuarioBasic);

        this.displayLeftViewer(false);
        this.displayRightViewer(false);
        // this.visor_uno.setConfig({ downloable: false, controlllers: false });
        
        this.isRequestValidator = this.usuarioBasic.estatus === 0 && this.usuarioBasic.analista;

        this.changeDetector.detectChanges();
    }
    /*Funcion que construye una cadena HTML no vulnerable a traves de un SecurityTrust, 
    en la cual se encuentra una etiqueta <embed> que contiene la ruta del PDF*/
    /*  private setPdfDocument(url: string): void {
         console.log("URL DOCUMENTO PDF: ", url);
         this.pdfObjectViewer = !this.invalid(url) ? this.sanitizer.bypassSecurityTrustHtml("<embed src='" + url + "' type='application/pdf' width='100%' height='100%'>") : null;
     } */
    /*Funcion que recorre cada uno de los rubros en busca de uno en especifico, 
    si cumple la condicion se modifica el attributo que define si se muestra o no*/
    private setDisplayDocument(_idDoc: any, _display: any): void {
        for (let item of this.rubrosCalificacion) {
            if (item.idDocumento === _idDoc) {
                item.hidden = !_display;
            }
        }
    }
    /*Funcion que verifica si los documentos opcionales vienen en el resultado de la consulta,
    si uno de estos documentos si llega se muestra sino se oculta el rubro en el menu*/
    private verifyOptionalDocuments(data: any): void {
        if (data.codE === 0) {

            this.documentos = this.FilterArrayCap(data.jsonResultado);

            // Si el anexo de comisiones llega en la consulta se muestra en el menu
            if (this.GetCurrentDocument({ idDocumento: "8-30" }) !== null) {
                // this.ActualizarEstatusDoc("8-30",1);
                this.setDisplayDocument("8-30", true);
                this.objHandler.docAnexo = true;
            }

            // Si no existe el documento en la consulta no se muestra el rubro en el menu
            if (this.GetCurrentDocument({ idDocumento: "8-16" }) === null) {
                this.setDisplayDocument("8-16", false);
                this.objHandler.docBuro = false;
            }

            // Si no existe el documento en la consulta no se muestra el rubro en el menu
            if (this.GetCurrentDocument({ idDocumento: "8-101" }) === null) {
                this.setDisplayDocument("8-101", false);
                this.objHandler.docFATCA = false;
            }

        } else {
            this.notifications.error('Consulta documentos', data.codE + " - " + data.msgE);
        }
    }
    // Obtención de datos generales de la solicitud
    private getRequestInitData(): void {
        super.loading(true);
        if (this.usuarioBasic !== null) {
            // Consulta de datos generales de la solicitud
            this.getData({ idSolicitud: this.usuarioBasic.folio }, MESA_CONTROL.solicitudRevision).subscribe((data: any) => {
                if (data.codE === 0) {
                    this.usuarioCompl = data.jsonResultado.shift();
                    this.Vigencias.comprobante = (new Fechas(this.usuarioCompl.vigenciaComprobanteDomicilio)).getDate();
                    this.Vigencias.identificacion = (new Fechas(this.usuarioCompl.vigenciaIdentificacion)).getDate();
                    console.log("Datos usuario complementarios: ", this.usuarioCompl);
                    // Consulta de los tipos de identificacion y comprobante de domicilio
                    this.getData({ idBig: this.usuarioCompl.idCliente }, MESA_CONTROL.getTipoIdentificacion).subscribe((data: any) => {
                        console.log("Consulta de tipo de identificacion y comprobante:");
                        this.objHandler.setTipoIdentificacion(data.jsonResultado);
                        // Consulta del historial de modificacion en el nombre del cliente
                        this.getData({ idEmpleado: this.usuarioCompl.idCliente }, MESA_CONTROL.historialNombres).subscribe((data: any) => {
                            this.HistorialNombres = (new HistorialNombres(data.jsonResultado, this.usuarioCompl)).get();
                            console.log("Consulta de historial de nombres: ", this.HistorialNombres);
                            this.getRequestExtraData();
                        });
                    });
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
        // Consulta de historial de revisiones anteriores de la solicitud 
        this.getData({ idSolicitud: this.usuarioCompl.idSolicitud }, MESA_CONTROL.revisionesPrevias).subscribe((data: any) => {
            this.HistorialRevisiones(data);
            /*this.objHandler.setAnexoComision(data.msgE);
            console.log("Existe anexo comision?: ",this.objHandler.docAnexo);*/
            let revision = this.revisionService.getNumerorevisionSolicitud();
            let esBandejaEsp = this.revisionService.getEsBandejaEspecial();

            console.log(revision);
            console.log(esBandejaEsp);
            // let objRequest = { "cuenta": this.usuarioCompl.cuenta, "estatus": "M"};
            let objRequest = { "cuenta": this.usuarioCompl.cuenta, "estatus": ((revision === 1 && !esBandejaEsp) ? "M" : "A") };
            // Consulta de conjunto de rutas de documentos en formato pdf
            this.getData(objRequest, MESA_CONTROL.consultaDocumentosPdf).subscribe((data: any) => {
                console.log("Consulta de documentos de la solicitud:", objRequest, data);
                this.verifyOptionalDocuments(data);
                // Consulta de fotografia en b64 del cliente
                this.getData({ pais: this.usuarioBasic.pais, folio: this.usuarioBasic.folioCteUn, canal: this.usuarioBasic.canal, sucursal: this.usuarioBasic.sucursal }, MESA_CONTROL.recuperaFoto).subscribe((data: any) => {
                    console.log("Consulta de fotografia del usuario: ", data);
                    super.loading(false);
                    if (data.codE === 0) {
                        this.avatar.updateFoto(data.jsonResultado.contenido);
                    } else {
                        this.notifications.info('Mesa Control', 'Cliente no cuenta con foto');
                    }
                    this.SetRubro(this.rubrosCalificacion[1]);
                    // console.log(this.rubrosCalificacion);
                });
            });
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
            //Ajustar y mostrar todos los documentos
            this.RubroEnRevision.comentario = _rubro.idStatusRevision === 10 ? this.getMotivosRechazo(_rubro.idRechazo, _rubro.comentario) : null;
            this.RubroEnRevision.visible = _rubro.idStatusRevision === 10 ? true : false;

            this.setContentDataLeftViewer(_rubro);
            this.setContentDataRightViewer(_rubro);

        } else {
            this.navigateNextDoc(_rubro);
        }
    }

    // Funcion que construye y asigna datos a el visor de datos del lado izquierdo
    private setContentDataLeftViewer(_rubro: any): void {

        if (!this.invalid(_rubro)) {

            try {

                let visorPdfActivo: boolean = this.showPdfViewer;

                console.log("Es visor PDF izquierdo? ", visorPdfActivo);

                this.showPdfViewer = false;

                let currentDocument: any = this.GetCurrentDocument(_rubro);

                if (!this.invalid(currentDocument)) {
                    if (_rubro.idDocumento === "1" || _rubro.idDocumento === "2") {
                        setTimeout(() => {
                            currentDocument.rutasHttp = currentDocument.rutasHttp.reverse();
                            this.displayLeftViewer(!visorPdfActivo);
                            this.visor_uno.initVisor(currentDocument);
                            this.visor_uno.setConfig({ downloable: false, controlllers: true });
                        }, 100);
                    } else {
                        console.log("### URLS ORIGINALES EN ARREGLO DE RUTAS ### ", currentDocument.rutasHttp);
                        if (!this.isfatca) {
                            let patternUrlPdf = /([a-zA-Z0-9_/\.\-])+(.pdf)$/i;
                            let arrPdfFiltered = currentDocument.rutasHttp.filter(function(urlDoc) { return patternUrlPdf.test(urlDoc); });

                            if (arrPdfFiltered.length > 0) {
                                this.visor_uno.hide();
                                this.showPdfViewer = true;
                                this.urlpdftobase64(arrPdfFiltered.slice(-1));
                            } else {
                                setTimeout(() => {
                                    this.displayLeftViewer(!visorPdfActivo);
                                    this.setNotFoundContentLeftViewer(_rubro.textoMenu);
                                }, 1000);
                            }

                        }
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

    private urlpdftobase64(data) {

        console.log("### ULTIMA URL EN ARREGLO DE RUTAS ### ", data);

        if (data !== null && (Array.isArray(data) && data.length > 0)) {

            let urlto = data[0];

            super.loading(true);

            // Comprueba si ya existe el documento cargado
            let geturlpdftojson = this.arrayPdfToJson.filter((element) => {
                return element.urlpdf === urlto;
            });

            // Si el documento no existe se genera el base64
            if (geturlpdftojson.length === 0) {
                this.getData({ "urlDigitalizacion": urlto }, '/mesacontrol/digitalizacion/base64/pdf/consulta/temp').subscribe((data: any) => {

                    super.loading(false);

                    console.log("Respuesta de el servicio: ", data);

                    // let responseB64 = "data:application/pdf;base64, " + data.jsonResultado;

                    if(data.codE === 0) {

                        this.arrayPdfToJson.push({
                            "urlpdf": urlto,
                            "jsonPdf": data.jsonResultado,
                        });

                        this.pdfObjectViewer = !this.invalid(data) ? this.sanitizer.bypassSecurityTrustHtml("<iframe src='data:application/pdf;base64, " + data.jsonResultado + "' width='100%' height='100%'> </iframe>") : null;

                    } else {
                        // responseB64 = "data:image/svg+xml;utf8;base64, " + B64_DOC_NOT_FOUND;

                        setTimeout(() => {
                            this.displayLeftViewer(false);
                            this.setNotFoundContentLeftViewer("");
                        }, 1000);
                    }
                    
                });
            } else {
                console.log(geturlpdftojson);

                this.pdfObjectViewer = !this.invalid(geturlpdftojson[0]) ? this.sanitizer.bypassSecurityTrustHtml("<iframe src='data:application/pdf;base64, " + geturlpdftojson[0].jsonPdf + " ' width='100%' height='100%'> </iframe>") : null;
                super.loading(false);
            }
        }

    }

    // Funcion que construye y asigna datos a el visor de datos del lado derecho
    private setContentDataRightViewer(_rubro: any): void {
        if (!this.invalid(_rubro)) {
            try {

                let visorActivo: boolean = (this.objHandler.vistaEnabled === 0);

                console.log("Es visor derecho? ", visorActivo);

                this.objHandler.vistaEnabled = 0;

                if (_rubro.idRubro === 1) {
                    setTimeout(() => {
                        this.displayRightViewer(visorActivo);
                        this.visor_dos.updateImage(this.avatar.getfoto());
                        this.visor_dos.setConfig({ downloable: false, controlllers: false });
                    }, 1000);
                } else if (_rubro.idRubro >= 7) {
                    setTimeout(() => {
                        let currentDocument: any = this.GetCurrentDocument({ idDocumento: "1" });

                        this.displayRightViewer(visorActivo);

                        if (!this.invalid(currentDocument)) {
                            this.visor_dos.initVisor(currentDocument);
                            this.visor_dos.setConfig({ downloable: false, controlllers: true });
                        } else {
                            this.visor_dos.setDisabled();
                            this.visor_dos.setConfig({ downloable: false, controlllers: false });
                            this.notifications.info('Documentos solicitud', 'No fue posible localizar la identificación del cliente');
                        }
                    }, 1000);
                } else {
                    this.objHandler.vistaEnabled = _rubro.idRubro;
                }
            } catch (error) {
                this.notifications.error('Ocurrio un fallo', error.message);
            }
        }
    }
    private displayRightViewer(display) {
        if (!display) {
            this.visor_dos.show();
            this.visor_dos.reset();
            // this.visor_dos.setConfig({ downloable: false, controlllers: false });     
        }
    }
    // Funcion que redirecciona al siguiente rubro a validar en mesa de control
    private navigateNextDoc(_rubrop: any): void {
        let idNextRubro: any = this.getIdNextDoc(_rubrop.idRubro);
        this.rubrosCalificacion.filter((_item: any) => {
            if (_item.idRubro === idNextRubro) {
                // if (!this.isfatca) {
                this.SetRubro(_item);
                // }
            }
        });
    }
    //Metodo para regresar a la bandeja de las solicitudes
    public Regresar() {
        this.router.navigate(['./mesa-control/captacion']);
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
    //Se guarda la informacion del historico de revisiones de la solicitud
    private HistorialRevisiones(data: any): void {
        //console.log(data);
        if (data.codE === 0) {
            this.historialRevisiones = data.jsonResultado;
            if (this.historialRevisiones.length > 0) {
                let ultimaRevision: any = JSON.parse(JSON.stringify(this.historialRevisiones));
                ultimaRevision = ultimaRevision.shift().revision;
                ultimaRevision.filter((calificacion: any) => {
                    this.rubrosCalificacion.filter((_item: any) => {
                        if (calificacion.idRubro === _item.idRubro) {
                            _item.comentario = calificacion.comentario;
                            _item.idStatusRevision = calificacion.idStatusRevision;
                            _item.idRechazo = calificacion.idRechazo;
                            _item.status = Number(calificacion.idStatusRevision) === 5 ? 'ok.png' : 'x.png';
                        }
                    });
                });
                //Ajustar Historial de Revisiones de la Solicitud
                let newRevision: Object[] = [], noRevision: number = 1;
                this.historialRevisiones.filter((revision: any) => {
                    let newRubro: Object[] = [];
                    revision.revision.filter((rubros: any) => {
                        if (rubros.idStatusRevision === 10) {
                            newRubro.push({
                                color: this.catalogos.getColorDocumento((this.usuarioBasic.estatus === 2 && noRevision > 1) ? 100 : rubros.idDocumento),
                                colorTexto: this.catalogos.getColorTexto((this.usuarioBasic.estatus === 2 && noRevision > 1) ? false : true),
                                comentario: rubros.comentario,
                                documento: this.catalogos.getTitleDocumento(rubros.idDocumento),
                                idDocumento: rubros.idDocumento,
                                idRechazo: this.catalogos.getTitleRechazo(rubros.idRechazo),
                                idRubro: this.catalogos.getTitleRubro(rubros.idRubro),
                                idStatusRevision: rubros.idStatusRevision,
                                numRevision: rubros.numRevision
                            });
                        }
                    });
                    newRevision.push({
                        revision: newRubro,
                        comentario: {
                            nombreAnalista: revision.comentario.nombres + ' ' + revision.comentario.apellidoPaterno + ' ' + revision.comentario.apellidoMaterno,
                            comentario: this.invalid(revision.comentario.comentario) ? 'Sin Comentario' : revision.comentario.comentario,
                            fechaIngreso: revision.comentario.fechaIngreso,
                            fechaRevision: revision.comentario.fechaRevision,
                            horaIngreso: revision.comentario.horaIngreso,
                            horaRevision: revision.comentario.horaRevision,
                            numRevision: revision.comentario.numRevision,
                            usuario: revision.comentario.usuario,
                            icoAvatar: this.catalogos.getColorAvatar((this.usuarioBasic.estatus === 2 && noRevision > 1) ? null : this.usuarioBasic.estatus),
                            color1: this.catalogos.getColorStatus((this.usuarioBasic.estatus === 2 && noRevision > 1) ? null : this.usuarioBasic.estatus),
                            color2: this.catalogos.getColorDate((this.usuarioBasic.estatus === 2 && noRevision > 1) ? null : this.usuarioBasic.estatus),
                            color3: this.catalogos.getColorTexto((this.usuarioBasic.estatus === 2 && noRevision > 1) ? false : true)
                        }
                    });
                    noRevision++;
                });
                this.historialRevisiones = newRevision;
                console.log("Historial de revisiones: ", this.historialRevisiones);
            } else {
                console.log('Consumo de precalificacion');
            }
        } else {
            console.log(data);
        }
    }
    //Se ajusta la informacion del avatar del usuario
    /*private FotoUsuario(data: any): void {
        if (data.codE === 0) {
            this.avatar.updateFoto(data.jsonResultado.contenido);
        } else {
            this.notifications.info('Mesa Control', 'Cliente no cuenta con foto');
        }
    }*/
    //Set de calificaciones de los rubros
    private SetCalificacion(_rubro: any, _calificacion: boolean): void {
        this.variable = _rubro;
        if (_calificacion) {
            this.ActualizarEstatusDoc(this.activo.idDocumento, 1);
            this.GuardarCalificacion(_rubro, _calificacion);
        } else {
            this.formRechazos.reset();
            this.objHandler.modal1 = true;
            this.motivoRechazo = this.catalogos.getRechazoPorRubro(_rubro.idRubro);
        }
    }
    //Valida los rechazo de los rubros de las solicitudes
    public SetRechazo(_rubro2: any, _calificacion: boolean): void {
        console.log(_rubro2);
        this.variable = _rubro2;
        if (!this.invalid(_rubro2.idRechazo)) {
            if (Number(_rubro2.idRechazo) === 8 && this.invalid(_rubro2.comentario)) {
                this.handlerModal.reqMotivo = true;
            } else {
                this.objHandler.modal1 = false;
                this.handlerModal.reqMotivo = false;
                this.handlerModal.required = false;
                this.ActualizarEstatusDoc(this.activo.idDocumento, 0);
                this.GuardarCalificacion(_rubro2, _calificacion);
            }
        } else {
            this.handlerModal.required = true;
        }
    }
    //Metodo para calificar cada rubro de las solicitudes
    private GuardarCalificacion(_rubro4: any, _calificacion: boolean): void {
        // let rubro_newsend = _rubro;
        if (!_calificacion) {
            let _activo: any = this.activo;
            _activo.idRechazo = Number(_rubro4.idRechazo);
            _activo.comentario = _rubro4.comentario;
            _rubro4 = _activo;
        }
        this.rubrosCalificacion.filter((_item: any) => {
            if (_item.idRubro === _rubro4.idRubro) {
                _item.status = _calificacion ? 'ok.png' : 'x.png';
                _item.idStatusRevision = _calificacion ? 5 : 10;
            }
        });
        this.navigateNextDoc(_rubro4);
        this.checkSolicitud();
    }
    //Mostrar resumen de la solicitud
    private MostrarResumen(): void {
        let _activo: object = { claseico: 'verde-03-ico', textoMenu: 'Resumen' };
        this.activo = _activo;
        this.objHandler.resumen = true;
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
    //Ventana modal para liberación o devolución de una solicitud
    private FinalizarCalificacion(_data: any): void {
        if (_data === 'liberar') {
            this.objHandler.modalLiberar = true;
        } else if (_data === 'rechazar') {
            this.objHandler.modalRechazar = true;
        }
    }
    private ActualizarEstatusDoc(_idDoc: any, _statusDoc: number): void {
        console.log(_statusDoc);
        if (!this.invalid(_idDoc)) {
            let selectedDocument: any = this.GetCurrentDocument({ "idDocumento": _idDoc });
            let selectedDocument2 = selectedDocument;
            console.log(_idDoc);
            console.log(selectedDocument);

            if (!this.invalid(selectedDocument)) {
                super.loading(true);
                let jsonRequest: Object = {
                    "idDocumento": selectedDocument.idDocumento.toString(),
                    "idExp": selectedDocument.idExpediente.toString(),
                    "StatusDoc": _statusDoc
                };
                if (selectedDocument.idDocumento.toString() === '8-25' || selectedDocument.idDocumento.toString() === '8-26' || selectedDocument.idDocumento.toString() === '8-45' || selectedDocument.idDocumento.toString() === '8-16' || selectedDocument.idDocumento.toString() === '8-6' || selectedDocument.idDocumento.toString() === '8-30') {
                    let getrubros = this.rubrosCalificacion.filter((element) => {
                        return element.idDocumento === selectedDocument.idDocumento.toString();
                    });

                    if (this.newRubroDoc !== undefined) {
                        let getArrayNewRubroDoc = this.newRubroDoc.filter((element) => {
                            return element.send.idDocumento === selectedDocument.idDocumento.toString();
                        });
                        if (getArrayNewRubroDoc.length === 0) {
                            this.newRubroDoc.push({
                                "_rubro": getrubros,
                                "send": {
                                    "idDocumento": selectedDocument.idDocumento.toString(),
                                    "idExp": selectedDocument.idExpediente.toString(),
                                    "StatusDoc": _statusDoc,
                                }
                            });
                        } else {
                            if (_statusDoc === 0) {//rechazamos
                                let this2 = this;
                                this.newRubroDoc.map(function(element) {
                                    if (element.send.idDocumento === _idDoc) {
                                        element._rubro.idRechazo = Number(this2.variable.idRechazo);;
                                        element._rubro.idStatusRevision = 10;
                                        element._rubro.comentario = this2.variable.comentario;;
                                    }
                                    return element;
                                });

                            } else {
                                this.newRubroDoc.map(function(element) {
                                    if (element.send.idDocumento === _idDoc) {
                                        element._rubro.idRechazo = null;
                                        element._rubro.idStatusRevision = null;
                                        element._rubro.comentario = null;
                                    }
                                    return element;
                                });
                            }
                        }
                    } else {
                        this.newRubroDoc.push({
                            "_rubro": getrubros,
                            "send": {
                                "idDocumento": selectedDocument.idDocumento.toString(),
                                "idExp": selectedDocument.idExpediente.toString(),
                                "StatusDoc": _statusDoc,
                            }
                        });

                        if (_statusDoc === 0) {
                            this.GuardarCalificacion(getrubros, false);
                        } else {
                            this.GuardarCalificacion(getrubros, true);
                        }
                    }



                    this.isfatca = false;
                    setTimeout(() => {
                        // super.loading(false);
                    }, 2000);
                } else if (selectedDocument.idDocumento.toString() === '8-101') {// validacion si es fatca
                    this.newRubroDoc = [];
                    this.rubrosCalificacion.filter((rubros: any) => {
                        console.log(rubros);
                        if (rubros.hidden === false && rubros.idRubro >= 7 && rubros.idRubro <= 14 && rubros.idRubro !== 13) {



                            if (_statusDoc === 0) {//rechazar
                                console.log("//rechazar");

                                rubros.idRechazo = Number(this.variable.idRechazo);
                                rubros.comentario = this.variable.comentario;
                                rubros.idStatusRevision = 10;
                                rubros.status = 'x.png';

                                console.log(rubros);

                            } else {
                                console.log("Activar");

                                rubros.idRechazo = null;
                                rubros.idStatusRevision = null;
                                rubros.comentario = null;
                                rubros.status = 'ok.png';
                            }

                            console.log(rubros.idDocumento);
                            let selectedDocument: any = this.GetCurrentDocument({ "idDocumento": rubros.idDocumento });
                            if (selectedDocument !== null) {
                                this.newRubroDoc.push({
                                    "_rubro": rubros,
                                    "send": {
                                        "idDocumento": selectedDocument.idDocumento.toString(),
                                        "idExp": selectedDocument.idExpediente.toString(),
                                        "StatusDoc": _statusDoc,
                                    }
                                });
                            }
                            this.isfatca = true;
                            if (_statusDoc === 0) {
                                this.GuardarCalificacion(rubros, false);
                            } else {
                                this.GuardarCalificacion(rubros, true);
                            }

                        }
                    });
                    setTimeout(() => {
                        // super.loading(false);
                    }, 2000);

                    let getrubros2 = this.rubrosCalificacion.filter((element) => {
                        return element.idDocumento === '8-101';
                    });

                    console.log(getrubros2);


                    this.newRubroDoc.push({
                        "_rubro": getrubros2,
                        "send": {
                            "idDocumento": selectedDocument2.idDocumento.toString(),
                            "idExp": selectedDocument2.idExpediente.toString(),
                            "StatusDoc": _statusDoc,
                        }
                    });

                    // this.newRubroDoc._rubron = getrubros2;
                    // this.newRubroDoc.send = {
                    //     "idDocumento": selectedDocument2.idDocumento.toString(),
                    //     "idExp": selectedDocument2.idExpediente.toString(),
                    //     "StatusDoc": _statusDoc,
                    // };
                    console.log(this.newRubroDoc);
                    this.isfatca = false;

                } else {
                    this.isfatca = false;
                    this.getData(jsonRequest, MESA_CONTROL.actualizarStatusDoc).subscribe((data: any) => {
                        console.log("RESPONSE ACTUALIZAR ESTATUS DOC: ", data);
                        super.loading(false);
                    });
                }
            } else {
                console.log("El documento no existe en la consulta.");
            }
        } else {
            this.notifications.alert('El ID del documento a rechazar no es valido.');
        }
    }
    private CertificarSolicitudMC(): void {

        let documentosRechazo: any = (this.jsonRequest.hasOwnProperty('documentos')) ? this.jsonRequest.documentos.filter(function(element) { return element.status === 10 && element.idRechazo !== null; }) : null;

        if (documentosRechazo !== null) {
            if (documentosRechazo.length === 0) {
                super.loading(true);
                let jsonRequest: Object = { "cuenta": this.usuarioCompl.cuenta };
                this.getData(jsonRequest, MESA_CONTROL.certificarSolicitud).subscribe((data: any) => {
                    console.log("REQUEST CERTIFICACION SOLICITUD: ", data);
                    super.loading(false);
                    this.notifications.success('Mesa Control', 'Operación efectuada de forma exitosa');
                    setTimeout(() => {
                        this.router.navigate(['./mesa-control/captacion']);
                    }, 1500);
                });
            } else {
                this.router.navigate(['./mesa-control/captacion']);
            }
        } else {
            this.notifications.alert('No fue posible validar los documentos rechazados');
        }
    }
    //Genera el json a enviar para el ingreso de la calificacion de las solicitudes
    public EnviarCalificacion(_comentario: any): void {
        let calificaciones: Object[] = [];
        console.log(this.rubrosCalificacion);
        this.rubrosCalificacion.filter((_item: any) => {
            if (_item.idDocumento !== null && _item.idStatusRevision !== null && !_item.hidden) {
                /*if (_item.idDocumento !== null && _item.idStatusRevision !== null) {*/
                calificaciones.push({
                    idDocumento: this.catalogos.getIdDocumento(_item.idRubro),
                    idRubro: _item.idRubro,
                    status: _item.idStatusRevision,
                    idRechazo: _item.idRechazo,
                    comentario: (_item.comentario !== null) ? (_item.comentario).replace(/"/g, "'") : null,
                });
            }
        });
        let jsonRequest: Object = {
            documentos: calificaciones,
            idSolicitud: this.usuarioBasic.folio,
            solicitud: this.usuarioCompl.solicitud,
            observacion: this.invalid(_comentario.observaciones) ? null : (_comentario.observaciones).replace(/"/g, "'"),
            idEmpleado: Number(this.usuarioCompl.idCliente),
            intentoCalificacion: 1
        };
        this.jsonRequest = jsonRequest;
        console.log("REQUEST DATA: ", this.jsonRequest);
        super.loading(true);
        console.log("REQUEST DATA DOCUMENTOS: ", this.newRubroDoc);

        this.ActualizarEstatusDocnew(this.newRubroDoc);
    }


    private ActualizarEstatusDocnew(data): void {
        let datarespaldo = data;
        super.loading(true);
        if (this.cont < this.newRubroDoc.length) {
            this.getData(data[this.cont].send, MESA_CONTROL.actualizarStatusDoc).subscribe((data: any) => {
                console.log("RESPONSE ACTUALIZAR ESTATUS DOC: ", data);
                this.cont = this.cont + 1;
                super.loading(false);
                this.ActualizarEstatusDocnew(datarespaldo);
            });
        } else {
            console.log("enviamos ultimo servisio");
            console.log("REQUEST DATA: ", this.jsonRequest);
            this.getData(this.jsonRequest, MESA_CONTROL.insertaCalificacion).subscribe((data: any) => {
                super.loading(false);
                this.ValidarRespuesta(data);
            });

        }

    }

    public continuarLiberacion(_val: any): void {
        if (_val.codE === 0) {
            this.jsonRequest.intentoCalificacion = 2;
            super.loading(true);
            this.getData(this.jsonRequest, MESA_CONTROL.insertaCalificacion).subscribe((data: any) => {
                super.loading(false);
                this.ValidarRespuesta(data);
            });
        } else {
            this.ValidarRespuesta({ codE: 100 });
        }
    }
    private ValidarRespuesta(data: any): void {
        if (data.codE === 0) {
            this.CertificarSolicitudMC();
        } else if (data.codE === 1 || data.codE === 9) {
            this.router.navigate(['./mesa-control/captacion']);
        } else if (data.codE === 2 || data.codE === 3 || data.codE === 4 || data.codE === 6 || data.codE === 7 || data.codE === 8) {
            let msgE: string = this.catalogos.getMsjEAlerta(data.codE);
            this.notifications.alert('Mesa Control', msgE + ' - Codigo: ' + data.codE);
            this.getData({ idSolicitud: this.usuarioCompl.idSolicitud }, MESA_CONTROL.revisionesPrevias).subscribe((data: any) => {
                this.HistorialRevisiones(data);
                this.MostrarResumen();
            });
        } else if (data.codE === 5) {
            this.objHandler.modalConfirmacion = true;
        } else if (data.codE === 100) {
            this.MostrarResumen();
        } else {
            this.notifications.alert('Mesa Control', 'No se completo la operación correctamente');
            setTimeout(() => {
                this.router.navigate(['./mesa-control/captacion']);
            }, 3000);
        }
    }
    //Valida que todos los rubros de la solicitud tengan calificación
    private checkSolicitud() {
        let completo: boolean = true;
        let liberar: boolean = true;
        this.rubrosCalificacion.filter((_item: any) => {
            if (_item.idDocumento !== null && !_item.hidden) {
                if (_item.idStatusRevision === null) {
                    completo = false;
                }
                if (_item.idStatusRevision === 10 && _item.idDocumento !== "8-16") {
                    liberar = false;
                }
            }
        });
        console.log(completo);
        if (completo) {
            this.objHandler.stSolicitud = liberar ? 'liberar' : 'rechazar';
        }
    }
    private validarIne(): void {
        window.open("http://listanominal.ife.org.mx", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=1000,height=800");
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
    //Retorna id del rubro posterior a la calificación
    private getIdNextDoc(_rubro: number): number {
        if (_rubro === 1) { return 2; }
        else if (_rubro === 2) { return 3; }
        else if (_rubro === 3) { return 5; }
        else if (_rubro === 5) { return 6; }
        else if (_rubro === 6) { return 7; }
        else if (_rubro === 7) { return 8; }
        else if (_rubro === 8) { return 9; }
        else if (_rubro === 9) { return this.objHandler.docBuro ? 10 : 11; }
        else if (_rubro === 10) { return 11; }
        else if (_rubro === 11) { return this.objHandler.docCredito ? 12 : this.objHandler.docFATCA ? 13 : this.objHandler.docAnexo ? 14 : 11; }
        else if (_rubro === 12) { return this.objHandler.docFATCA ? 13 : this.objHandler.docAnexo ? 14 : 12; }
        else if (_rubro === 13) { return this.objHandler.docAnexo ? 14 : 13; }
        else if (_rubro === 14) { return 14; }
        else if (_rubro >= 100) { return (_rubro + 1) - 100; }
        else { return 1; }
    }
}