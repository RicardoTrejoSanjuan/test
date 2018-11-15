/*
 * @version 1.0 (01-06-2017)
 * @author lfgonzalezr
 * @description Muestra las solicitudes que se encuentras en mesa de control (Pendientes por revision, Devueltas, Rechazadas y Liberadas)
 * @contributors Front-end team
 */

/* IMPORTACION GENERAL */
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Pagination } from '../../../../classGeneric/pagination';
import { Notifications } from '../../../../classGeneric/notifications';
import { Observable } from 'rxjs/Observable';
import { Service } from '../../../../service/service';
import { CatalogosMC } from '../../../../classGeneric/constants-mesa-control';
import { MESA_CONTROL } from '../../constants-url';
import { RevisionSolicitudService } from '../revisionSolicitud.service';
import * as _ from 'underscore';

@Component({
    selector: 'mesa-control-bandejas',
    templateUrl: 'bandejas.component.html',
    styleUrls: ['../../mesa-control.component.css']
})

export class MesaControlBandejas extends Pagination {
    public tabs: Object[];
    public pager: any;
    public pagedItems: any[];
    public jsonRequest: any;
    public objHandler: any;

    constructor(private service: Service, private catalogos: CatalogosMC, private notifications: Notifications, private router: Router, private revisionService: RevisionSolicitudService) {
        super();
        this.jsonRequest = {
            idrol: 101,
            estado: null,
            pagina: null,
            busqueda: null,
            ordenpor: null,
            orden: null
        };
        this.tabs = [
            { id: 0, title: 'Bandeja de Recepción', active: true },
            { id: 3, title: 'Devueltas con observación', active: false },
            { id: 4, title: 'Rechazadas', active: false },
            { id: 2, title: 'Liberadas', active: false }
        ];
        this.objHandler = {
            existenRegistros: false,
            nvaBusqueda: false,
            strBusqueda: '',
            pageVisible: 1,
            searching: false,
            loadPrevious: false
        };
        //Carga de la primera bandeja de solicitudes
        let _lastRequest: any = super.getAttr('lastRequest');
        if (_lastRequest !== null) {
            this.cargarUltimaConsulta(_lastRequest);
        } else {
            this.BuscarSolicitudes({ id: 0, title: 'Bandeja de Recepción', active: true });
        }
    }
    private cargarUltimaConsulta(_lastRequest: any): void {
        this.objHandler.loadPrevious = true;
        this.resetParams();
        this.SetTabs({ id: _lastRequest.estado });
        this.objHandler.strBusqueda = _lastRequest.busqueda;
        //this.setParams({ estado: _lastRequest.estado, pagina: _lastRequest.pagina, busqueda: _lastRequest.busqueda });
        this.jsonRequest = _lastRequest;
        this.setPage(1);
    }

