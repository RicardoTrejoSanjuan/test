/**
 * Created by ehernandezga on 04/07/17.
 */
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Pagination } from '../../../../classGeneric/pagination';
import { FormControl } from '@angular/forms';
import { Service } from '../../../../service/service';
import { ClassGenerica } from '../../../../classGeneric/config';
import { ConfStockColumn } from '../../../../interfaces/interfacesGraficas';
import { ConfGraficaPie } from '../../../../interfaces/interfacesGraficas';
import { Notifications } from '../../../../classGeneric/notifications';
//Importacion de la clase de garfica
import { GraficaComponent } from '../../../../graficas-highchart/graficas-highchart.component';
import { GRAFICAS } from '../../../../constants/graficas';
import * as moment from 'moment';
import * as _ from 'underscore';

@Component({
    selector: 'reportes/perfilamiento',
    templateUrl: 'grafica-embudo-solicitudes.component.html',
    styleUrls: [
        'grafica-embudo-solicitudes.component.css',
        '../../credito/credito.component.css'
    ]
})

export class ReporteEmbudoSolicitudes extends Pagination implements AfterViewInit {

    @ViewChild('highStock') graficaStock: GraficaComponent;
    @ViewChild('highChart') graficaChart: GraficaComponent;
    menuLateral: Array<Object>;
    objTipoPeriodo: Object;
    jsonRequest: Object;
    listaInstituciones: any;
    Producto: any;
    institucionCtrl: FormControl;
    objFiltrosHandler: Object;
    listaProductosInst: any;
    maxDate: Date;
    minDate: Date;
    fechaInicial: Date;
    fechaFinal: Date;
    paletaColores: String[];
    Categorias: Object[];
    dataGraph: any;
    pager: any = {};
    pagedItems: any[];
    vistaActual: String;
    productos: any;
    idProducto: string;
    isAvailable: boolean;
    bandGrafica: boolean;
    constructor(private service: Service, private router: Router, private notifications: Notifications) {
        super();
        this.bandGrafica=true;
        this.menuLateral = this.getMenuLateral(1);
        this.listaProductosInst = [];
        this.menuNavigation = this.menuNavigation();
        this.institucionCtrl = new FormControl();
        this.Categorias = [];
        //Objetos de control
        this.objTipoPeriodo = { diario: true, mensual: false, anual: false };
        this.objFiltrosHandler = {
            idProductoInstSelected: null,
            anyoneSearchResult: false,
            institucionSelected: false
        };
        this.jsonRequest = {
            tipoPeriodo: 1,
            idPais: null,
            idInstitucion: null,
            idProducto: null,
            fechaInicio: null,
            fechaFin: null,
            fecha: null
        };
        this.dataGraph = {
            first: null,
            second: null
        };
        this.Producto = "";
        this.listaInstituciones = this.institucionCtrl.valueChanges.startWith(null).map(name => this.filtrarInstituciones(name));
        this.maxDate = new Date();
        this.minDate = null;
        this.fechaInicial = null;
        this.fechaFinal = null;
        this.paletaColores = GRAFICAS.PALETA_COLORES;
        this.vistaActual = '';
        this.idProducto = "";
        this.getProductos();
        this.isAvailable = true;
    }

    clickInstituciones() {
        if (this.isAvailable) {
            this.notifications.info("Seleccione un producto");
        }
    }

    changeProductos() {

        let _json: any = this.jsonRequest;

        if (this.idProducto === "") {

            this.isAvailable = true;
            _json.idProducto = null;
            _json.idPais = null;
            _json.idInstitucion = null;
            _json.fechaInicio = null;
            _json.fechaFin = null;
            _json.fecha = null;

            this.fechaInicial = null;
            this.fechaFinal = null;

            this.institucionCtrl = new FormControl();
            this.listaInstituciones = this.institucionCtrl.valueChanges.startWith(null).map(name => this.filtrarInstituciones(name));

        } else {
            this.isAvailable = false;
            _json.idProducto = parseInt(this.idProducto,0);
        }

        this.jsonRequest = _json;
        this.ConusmoServicioOtorgados(this.jsonRequest);
    }

    //Se ejecuta al tener el html listo
    ngAfterViewInit() {
        let params: Object = this.jsonRequest;
        this.ConusmoServicioOtorgados(params);
    }

