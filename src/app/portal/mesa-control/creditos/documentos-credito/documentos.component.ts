/*
 * @version 1.0 (07-06-2017)
 * @author lfgonzalezr
 * @description Componente para la busqueda de los clientes con credito colocados
 * @contributors Front-end team
 */
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { ClassGenerica } from '../../../../classGeneric/config';
import { Notifications } from '../../../../classGeneric/notifications';
import { Service } from '../../../../service/service';
import { CatalogosMC } from '../../../../classGeneric/constants-mesa-control';
import { MesaControlAvatarUsuario } from '../../avatar-usuario/avatar.component';
import { VisorDocumentos } from '../../visor-documentos/visor-documentos.component';
import { MESA_CONTROL } from '../../constants-url';
import {
    ObjHandlerDocumentos,
    ClienteTienda,
    DocumentosCredito,
    DocumentoUrl,
    DocumentoDescargable,
    NotasCredito,
    FotoCU
} from '../creditos-mesa-control';

@Component({
    selector: 'mesa-control-documentos-credito',
    templateUrl: 'documentos.component.html',
    styleUrls: ['./../../mesa-control.component.css']
})
export class MesaControlDocumentosCredito extends ClassGenerica implements AfterViewInit {
    @ViewChild('visorDocumentos') Visor: VisorDocumentos;
    @ViewChild('avatarUsuario') avatar: MesaControlAvatarUsuario;
    public objHandler: ObjHandlerDocumentos = new ObjHandlerDocumentos();
    public clienteCredito: any = null;
    public arrDocumentos: any = [];
    public formNvoComen: any;

