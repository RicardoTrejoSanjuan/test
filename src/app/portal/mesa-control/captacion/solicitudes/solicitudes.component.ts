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
import { CatalogosMC } from '../../../../classGeneric/constants-mesa-control';
import { Notifications } from '../../../../classGeneric/notifications';
import { ClassGenerica } from '../../../../classGeneric/config';
import { Service } from '../../../../service/service';
import { MESA_CONTROL } from '../../constants-url';
import { VisorDocumentos } from '../../visor-documentos/visor-documentos.component';
import { MesaControlAvatarUsuario } from '../../avatar-usuario/avatar.component';
import { RubroActivo, Activo, HistorialNombres, Fechas, HandlerModal, ObjHandler } from '../captacion-mesa-control';

@Component({
    selector: 'mesa-control-solicitudes',
    templateUrl: 'solicitudes.component.html',
    styleUrls: ['../../mesa-control.component.css']
})

export class MesaControlSolicitudes extends ClassGenerica implements AfterViewInit {
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

    constructor(private service: Service, private catalogos: CatalogosMC, private router: Router, private notifications: Notifications, private formBuilder: FormBuilder,private changeDetector: ChangeDetectorRef) {
        super();
        this.usuarioBasic = super.getAttr('Usuario');
        this.documentos = null;
        this.historialRevisiones = null;
        this.jsonRequest = null;
        this.motivoRechazo = [];
        this.HistorialNombres = [];
        this.Vigencias = { comprobante: null, identificacion: null };
        this.rubrosCalificacion = new CatalogosMC().initRubros();
        this.formRechazos = new FormGroup({
            idRechazo: new FormControl(null),
            comentario: new FormControl(null)
        });
        this.formFinal = new FormGroup({ observaciones: new FormControl(null) });
        //iniciar con la consulta de informacion
        this.ConsultarData();
    }
    //Funcion que se ejecuta al terminar la carga del DOM
    ngAfterViewInit() {
        this.visor_uno.show();
        this.visor_dos.show();
        this.visor_uno.reset();
        this.visor_dos.reset();
        this.visor_uno.setConfig({ downloable: false });
        this.visor_dos.setConfig({ downloable: false, controlllers: false });
        this.objHandler.tipoAnalista = (Number(this.usuarioBasic.estatus) === 0 && this.usuarioBasic.analista) ? true : false;
        this.changeDetector.detectChanges();
    }
    //Metodo para regresar a la bandeja de las solicitudes
    public Regresar() {
        this.router.navigate(['./mesa-control/captacion']);
    }
    //Consulta de informacion de las solicitudes
    private ConsultarData(): void {
        super.loading(true);
        if (this.usuarioBasic !== null) {
            this.getData({ idSolicitud: this.usuarioBasic.folio }, MESA_CONTROL.solicitudRevision).subscribe((data: any) => {
                if (data.codE === 0) {
                    this.usuarioCompl = data.jsonResultado.shift();
                    this.Vigencias.comprobante = (new Fechas(this.usuarioCompl.vigenciaComprobanteDomicilio)).getDate();
                    this.Vigencias.identificacion = (new Fechas(this.usuarioCompl.vigenciaIdentificacion)).getDate();
                    this.getData({ idBig: this.usuarioCompl.idCliente }, MESA_CONTROL.getTipoIdentificacion).subscribe((data: any) => {
                        this.objHandler.setTipoIdentificacion(data.jsonResultado);
                        this.getData({ idEmpleado: this.usuarioCompl.idCliente }, MESA_CONTROL.historialNombres).subscribe((data: any) => {
                            this.HistorialNombres = (new HistorialNombres(data.jsonResultado, this.usuarioCompl)).get();
                            this.ConsultaDataCompl();
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
    //Complemento para la consulta de informacion de la solicitud
    private ConsultaDataCompl(): void {
        this.getData({ idSolicitud: this.usuarioCompl.idSolicitud }, MESA_CONTROL.revisionesPrevias).subscribe((data: any) => {
            this.objHandler.setAnexoComision(data.msgE);
            this.HistorialRevisiones(data);
            this.getData({ cuenta: this.usuarioCompl.cuenta, empresa: this.usuarioCompl.cuenta }, MESA_CONTROL.consultaDocumentos).subscribe((data: any) => {
                this.Documentos_Rutas(data);
                this.getData({
                    pais: this.usuarioBasic.pais,
                    folio: this.usuarioBasic.folioCteUn,
                    canal: this.usuarioBasic.canal,
                    sucursal: this.usuarioBasic.sucursal
                }, MESA_CONTROL.recuperaFoto).subscribe((data: any) => {
                    this.FotoUsuario(data);
                    this.SetRubro(this.rubrosCalificacion[1]);
                    super.loading(false);
                });
            });
        });
    }
    //Se guarda la informacion de los documentos
    private Documentos_Rutas(data: any): void {
        console.log(JSON.stringify(data));
        if (data.codE === 0) {
            this.documentos = this.FilterArrayCap(data.jsonResultado);
            /* - - - - - - - - - - - - - - - - - - - - - - - Validacion de los documentos recibidos - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
            if (this.objHandler.docAnexo) {
                for (let item of this.rubrosCalificacion) {
                    if (item.idDocumento === 601) {
                        item.hidden = false;
                    }
                }
            }
            if (this.GetCurrentDocument({ idDocumento: 16 }) === null) {
                this.objHandler.docBuro = false;
                for (let item of this.rubrosCalificacion) {
                    if (item.idDocumento === 16) {
                        item.hidden = true;
                        this.objHandler.docBuro = false;
                    }
                }
            }
            if (this.GetCurrentDocument({ idDocumento: 969 }) === null) {
                this.objHandler.docFATCA = false;
                for (let item of this.rubrosCalificacion) {
                    if (item.idDocumento === 969) {
                        item.hidden = true;
                        this.objHandler.docFATCA = false;
                    }
                }
            }
            for (let item in this.documentos) {
                if (this.documentos.hasOwnProperty(item)) {
                    if (item === 'CRE - Contrato Firmado') {
                        for (let item of this.rubrosCalificacion) {
                            if (item.idDocumento === -5) {
                                item.hidden = false;
                                this.objHandler.docCredito = true;
                            }
                        }
                        break;
                    }
                }
            }/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
        }
    }
    private FilterArrayCap(_array: any): any {
        let arrayDocumentos: any = {};
        for (let item in _array) {
            if (_array.hasOwnProperty(item)) {
                let result: boolean = /^CAP/.test(item);
                if (result) {
                    arrayDocumentos[item] = _array[item];
                } else if (_array[item].idDocumento === 16) {
                    arrayDocumentos[item] = _array[item];
                }
            }
        }
        return arrayDocumentos;
    }
    //Se guarda la informacion del historico de revisiones de la solicitud
    private HistorialRevisiones(data: any): void {
        console.log(data);
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
            } else {
                console.log('Consumo de precalificacion');
            }
        }
    }
    //Se ajusta la informacion del avatar del usuario
    private FotoUsuario(data: any): void {
        if (data.codE === 0) {
            this.avatar.updateFoto(data.jsonResultado.contenido);
        } else {
            this.notifications.info('Mesa Control', 'Cliente no cuenta con foto');
        }
    }
    //Set de calificaciones de los rubros
    private SetCalificacion(_rubro: any, _calificacion: boolean): void {
        if (_calificacion) {
            this.GuardarCalificacion(_rubro, _calificacion);
        } else {
            this.formRechazos.reset();
            this.objHandler.modal1 = true;
            this.motivoRechazo = this.catalogos.getRechazoPorRubro(_rubro.idRubro);
        }
    }
    //Valida los rechazo de los rubros de las solicitudes
    public SetRechazo(_rubro: any, _calificacion: boolean): void {
        if (!this.invalid(_rubro.idRechazo)) {
            if (Number(_rubro.idRechazo) === 8 && this.invalid(_rubro.comentario)) {
                this.handlerModal.reqMotivo = true;
            } else {
                this.objHandler.modal1 = false;
                this.handlerModal.reqMotivo = false;
                this.handlerModal.required = false;
                this.GuardarCalificacion(_rubro, _calificacion);
            }
        } else {
            this.handlerModal.required = true;
        }
    }
    //Metodo para calificar cada rubro de las solicitudes
    private GuardarCalificacion(_rubro: any, _calificacion: boolean): void {
        if (!_calificacion) {
            let _activo: any = this.activo;
            _activo.idRechazo = Number(_rubro.idRechazo);
            _activo.comentario = _rubro.comentario;
            _rubro = _activo;
        }
        this.rubrosCalificacion.filter((_item: any) => {
            if (_item.idRubro === _rubro.idRubro) {
                _item.status = _calificacion ? 'ok.png' : 'x.png';
                _item.idStatusRevision = _calificacion ? 5 : 10;
            }
        });
        let idNextRubro: any = this.getNextRubro(_rubro.idRubro);
        this.rubrosCalificacion.filter((_item: any) => {
            if (_item.idRubro === idNextRubro) { this.SetRubro(_item); }
        });
        this.checkSolicitud();
    }
    //Mostrar resumen de la solicitud
    private MostrarResumen(): void {
        let _activo: object = { claseico: 'verde-03-ico', textoMenu: 'Resumen' };
        this.activo = _activo;
        this.objHandler.resumen = true;
    }
    //Coloca el rubro a ser calificado
    private SetRubro(_rubro: any): void {
        console.log(_rubro);
        this.objHandler.resumen = false;
        if (_rubro.idDocumento !== null) {
            this.activo = _rubro;
            for (let item of this.rubrosCalificacion) {
                item.active = (item.idRubro === _rubro.idRubro) ? true : false;
            }
            //Ajustar y mostrar todos los documentos
            this.RubroEnRevision.comentario = _rubro.idStatusRevision === 10 ? this.getMotivosRechazo(_rubro.idRechazo, _rubro.comentario) : null;
            this.RubroEnRevision.visible = _rubro.idStatusRevision === 10 ? true : false;
            //Visor numero uno
            let currentDocument: any = this.GetCurrentDocument(_rubro);
            console.log(currentDocument);
            if (currentDocument !== null) {
                setTimeout(() => {
                    this.visor_uno.initVisor(currentDocument);
                }, 100);
            } else {
                this.notifications.info('Mesa Control', 'No se cuenta este documento');
                setTimeout(() => {
                    this.visor_uno.setDisabled();
                }, 100);
            }
            //Visor numero dos
            if (_rubro.idRubro === 1) {
                this.objHandler.vistaEnabled = 0;
                setTimeout(() => {
                    this.visor_dos.show();
                    this.visor_dos.setConfig({ downloable: false, controlllers: false });
                    this.visor_dos.updateImage(this.avatar.getfoto());
                }, 100);
            } else if (_rubro.idRubro >= 7) {
                this.objHandler.vistaEnabled = 0;
                setTimeout(() => {
                    this.visor_dos.show();
                    this.visor_dos.setConfig({ downloable: false, controlllers: true });
                    this.visor_dos.initVisor(this.GetCurrentDocument({ idDocumento: 1 }));
                }, 100);
            } else {
                this.objHandler.vistaEnabled = _rubro.idRubro;
            }
        } else {
            let idNextRubro: any = this.getNextRubro(_rubro.idRubro);
            this.rubrosCalificacion.filter((_item: any) => {
                if (_item.idRubro === idNextRubro) { this.SetRubro(_item); }
            });
        }
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
                if (Number(arrDocs[item].idDocumento) === _rubro.idDocumento) {
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
    //Genera el json a enviar para el ingreso de la calificacion de las solicitudes
    public EnviarCalificacion(_comentario: any): void {
        let calificaciones: Object[] = [];
        this.rubrosCalificacion.filter((_item: any) => {
            if (_item.idDocumento !== null && _item.idStatusRevision !== null && !_item.hidden) {
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
        console.log(JSON.stringify(jsonRequest));
        super.loading(true);
        this.getData(jsonRequest, MESA_CONTROL.insertaCalificacion).subscribe((data: any) => {
            super.loading(false);
            this.ValidarRespuesta(data);
        });
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
            this.notifications.success('Mesa Control', 'Operación efectuada de forma exitosa');
            setTimeout(() => {
                this.router.navigate(['./mesa-control/captacion']);
            }, 1500);
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
                if (_item.idStatusRevision === 10 && _item.idDocumento !== 16) {
                    liberar = false;
                }
            }
        });
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
                error => { observer.next(null); observer.complete(); },
                () => { observer.next(null); observer.complete(); }
            );
        });
        return observable;
    }
    //Consulta de la imagen base64 del documento
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
                this.visor_uno.updateImage(null, _params.idDocumento, _params.page);
            }
        });
    }
    //Validacion de elementos
    private invalid(_item: any): boolean {
        if (_item === null || typeof (_item) === 'undefined' || _item === "" || _item === 'null') { return true; }
        return false;
    }
    //Retorna id del rubro posterior a la calificación
    private getNextRubro(_rubro: number): number {
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