    public Regresar() {
        super.saveData(null, 'Usuario');
        super.saveData(null, 'lastRequest');
        this.router.navigate(['./mesa-control']);
    }
    private ConsultarDisponibilidad(_item: any): void {
        this.revisionService.setNumeroRevisionSolicitud(Number(_item.revision));
        let status: Number = this.getStatusTabs();
        if (status === 0) {
            this.getDisponibilidad({ idSolicitud: _item.folio }).subscribe(
                (data: any) => {
                    switch (data.codE) {
                        case 0:
                            _item.analista = true;
                            super.saveData(_item, "Usuario");
                            super.saveData(this.jsonRequest, 'lastRequest');

                            // this.redireccionarMesaControl(_item);
                            this.router.navigate(['./mesa-control/captacion/solicitud/validacion']);

                            break;
                        case 2:
                            let res: any = data.jsonResultado.shift();
                            let informacion: string = 'Solicitud en revision | Revisor: ' + res.nombre + ' ' + res.apellidoPaterno + ' ' + res.apellidoMaterno + ' | Fecha: ' + res.fecha;
                            this.notifications.info(informacion);
                            break;
                        case 3:
                            _item.analista = false;
                            super.saveData(_item, "Usuario");
                            super.saveData(this.jsonRequest, 'lastRequest');

                            // this.redireccionarMesaControl(_item);
                            this.router.navigate(['./mesa-control/captacion/solicitud/validacion']);

                            break;
                        case 1:
                            this.notifications.alert('Error de conexion inténtelo más tarde');
                            break;
                        case 4:
                            this.notifications.alert('Usuario sin permisos suficientes');
                            break;
                        case 5:
                            this.notifications.alert('Usuario no autorizado para realizar esta operación');
                            break;
                        default:
                            this.notifications.alert('Error de conexion inténtelo más tarde');
                            break;
                    }
                });
        } else {
            _item.analista = true;
            super.saveData(_item, "Usuario");
            super.saveData(this.jsonRequest, 'lastRequest');
            // this.redireccionarMesaControl(_item);
            this.router.navigate(['./mesa-control/captacion/solicitud/validacion']);
        }
    }
    /* private redireccionarMesaControl(_solicitud: any): void {
        let request = {
            "json": { "empresa": (_solicitud.empresa !== "" && _solicitud.empresa !== null) ? _solicitud.empresa.trim() : null },
            "url": "/mesacontrol/captacion/parametro/tipodocumento/consulta"
        };
        this.consultaVersionMC(request).subscribe(
            response => {
                let objResponse = JSON.parse(JSON.stringify(response));
                console.log("RESPONSE Version MC: ", objResponse);
                if (objResponse.codE === 0) {
                    this.router.navigate([(objResponse.jsonResultado.docsCertificados === "0") ? './mesa-control/captacion/solicitud/validacion' : './mesa-control/captacion/solicitudes']);
                } else {
                    this.notifications.info(objResponse.msgE);
                }
            }
        );
    }
    private consultaVersionMC = (_data: any): Observable<Object> => {
        return Observable.create(observer => {
            super.loading(true);
            this.service.post(_data.json, _data.url, 3).subscribe(
                succes => {
                    observer.next(JSON.parse(JSON.stringify(succes)));
                    observer.complete();
                },
                failed => {
                    observer.next(null);
                    observer.complete();
                },
                () => { // Se ejecuta al finalizar la peticion
                    super.loading(false);
                }
            );
        });
    } */
    //Consulta y recarga de las solicitudes de las bandejas de mesa de control
    public BuscarTexto(_str: String): void {
        let _objHandler: any = this.objHandler;
        if (_str.length > 3 || _objHandler.loadPrevious) {
            _objHandler.loadPrevious = false;
            _objHandler.nvaBusqueda = true;
            this.resetParams();
            this.setParams({ busqueda: _str });
            this.setPage(1);
        } else if (_objHandler.nvaBusqueda) {
            _objHandler.nvaBusqueda = false;
            this.resetParams();
            this.setParams({ busqueda: null });
            this.setPage(1);
        }
    }
    //Borrar y limpiar busqueda
    public limpiarStrBusqueda(): void {
        let _objHandler: any = this.objHandler;
        _objHandler.strBusqueda = '';
        this.resetParams();
        this.setParams({ busqueda: null });
        this.setPage(1);
    }
    //Metodo para realizar la busqueda y carga de la informacion en la vista
    private BuscarSolicitudes(_params: any): void {
        this.revisionService.setEsBandejaEspecial(false);
        if (_params.id === 2 || _params.id === 3 || _params.id === 4) {
            this.revisionService.setEsBandejaEspecial(true);
            console.log("BANDEJA ESPECIAL");
        }
        let _handler: any = this.objHandler;
        _handler.strBusqueda = '';
        this.resetParams();
        this.setParams({ estado: _params.id, busqueda: null });
        this.SetTabs(_params);
        this.setPage(1);
    }
    //Set de registros para mostrar en las bandejas
    private setPage(page: number, rango?: number, total?: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        let countPages = _.where(this.objectArrayPaginate, { page: page });
        if (countPages.length === 0) {
            let pagetoVisited = this.pageToVisited(page);
            this.getRegistros(pagetoVisited).subscribe(
                data => {
                    let object = JSON.parse(JSON.stringify(data));
                    let _handler: any = this.objHandler;
                    if (object.total > 0) {
                        _handler.existenRegistros = true;
                        this.pager = this.getPager(object.total, page, object.rango);
                        this.addItemToArray(this.pager, object.consulta, object.rango, object.total);
                        this.pagedItems = _.where(this.objectArrayPaginate, { page: this.pager.currentPage });
                        console.log("Solicitudes MC: ", this.pagedItems);
                    } else {
                        _handler.existenRegistros = false;
                    }
                }
            );
        } else {
            this.pager = this.getPager(total, page, rango);
            this.pagedItems = _.where(this.objectArrayPaginate, { page: this.pager.currentPage });
        }
    }
    private ClrJson(_data: any): void {
        if (this.getStatusTabs() === 0) {
            let _registros: any = _data.jsonResultado.consulta;
            _registros.filter((dato: any) => {
                if (Number(dato.estadoBloqueo) === 0) {
                    dato.nombreBloqueo = '';
                }
            });
        }
    }
    /*
    *
    * Consumo de servicios para la mesa de control
    */
    private getRegistros = (_page: any): Observable<Object> => {
        return Observable.create(observer => {
            super.loading(true);
            this.setParams({ pagina: _page });
            this.service.post(this.jsonRequest, MESA_CONTROL.consultaPorRol, 3).subscribe(
                data => {
                    super.loading(false);
                    let response = JSON.parse(JSON.stringify(data));
                    if (response.codE === 0) {
                        this.ClrJson(response);
                        observer.next(response.jsonResultado);
                        observer.complete();
                    }
                },
                error => {
                    super.loading(false);
                    observer.next(null);
                    observer.complete();
                },
                () => super.loading(false)
            );
        });
    }
    private getDisponibilidad = (_params: Object): Observable<Object> => {
        let observable: any = Observable.create(observer => {
            super.loading(true);
            //let path: String = '/mesacontrol/captacion/solicitud/bloquea';
            this.service.post(_params, MESA_CONTROL.bloquea, 3).subscribe(
                data => {
                    super.loading(false);
                    let response = JSON.parse(JSON.stringify(data));
                    observer.next(response);
                    observer.complete();
                },
                error => {
                    super.loading(false);
                    observer.next(null);
                    observer.complete();
                },
                () => super.loading(false)
            );
        });
        return observable;
    }
    /*
    *
    * Fin Consumo de servicios para la mesa de control
    */
    //Colores de las solicitudes de mesa de control
    private catColores(_idBloq: Number): String {
        let _status: Number = this.getStatusTabs();
        return this.catalogos.getColorExpediente(_status, _idBloq);
    }
    //Metodo re-iniciar parametros de control de las bandejas de entrada de mesa de control
    private resetParams(): void {
        this.resetPaginator();
        this.pagedItems = [];
        this.pager = {};
    }
    //Set de valores para JSONREQUEST
    private setParams(_params: any): void {
        let _jsonRequest: Object = this.jsonRequest;
        for (let item in _params) {
            if (_params.hasOwnProperty(item)) {
                _jsonRequest[item] = _params[item];
            }
        }
    }
    //Modifica el css de la pantalla
    private SetTabs(_item: any): void {
        let tabs: any = this.tabs;
        for (let item of tabs) {
            item.active = false;
            if (item.id === _item.id) {
                item.active = true;
            }
        }
    }
    //Recupera TAB actualmente visualizando
    private getStatusTabs() {
        let _tabs: any = this.tabs;
        for (let item of _tabs) {
            if (item.active) {
                return item.id;
            }
        }
    }
    //Fin de la clase
}