    constructor(private router: Router, private service: Service, private catalogos: CatalogosMC, private notifications: Notifications) {
        super();
        this.clienteCredito = super.getAttr('clienteCredito');
        /* Se realizan las validaciones correspondientes del tipo de usuario */
        this.objHandler.setTipoUsuario(false);
        this.CargarData(this.clienteCredito);
        this.formNvoComen = new FormGroup({
            usuario: new FormControl(null),
            idUsuario: new FormControl(null),
            comentario: new FormControl(null)
        });
    }
    //Función para regresar a la busqueda de los créditos
    public Regresar(): void {
        this.router.navigate(['./mesa-control/credito']);
    }
    //Ajustes de visor de documentos
    ngAfterViewInit(): void {
        this.Visor.reset();
        this.Visor.setConfig({ downloable: true, controlllers: true });
    }
    /* Carga de menus de documentos de crédito */
    private CargarData(_cliente: any): void {
        super.loading(true);
        this.getData(new ClienteTienda(_cliente.clienteTienda), MESA_CONTROL.consultaDocumentosCredito).subscribe((data: any) => {
            super.loading(false);
            if (data.codE === 0) {
                let obj: any = data.jsonResultado;
                let arr: DocumentosCredito[] = [];
                for (let index in obj) {
                    if (obj.hasOwnProperty(index)) {
                        let title: string = this.catalogos.getNombresDocumentos(obj[index].idDocumento, index);
                        let rutasHttp: string[] = (obj[index].rutasHttp !== undefined && obj[index].rutasHttp !== "") ? obj[index].rutasHttp : null;
                        let idDocumento: number = obj[index].idDocumento;
                        let active: boolean = Number(obj[index].idDocumento) === 444 ? true : false;
                        arr.push(new DocumentosCredito(active, idDocumento, rutasHttp, title));
                    }
                }
                if (arr.length > 0) {
                    this.arrDocumentos = JSON.parse(JSON.stringify(arr));
                    this.objHandler.setLastDocument(arr.pop());
                    this.seleccionarDocumento(arr.shift());
                } else {
                    this.notifications.info('Mesa Control', 'No se ha obtenido información de los documentos del cliente');
                    setTimeout(() => {
                        this.Visor.setConfig({ downloable: true, controlllers: true });
                        this.Visor.setDisabled();
                    }, 0);
                }
            } else {
                this.notifications.info('Mesa Control', 'No se ha obtenido información de los documentos del cliente');
                setTimeout(() => {
                    this.Visor.setConfig({ downloable: true, controlllers: true });
                    this.Visor.setDisabled();
                }, 0);
            }
            this.ConsultaFoto();
        });
    }
    //Consulta de foto de cliente
    private ConsultaFoto(): void {
        let ClienteUnico: FotoCU = new FotoCU(this.clienteCredito.paisCU, this.clienteCredito.paisCU, this.clienteCredito.sucursalCU, this.clienteCredito.folioCU);
        this.getData(ClienteUnico, MESA_CONTROL.recuperaFoto).subscribe((data: any) => {
            if (data.codE === 0) {
                this.avatar.updateFoto(data.jsonResultado.contenido);
            } else {
                this.notifications.info('Mesa Control', 'Cliente no cuenta con foto');
            }
        });
    }
    /* Seleccionando documento*/
    private seleccionarDocumento(_documento: any): void {
        this.setMenuActivate(_documento.idDocumento);
        this.objHandler.setNotas(false);
        this.objHandler.setTitleDocument(_documento.title);
        if (this.objHandler.getTipoUsuario()) {
            this.objHandler.setBtnRevisar(_documento);
        }
        setTimeout(() => {
            this.Visor.setConfig({ downloable: true, controlllers: true });
            this.Visor.initVisor(_documento);
        }, 0);
    }
    /* Muestra las notas ingresadas por el usuario */
    private MostrarNotas(): void {
        this.setMenuActivate(null);
        this.objHandler.setNotas(true);
        /*
        this.getData(new NotasCredito(this.clienteCredito.idCredito), MESA_CONTROL.getNotasCredito).subscribe(
            (data: any) => {
            });
        */
    }
    /* set active menus */
    private setMenuActivate(_idDocumento: number): void {
        this.arrDocumentos.filter((_item: any) => {
            _item.active = _item.idDocumento === _idDocumento ? true : false;
        });
    }
    /* Agrega nuevo comentario */
    public AgregarComentario(_form: any): void {
        if (super.isValid(_form.comentario)) {
            this.objHandler.setModalNuevoComen(false);
            this.notifications.success('Mesa Control', 'Agregando comentario');
        } else {
            this.objHandler.setAlertMsgE(true);
        }
    }
    public ModalNuevoComentario(_value: boolean): void {
        if (_value) {
            this.objHandler.setModalNuevoComen(true);
            this.formNvoComen = new FormGroup({
                usuario: new FormControl([super.getFullName()]),
                idUsuario: new FormControl(super.isKeyUser()),
                comentario: new FormControl(null)
            });
        } else {
            this.objHandler.setModalNuevoComen(false);
        }
    }
    public KeyPressComentario(): void {
        this.objHandler.setAlertMsgE(false);
    }
    /* Consumo de servicio para marcar como revisado a una solicitud */
    public ModalRevisado(_value: boolean): void {
        this.objHandler.setModalRevisado(_value);
    }
    public MarcarRevisado(): void {
        this.objHandler.setModalRevisado(false);
        this.notifications.success('Mesa Control', 'Marcar como revisado');
    }
    /* Función para descargar el docmento */
    private DescargarDocumento(_documento): void {
        let _documentoDescargable: DocumentoDescargable = new DocumentoDescargable(this.clienteCredito.clienteTienda, _documento.idDocumento);
        //let _documentoDescargable: DocumentoDescargable = new DocumentoDescargable(24949513031085, _documento.idDocumento);
        super.loading(true);
        this.getData(_documentoDescargable, MESA_CONTROL.getDocumentPDF).subscribe((response: any) => {
            super.loading(false);
            if (response.codE === 0) {
                if (super.isValid(response.jsonResultado)) {
                    let byteCharacters: any = atob(response.jsonResultado);
                    let byteNumbers: any = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) { byteNumbers[i] = byteCharacters.charCodeAt(i); }
                    let byteArray: any = new Uint8Array(byteNumbers);
                    let file: any = new Blob([byteArray], { type: 'application/pdf' });
                    let fileURL: any = URL.createObjectURL(file);
                    let save: any = document.createElement('a');
                    let title: string = this.objHandler.getTitleDocument();
                    save.target = '_blank';
                    save.download = title + '.pdf';
                    let clicEvent: any = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                    save.href = fileURL;
                    save.dispatchEvent(clicEvent);
                    (window.URL).revokeObjectURL(save.href);
                } else {
                    this.notifications.info('Mesa Control', response.msgE);
                }
            } else {
                this.notifications.alert('MesaControl', 'No se obtuvo respuesta adecuada');
            }
        });
    }
    /* Consumo de servicio para cargar la imagen base 64 del documento */
    private ConsultarDocumento(_params: any): void {
        this.objHandler.setLoading(true);
        this.service.getBase64(new DocumentoUrl(_params.url), MESA_CONTROL.getBase64Image, 3).subscribe((response: any) => {
            this.objHandler.setLoading(false);
            if (response.codE === 0) {
                if (response.jsonResultado === null || response.jsonResultado === '') {
                    this.notifications.alert('Mesa Control', 'No se cuenta con el documento en digitalización');
                }
                this.Visor.updateImage(response.jsonResultado, _params.idDocumento, _params.page);
            } else {
                this.Visor.updateImage(null, _params.idDocumento, _params.page);
            }
        });
    }
    /* Consumo de servicios */
    private getData = (_params: any, _url: string): Observable<Object> => {
        let observable: any = Observable.create(observer => {
            console.log(JSON.stringify(_params));
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
}