    getProductos() {
        let objRequest = { "idInstitucion": null, "idPais": null };
        let uriRequest = "/AsesorBig/api/interno/instituciones/reportesProductos/instituciones/creditos";
        this.service.post(objRequest, uriRequest, 1).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                this.productos = object.jsonResultado;
            },
            error => {
                //console.log("Ha ocurrido una falla en la peticion -> [" + error + "]");
                this.notifications.error('Consulta de instituciones', error);
            },
            () => super.loading(false)
        );
    }
    //Metodo para consumo de servicio
    private ConusmoServicioOtorgados(_params: any) {
        this.bandGrafica=true;
        super.loading(true);//Spinner CARGANDO
        let path: String = '/AsesorBig/api/credito/perfilamiento/grafica/otorgados';
        console.log(_params);
        this.service.post(_params, path, 1).subscribe(
            data => {
                super.loading(false);
                let response = JSON.parse(JSON.stringify(data));
                console.log(response);
                if (response.codE === 0) {
                    if (response.jsonResultado !== null && response.jsonResultado.length > 0) {
                        
                        let dataSend: any = this.AjustarGraficaColumnas(response.jsonResultado);
                        //Guardadndo la informacion
                        this.dataGraph.first = {
                            data: dataSend.data,
                            conf: dataSend.conf
                        };
                        
                        this.graficaStock.CargarGrafica(dataSend.data, dataSend.conf);
                    } else {
                        this.bandGrafica=false;
                        this.notifications.info('La respuesta no contiene registros');
                    }
                } else {
                    this.notifications.info('La respuesta contiene algun fallo [' + response.msgE + ']');
                }
            },
            error => {
                super.loading(false);
                console.log('Error del servidor');
            },
            () => super.loading(false)
        );
    }
    //Ajustar Grafica
    private AjustarGraficaColumnas(_data: any): any {
        let arrPerfilamiento: Number[] = [];
        let arrOtorgados: Number[] = [];
        let arrTasa: Number[] = [];
        let arrBuro: Number[] = [];
        let arrFechas: String[] = [];
        for (let item of _data) {
            arrFechas.push(item.fecha);
            arrPerfilamiento.push(item.rechazadasPerfilamiento);
            arrOtorgados.push(item.creditosOtorgados);
            arrTasa.push(item.rechazadasTasa);
            arrBuro.push(item.rechazadasBuro);
        }
        let dataSend: any = [
            { name: 'Otorgados', data: arrOtorgados, color: '#90ED7D' },
            { name: 'Tasa', data: arrTasa, color: '#F7E419' },
            { name: 'Buró', data: arrBuro, color: '#FCB578' },
            { name: 'Perfilamiento', data: arrPerfilamiento, color: '#FF8873' }
        ];
        let confStockColumn: ConfStockColumn = {
            type: 'highstock',
            subType: 'column',
            title: '',
            subtitle: '',
            navigator: false,
            scrollbar: _data.length > 10 ? true : false,
            categories: arrFechas,
            minCategories: _data.length > 10 ? 10 : 0,
            allowDecimals: false,
            minyAxis: 0,
            titleCategoriesVertical: '',
            pointWidth: 60,
            pointPadding: 10,
            drilldown: true,
            formatLabel: ''
        };
        return { data: dataSend, conf: confStockColumn };
    }

    private AjustarGraficaCircular(_data: any, _complementarios: Object): any {
        if (_data !== null) {
            let datos: any = [];
            let opciones: any = _complementarios;
            if (opciones.name === 'Perfilamiento') {
                datos = _data.perfilamiento;
            } else if (opciones.name === 'Buró') {
                datos = _data.buroCredito;
            } else if (opciones.name === 'Tasa') {
                datos = _data.tasa;
            }
            let arr: any = {
                data: [],
                total: 0,
                title: 'Solicitudes en etapa de ' + opciones.name + ' del ' + opciones.category
            };
            for (let item of datos) {
                arr.total += item.total;
            }
            for (let item of datos) {
                arr.data.push({
                    y: Number(((item.total / arr.total) * 100).toFixed(2)),
                    name: (item.descripcion !== null && item.descripcion !== '' && item.descripcion !== undefined) ? item.descripcion : 'Sin Descripción',
                    nameShort: item.id,
                    cantidad: item.total,
                    date: opciones.category,
                    categoria: opciones.name
                });
            }
            this.Categorias = arr.data;
            return arr;
        }
    }

    //Metodo para mostrar la segumda grafica
    private CargarGraficaPastel(_params: any, _typeIn: Boolean): void {
        if (_params !== undefined && _params !== null && _params !== '') {
            if (_params.series.name !== 'Otorgados') {
                this.vistaActual = 'secondGraph';
                let _jsonRequest: any = this.jsonRequest;
                let _complementarios: Object = { name: _params.series.name, category: _params.category };
                let params: Object = {
                    idInstitucion: _jsonRequest.idInstitucion,
                    idPais: _jsonRequest.idPais,
                    idProducto: _jsonRequest.idProducto,
                    fecha: _params.category,
                    tipoPeriodo: _jsonRequest.tipoPeriodo
                };
                this.ConsultarDatosCircular(params, _complementarios);
            }
        }
    }
    //Cargar tabla de los empleados
    private CargarTabla(_params) {
        this.vistaActual = 'thirdGraph';
        let _jsonRequest: any = this.jsonRequest;
        let params: any = {
            idInstitucion: null,
            idPais: null,
            idProducto: null,
            fecha: _params.date,
            status: this.CategoriaStatus(_params.categoria),
            codigo: _params.nameShort,
            tipoPeriodo: _jsonRequest.tipoPeriodo,
            pagina: 1
        };
        this.getAllObjectPaginate(params).subscribe(
            data => {
                let response = JSON.parse(JSON.stringify(data));
                this.pager = this.getPager(response.total, params.pagina, response.rango);
                this.addItemToArray(this.pager, response.consulta, response.rango, response.total);
                this.pagedItems = _.where(this.objectArrayPaginate, { page: this.pager.currentPage });
            }
        );
    }
    //Categorias
    private CategoriaStatus(id: String): Number {
        if (id === 'Perfilamiento') {
            return 1;
        } else if (id === 'Buró') {
            return 2;
        } else if (id === 'Tasa') {
            return 3;
        }
    }
    private Regresar(_vista: String): void {
        this.vistaActual = _vista;
        let data: any;
        if (_vista === '') {
            data = this.dataGraph.first;
            setTimeout(() => {
                this.graficaStock.CargarGrafica(data.data, data.conf);
            }, 0);
        } else if (_vista === 'secondGraph') {
            data = this.dataGraph.second;
            setTimeout(() => {
                this.graficaChart.CargarGrafica(data.data, data.conf);
            }, 0);
        }
    }
    //Cionsulta de informacion para la grafica circular
    private ConsultarDatosCircular(_params: Object, _complementarios: Object): void {
        super.loading(true);//Spinner CARGANDO
        let path: String = '/AsesorBig/api/credito/perfilamiento/grafica/rechazados';
        this.service.post(_params, path, 1).subscribe(
            data => {
                super.loading(false);
                let response = JSON.parse(JSON.stringify(data));
                if (response.codE === 0) {
                    let dataSend: any = this.AjustarGraficaCircular(response.jsonResultado, _complementarios);
                    this.Categorias = dataSend.data;
                    let confGraficaPie: ConfGraficaPie = {
                        type: 'pie',
                        nameCategory: '',
                        title: '',
                        subtitle: '',
                        tooltip: false,
                        dataLabels: false,
                        drilldown: true,
                        showLegends: false
                    };
                    //Guardadndo la informacion
                    this.dataGraph.second = {
                        data: dataSend.data,
                        conf: confGraficaPie
                    };
                    this.graficaChart.CargarGrafica(dataSend.data, confGraficaPie);
                } else {

                    this.notifications.info('La respuesta contiene algun fallo [' + response.msgE + ']');
                }
            },
            error => {
                super.loading(false);
            },
            () => super.loading(false)
        );
    }
    //Cambiar estatus de periodo
    private SetTipoPeriodo(_item): void {
        let mySwitchs: any = this.objTipoPeriodo;
        if (!mySwitchs[_item]) {
            mySwitchs.diario = false;
            mySwitchs.mensual = false;
            mySwitchs.anual = false;
            mySwitchs[_item] = true;
            this.objTipoPeriodo = mySwitchs;
            let json: any = this.jsonRequest;
            if (_item === 'diario') {
                json.tipoPeriodo = 1;
            } else if (_item === 'mensual') {
                json.tipoPeriodo = 2;
            } else if (_item === 'anual') {
                json.tipoPeriodo = 3;
            }
            this.jsonRequest = json;
            this.ConusmoServicioOtorgados(json);
        }
    }
    //Seleccionando tipo de producto
    private SeleccionarProducto(_item: any): void {
        if (_item !== undefined && _item !== null && _item !== "") {
            let json: any = this.jsonRequest;
            json.idProducto = _item;
            this.jsonRequest = json;
            this.ConusmoServicioOtorgados(json);
        }
    }
    //Selecciona y valida fechas
    private SeleccionandoFecha(_item: Date, type: String) {

        let json: any = this.jsonRequest;
        let consultar: Boolean = true;
        
        if (type === 'inicial') {
            json.fechaInicio = moment(_item).format('DD-MM-YYYY');
            this.minDate = _item;
        } else if (type === 'final') {
            this.maxDate = _item;
            json.fechaFin = moment(_item).format('DD-MM-YYYY');
        }
        this.jsonRequest = json;
        this.ConusmoServicioOtorgados(this.jsonRequest);
    }
    //Filttrado para las instituciones
    private filtrarInstituciones(val: string) {
        let instituciones: any[] = [];
            if (typeof (val) === 'string' && val.length > 2) {
                let handler: any = this.objFiltrosHandler;
                let params = { fcCadena: val, idProducto: this.idProducto };
                let path = "/AsesorBig/api/interno/instituciones/reportesDinamicos/instituciones/creditos";
                this.service.post(params, path, 1).subscribe(
                    data => {
                        let response: any = JSON.parse(JSON.stringify(data));
                        if (response.codE === 0) {
                            if (response.jsonResultado.length > 0) {
                                for (let inst of response.jsonResultado) {
                                    instituciones.push({ name: inst.nombre, idInst: inst.idInstitucion, idPais: inst.idPais });
                                }
                            } else {
                                handler.anyoneSearchResult = false;
                                handler.institucionSelected = false;
                            }
                            this.objFiltrosHandler = handler;
                        } else {
                            this.notifications.info('La respuesta contiene algun fallo [' + response.msgE + ']');
                            this.objFiltrosHandler = handler;
                        }
                    },
                    error => {
                        console.log("Ha ocurrido una falla en la peticion -> [" + error + "]");
                    }
                );
            }
            return instituciones;
    }
    //consumo de servicio para busqueda de productos
    private buscarProductos(institucion: any) {
        let json: any = this.jsonRequest;
        json.idPais = institucion.idPais;
        json.idInstitucion = institucion.idInst;
        this.jsonRequest = json;
        if (institucion !== null && institucion !== undefined) {
            let objRequest = { idInstitucion: institucion.idInst, idPais: institucion.idPais };
            let uriRequest = "/AsesorBig/api/interno/instituciones/promociones/productos";
            this.service.post(objRequest, uriRequest, 1).subscribe(
                data => {
                    let objServiceResponse: any = JSON.parse(JSON.stringify(data));
                    if (objServiceResponse.codE === 0) {
                        if (objServiceResponse.jsonResultado.length > 0) {
                            this.listaProductosInst = objServiceResponse.jsonResultado;
                            let _objFiltrosHandler: any = this.objFiltrosHandler;
                            _objFiltrosHandler.institucionSelected = true;
                            this.objFiltrosHandler = _objFiltrosHandler;
                            this.ConusmoServicioOtorgados(this.jsonRequest);
                        } else {
                            console.log("No se encontró ningun registro de productos");
                        }
                    } else {
                        this.notifications.info('La respuesta contiene algun fallo [' + objServiceResponse.msgE + ']');
                    }
                },
                error => {
                    console.log("Ha ocurrido una falla en la peticion -> [" + error + "]");
                }
            );
        }
    }
    asignarInstitucion(institucion: any) {
        if(super.isValid(institucion)) {
            
            let _json: any = this.jsonRequest;

            _json.idPais = institucion.idPais;
            _json.idInstitucion = institucion.idInst;
            _json.idProducto = parseInt(this.idProducto,0);
            _json.fechaInicio = this.fechaInicial;
            _json.fechaFin = this.fechaFinal;
            _json.fecha = null;

            this.jsonRequest = _json;
            
            this.ConusmoServicioOtorgados(this.jsonRequest);
        }
    }
    public getAllObjectPaginate = (params): Observable<Object> => {
        return Observable.create(observer => {
            super.loading(true);
            let path = '/AsesorBig/api/credito/perfilamiento/tabla/rechazados';
            this.service.post(params, path, 1).subscribe(
                data => {
                    let object = JSON.parse(JSON.stringify(data));
                    if (object.jsonResultado !== null) {
                        observer.next(object.jsonResultado);
                        observer.complete();
                    } else {
                        this.notifications.info('No se recibieron registros');
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
    private setPage(page: number, rango?: number, total?: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        let countPages = _.where(this.objectArrayPaginate, { page: page });
        if (countPages.length === 0) {
            let pagetoVisited = this.pageToVisited(page);
            this.getAllObjectPaginate(pagetoVisited).subscribe(
                data => {
                    let object = JSON.parse(JSON.stringify(data));
                    this.pager = this.getPager(object.total, page, object.rango);
                    this.addItemToArray(this.pager, object.consulta, object.rango, object.total);
                    this.pagedItems = _.where(this.objectArrayPaginate, { page: this.pager.currentPage });
                }
            );
        } else {
            this.pager = this.getPager(total, page, rango);
            this.pagedItems = _.where(this.objectArrayPaginate, { page: this.pager.currentPage });
        }

    }

}
