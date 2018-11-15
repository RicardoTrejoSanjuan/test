/*
 * @version 1.0 (07-06-2017)
 * @author lfgonzalezr
 * @description Componente para la visualización de los documentos de crédito
 * @contributors Front-end team
 */
import { Component, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import * as moment from 'moment';
/* Componentes de portal */
import { Pagination } from '../../../../classGeneric/pagination';
import { Notifications } from '../../../../classGeneric/notifications';
import { CatalogosMC } from '../../../../classGeneric/constants-mesa-control';
import { Institucion, Producto, ObjHandlerBusqueda, JsonRequest } from '../creditos-mesa-control';
import { Service } from '../../../../service/service';
import { MESA_CONTROL } from '../../constants-url';
import * as _ from 'underscore';

@Component({
    selector: 'mesa-control-busqueda',
    templateUrl: 'busqueda.component.html',
    styleUrls: ['../../mesa-control.component.css']
})

export class MesaControlBusquedaCreditos extends Pagination {
    public FormInstituciones: FormControl;
    private FormFilters: any;
    public Instituciones: any = null;
    private allInstituciones: Institucion[] = [];
    private Productos: Producto[] = [];
    private estatusList: any;
    public objHandler: ObjHandlerBusqueda = new ObjHandlerBusqueda();
    private jsonRequest: JsonRequest;
    private minDate: Date = null;
    private maxDate: Date = null;
    private pager: any;
    private pagedItems: any[];
    private data: any = [];

    constructor(private service: Service, private router: Router, private notifications: Notifications, private catalogos: CatalogosMC) {
        super();
        this.FormInstituciones = new FormControl();
        this.estatusList = this.catalogos.getListStatus();
        this.maxDate = new Date();
        this.CargarInstituciones();
        //Se valida el tipo de usuario que puede ver los status de las solicitudes
        this.objHandler.setTipoUsuario(false);
        let json: any = super.getAttr('jsonCredito');
        if (json !== null) {
            //Consulta y carga la ultima consulta relizada antes de revisar los documentos
            this.CargarConsultaPrevia(json);
        } else {
            this.FormFilters = new FormGroup({
                strBusqueda: new FormControl(null),
                producto: new FormControl(null),
                estatus: new FormControl(null),
                fechaInicial: new FormControl({ value: null, disabled: true }),
                fechaFinal: new FormControl({ value: null, disabled: true })
            });
        }
    }
    //Cargar consulta previa
    private CargarConsultaPrevia(json: any): void {
        this.objHandler.setFilters(true);
        this.objHandler.setRegisters(true);
        this.objHandler.setQueryDates(true);
        this.objHandler.setQueryRegisters(true);
        this.Productos = super.getAttr('ProductosCredito');
        this.FormInstituciones = new FormControl(json.empresaNombre);
        let _producto: any = null;
        if (this.Productos.length === 1) {
            let object: any = JSON.parse(JSON.stringify(this.Productos));
            let arr: any = object.shift();
            _producto = arr.idProducto;
        } else {
            _producto = json.idProducto;
        }
        this.FormFilters = new FormGroup({
            strBusqueda: new FormControl(json.busqueda),
            producto: new FormControl(_producto),
            estatus: new FormControl(json.statusRevision),
            fechaFinal: new FormControl({ value: this.catalogos.getDateNew(json.fechaFin), disabled: true }),
            fechaInicial: new FormControl({ value: this.catalogos.getDateNew(json.fechaInicio), disabled: true })
        });
        this.jsonRequest = new JsonRequest(json.idInstitucion, json.empresaNombre, json.idPais);
        this.jsonRequest.setIdProducto(json.idProducto);
        this.jsonRequest.setBusqueda(json.busqueda);
        this.jsonRequest.setStatusRevision(json.statusRevision);
        this.jsonRequest.setFechaInit(json.fechaInicio);
        this.jsonRequest.setFechaFin(json.fechaFin);
        this.resetParams();
        this.setPage(1);
    }
    //Boton para regresar a la busqueda de los créditos
    public Regresar(): void {
        super.saveData(null, 'Usuario');
        super.saveData(null, 'clienteCredito');
        super.saveData(null, 'jsonCredito');
        super.saveData(null, 'ProductosCredito');
        this.router.navigate(['./mesa-control']);
    }
    // Carga las instituciones al predictivo
    private CargarInstituciones(): void {
        super.loading(true);
        this.servicePrivate({}, MESA_CONTROL.getInstituciones).subscribe((data: any) => {
            super.loading(false);
            if (data.codE === 0) {
                this.allInstituciones = data.jsonResultado;
                this.Instituciones = this.FormInstituciones.valueChanges
                    .startWith(null)
                    .map(name => this.FilterInstituciones(name));
            } else {
                this.notifications.info('Mesa Control', 'No se logro obtener información de las instituciones');
            }
        });
    }
    //Metodo para cargra los prodcutos de las instituciones
    private CargarProductos(_institucion: any): void {
        this.servicePrivate({ idInstitucion: _institucion.idInstitucion, idPais: _institucion.idPais }, MESA_CONTROL.getProductos).subscribe((data: any) => {
            if (data.codE === 0) {
                this.Productos = data.jsonResultado;
                if (this.Productos.length === 1) {
                    let object: any = this.FormFilters.controls;
                    let _producto: any = JSON.parse(JSON.stringify(this.Productos));
                    _producto = _producto.shift();
                    this.FormFilters = new FormGroup({
                        strBusqueda: new FormControl(object.strBusqueda.value),
                        producto: new FormControl(_producto.idProducto),
                        estatus: new FormControl(object.estatus.value),
                        fechaInicial: new FormControl({ value: object.fechaFinal.value, disabled: true }),
                        fechaFinal: new FormControl({ value: object.fechaFinal.value, disabled: true })
                    });
                }
            } else {
                this.notifications.alert('Mesa Control', 'No se obtuvieron productos para esta empresa, vuelva a intentar');
            }
        });
    }
    //Metodo para la busqueda de los registros
    private ConsultaRegistros(_institucion: any): void {
        if (!this.objHandler.getQueryRegisters()) {
            this.objHandler.setQueryDates(true);
            this.objHandler.setQueryRegisters(true);
            this.jsonRequest = new JsonRequest(_institucion.idInstitucion, _institucion.nombre, _institucion.idPais);
            this.resetParams();
            this.setPage(1);
            this.CargarProductos(_institucion);
        }
    }
    //Busqueda del texto
    private BusquedaStr(_item: any): void {
        if (_item.strBusqueda.length > 2) {
            this.objHandler.setStateNewQuery(true);
            this.resetParams();
            this.jsonRequest.setBusqueda(_item.strBusqueda);
            this.setPage(1);
        } else if (this.objHandler.getStateNewQuery()) {
            this.objHandler.setStateNewQuery(false);
            this.resetParams();
            this.jsonRequest.setBusqueda('');
            this.setPage(1);
        }
    }
    //Consulta de registros con producto
    private SeleccionandoProducto(_item: any): void {
        this.resetParams();
        this.jsonRequest.setIdProducto(_item.producto);
        this.setPage(1);
    }
    //Consulta con un estatus determinado
    private SeleccionandoStatus(_item: any): void {
        this.resetParams();
        this.jsonRequest.setStatusRevision(_item.estatus);
        this.setPage(1);
    }
    private SeleccionandoFecha(_value, _type): void {
        if (this.objHandler.getQueryDates()) {
            if (_type === 'inicial') {
                let newDate: any = this.catalogos.getDateNew(_value);
                newDate = moment(newDate).format('DD-MM-YYYY');
                this.jsonRequest.setFechaInit(newDate);
                this.minDate = this.catalogos.getDateNew(_value);
            } else if (_type === 'final') {
                let newDate: any = this.catalogos.getDateNew(_value);
                newDate = moment(newDate).format('DD-MM-YYYY');
                this.jsonRequest.setFechaFin(newDate);
                this.maxDate = this.catalogos.getDateNew(_value);
            }
            this.resetParams();
            this.setPage(1);
        }
    }
    private BorrarDatePicker(_type: any): void {
        let object: any = this.FormFilters.controls;
        if (_type === 'inicial') {
            this.jsonRequest.setFechaInit(null);
            this.FormFilters = new FormGroup({
                strBusqueda: new FormControl(object.strBusqueda.value),
                producto: new FormControl(object.producto.value),
                estatus: new FormControl(object.estatus.value),
                fechaInicial: new FormControl({ value: null, disabled: true }),
                fechaFinal: new FormControl({ value: object.fechaFinal.value, disabled: true })
            });
        } else {
            this.jsonRequest.setFechaFin(null);
            this.FormFilters = new FormGroup({
                strBusqueda: new FormControl(object.strBusqueda.value),
                producto: new FormControl(object.producto.value),
                estatus: new FormControl(object.estatus.value),
                fechaInicial: new FormControl({ value: object.fechaInicial.value, disabled: true }),
                fechaFinal: new FormControl({ value: null, disabled: true })
            });
        }
        this.resetParams();
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
            this.jsonRequest.setPagina(page);
            super.loading(true);
            this.servicePrivate(this.jsonRequest.get(), MESA_CONTROL.getQueryCreditos).subscribe(
                (data: any) => {
                    super.loading(false);
                    if (data.codE === 0) {
                        let object: any = data.jsonResultado;
                        if (object.total > 0) {
                            this.objHandler.setQueryRegisters(false);
                            this.objHandler.setFilters(true);
                            this.objHandler.setRegisters(true);
                            this.pager = this.getPager(object.total, page, object.rango);
                            this.addItemToArray(this.pager, object.consulta, object.rango, object.total);
                            this.pagedItems = _.where(this.objectArrayPaginate, { page: this.pager.currentPage });
                        }
                    } else {
                        this.objHandler.setQueryRegisters(false);
                        this.notifications.alert('Mesa Control', 'No se obtuvieron registros adecuadamente, vuelva a intentar');
                    }
                }
            );
        } else {
            this.pager = this.getPager(total, page, rango);
            this.pagedItems = _.where(this.objectArrayPaginate, { page: this.pager.currentPage });
        }
    }
    //Metodo re-iniciar parametros de control de las bandejas de entrada de mesa de control
    private resetParams(): void {
        this.resetPaginator();
        this.pagedItems = [];
        this.pager = {};
    }
    //Función para redireccionar la busqueda de creditos
    private RevisarDocumentos(_item: any): void {
        super.saveData(this.jsonRequest, 'jsonCredito');
        super.saveData({
            folio: null,
            cliente: _item.nombre,
            empresa: this.jsonRequest.getNombreEmpresa()
        }, 'Usuario');
        super.saveData(_item, 'clienteCredito');
        super.saveData(this.Productos, 'ProductosCredito');
        this.router.navigate(['./mesa-control/credito/documentos']);
    }
    //Limpiar filtros y tablas de registros
    public ClearInstitucion(): void {
        this.objHandler.setQueryDates(false);
        this.Productos = [];
        this.FormFilters.reset();
        this.FormInstituciones.reset();
        this.objHandler.setFilters(false);
        this.objHandler.setRegisters(false);
    }
    //Función para filtar las insituciones por nombre
    private FilterInstituciones(_str: string): any {
        if (super.isValid(_str) && typeof (_str) === 'string') {
            return this.allInstituciones.filter((_item: any) => {
                let regexp: any = new RegExp(_str,"gi");
                if (_item.nombre.match(regexp) !== null) {
                    return _item;
                }
            });
        } else {
            return this.allInstituciones;
        }
    }
    //Metodo para recuperar la informacion de los servicios
    private servicePrivate = (_params: any, _url: string): Observable<Object> => {
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
}
