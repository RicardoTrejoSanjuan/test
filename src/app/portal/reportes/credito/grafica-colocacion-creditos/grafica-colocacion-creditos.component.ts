import { Component, AfterViewInit, ViewChild } from '@angular/core';

import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import * as moment from 'moment';

import { Router } from '@angular/router';

import { Service } from '../../../../service/service';

//import { ClassGenerica } from '../../../../classGeneric/config';
import { Pagination } from '../../../../classGeneric/pagination';
import { Notifications } from '../../../../classGeneric/notifications';

import * as _ from 'underscore';
import { Observable } from 'rxjs/Observable';

import { GraficaComponent } from '../../../../graficas-highchart/graficas-highchart.component';

import { ConfGraficaPie } from '../../../../interfaces/interfacesGraficas';
import { ConfGraficaColumn } from '../../../../interfaces/interfacesGraficas';
import { ConfStockColumn } from '../../../../interfaces/interfacesGraficas';
import { JsonToCsv } from '../../../../classGeneric/jsontocsv';

@Component({
    selector: 'reporte-colocacion-credito',
    templateUrl: 'grafica-colocacion-creditos.component.html',
    styleUrls: ['../../credito/credito.component.css']
})

export class ReporteColocacionCreditos extends Pagination implements AfterViewInit {

    menuLateral: Array<Object>;
    confGraficaPastel: ConfGraficaPie;
    confGraficaColumnas: ConfGraficaColumn;
    confStockColumn: ConfStockColumn;
    objServiceRequest: Object;
    objServiceResponse: Object;
    objFiltrosHandler: any;
    objAtributosTabla: Object;
    uriServiceRequest: String;
    listaInstituciones: any;
    listaProductosInst: any;
    institucionCtrl: FormControl;
    productSelected: any;
    minFechaGeneral: any;
    maxFechaGeneral: any;
    pager: any;
    pagedItems: any;
    filtroSelected: any;
    graficaSelected: any;
    productos: any;
    institucionSelected : boolean;
    idProducto : string;
    isAvailable : boolean;
    @ViewChild(GraficaComponent) grafica: GraficaComponent;

    constructor(private service: Service, private router: Router, private notifications: Notifications,private jsonToCsv : JsonToCsv) {
        super();

        this.pager = {};
        this.pagedItems = [];

        this.menuNavigation = this.menuNavigation();
        this.listaInstituciones = [];
        this.listaProductosInst = [];
        this.productSelected = "";
        this.filtroSelected = "INSTITUCION";
        this.graficaSelected = "pie";

        this.maxFechaGeneral = new Date();
        this.minFechaGeneral = new Date(2016, 0, 1);

        this.uriServiceRequest = "/AsesorBig/api/interno/instituciones/credito/solicitud/consulta";

        this.menuLateral = this.getMenuLateral(1);

        this.objFiltrosHandler = {
            showGraficaTabContent: true,
            showTablaTabContent: false,
            agrupamientoRequest: "INSTITUCION",
            agrupamientoCorrecto: "Institución",
            pageNumberRequest: null,
            idInstitucionSelected: null,
            idPaisInstSelected: null,
            idProductoInstSelected: null,
            fechaInicialBusqueda: null,
            fechaFinalBusqueda: null,
            buildPieChart: true,
            buildColumnsChart: false,
            anyoneSearchResult: false,
            institucionSelected: false
        };
        this.objAtributosTabla = {
            institucion: true,
            tasa: false,
            capital: false,
            sucursal: false,
            fechaliq: false,
            fechasur: false,
            asesor: false,
            periodo: false
        };
        this.idProducto="";
        this.isAvailable=true;
        this.institucionSelected=true;
        this.getProductos();
        this.institucionCtrl = new FormControl();
        this.listaInstituciones = this.institucionCtrl.valueChanges.startWith(null).map(name => this.filtrarInstituciones(name));
    }


    clickInstituciones(){
        if(this.isAvailable) {
            this.notifications.info("Selecciona un producto");
        }
    }

    onChange(){

        if (this.idProducto!=="") {
            this.isAvailable=false;

            let _objFiltrosHandler: any = this.objFiltrosHandler;
            
            _objFiltrosHandler.idProductoInstSelected = parseInt(this.idProducto,0);
            
            this.objFiltrosHandler = _objFiltrosHandler;

            super.loading(true);
            this.realizarPeticionHttp();

        }else{

            this.isAvailable=true;

            let _objFiltrosHandler: any = this.objFiltrosHandler;
            _objFiltrosHandler.idInstitucionSelected = null;
            _objFiltrosHandler.idPaisInstSelected = null;
            _objFiltrosHandler.idProductoInstSelected = null;
            _objFiltrosHandler.fechaInicialBusqueda = null;
            _objFiltrosHandler.fechaFinalBusqueda = null;
            _objFiltrosHandler.showGraficaTabContent = true;
            _objFiltrosHandler.agrupamientoRequest = "INSTITUCION";
            _objFiltrosHandler.pageNumberRequest = null;
            this.objFiltrosHandler = _objFiltrosHandler;

            this.institucionCtrl = new FormControl();
            this.listaInstituciones = this.institucionCtrl.valueChanges.startWith(null).map(name => this.filtrarInstituciones(name));

            super.loading(true);
            this.realizarPeticionHttp();
        }
    }

    getProductos(){
        let objRequest = { "idInstitucion":null, "idPais":null };
        let uriRequest = "/AsesorBig/api/interno/instituciones/reportesProductos/instituciones/creditos";
        this.service.post(objRequest, uriRequest, 1).subscribe(
            data => {
                   let object = JSON.parse(JSON.stringify(data));
                   /*console.log("funcion get productos");*/
                   this.productos=object.jsonResultado;
                   /*console.log(this.productos);*/
            },
            error => {
                this.notifications.error('Consulta de instituciones', error);
            },
            () => super.loading(false)
        );
    }

    asignarRangoFechas() {

        let _objFiltrosHandler: any = this.objFiltrosHandler;

        _objFiltrosHandler.idProductoInstSelected = parseInt(this.idProducto,0);

        if (_objFiltrosHandler.fechaInicialBusqueda !== null && _objFiltrosHandler.fechaFinalBusqueda !== null) {

            if (!moment(_objFiltrosHandler.fechaFinalBusqueda).isBefore(moment(_objFiltrosHandler.fechaInicialBusqueda))) {
                super.loading(true);
                this.realizarPeticionHttp();
            } else {
                this.notifications.info('Rango de fechas', 'La fecha final debe ser mayor a la inicial');
            }
        }
    }
    ngAfterViewInit() {
        this.obtenerDatosGrafica();
    }
    filtrarInstituciones(val: string) {

        if (this.idProducto===undefined || this.idProducto==="") {
             this.notifications.info('Seleccione un producto');
        } else {

        let instituciones: any[] = [];

        if (super.isValid(val)) {

            let _objFiltrosHandler: any = this.objFiltrosHandler;

            _objFiltrosHandler.anyoneSearchResult = false;

            if (val.length > 2) {

                super.loading(true);

                let objRequest = { fcCadena: val, idProducto:this.idProducto };
                let uriRequest = "/AsesorBig/api/interno/instituciones/reportesDinamicos/instituciones/creditos";

                this.service.post(objRequest, uriRequest, 1).subscribe(
                    data => {

                        let objServiceResponse: any = JSON.parse(JSON.stringify(data));

                        if (objServiceResponse.codE === 0) {

                            if (objServiceResponse.jsonResultado.length > 0) {

                                for (let inst of objServiceResponse.jsonResultado) {
                                    instituciones.push({ name: inst.nombre, idInst: inst.idInstitucion, idPais: inst.idPais });
                                }

                            } else {
                                _objFiltrosHandler.anyoneSearchResult = true;
                                _objFiltrosHandler.institucionSelected = false;
                                /*this.notifications.info("Consulta de instituciones","La consulta no arrojo ningun resultado");*/
                            }

                        } else {
                            //console.log("La respuesta contiene algun fallo -> [" + objServiceResponse.msgE + "]");
                            this.notifications.info('Consulta de instituciones', objServiceResponse.msgE);
                            _objFiltrosHandler.institucionSelected = false;
                        }
                    },
                    error => {
                        //console.log("Ha ocurrido una falla en la peticion -> [" + error + "]");
                        this.notifications.error('Consulta de instituciones', error);
                    },
                    () => super.loading(false)
                );
            } else {
                _objFiltrosHandler.institucionSelected = false;
            }

            this.objFiltrosHandler = _objFiltrosHandler;
        }

        return instituciones;
        }
    }
    buscarProductos(institucion: any) {

        console.log(institucion);
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
                            _objFiltrosHandler.idInstitucionSelected = institucion.idInst;
                            _objFiltrosHandler.idPaisInstSelected = institucion.idPais;

                            this.objFiltrosHandler = _objFiltrosHandler;

                            this.realizarPeticionHttp();
                        } else {
                            //console.log("No se encontró ningun registro de productos");
                            this.notifications.info('Consulta de productos', objServiceResponse.msgE);
                        }

                    } else {
                        //console.log("La respuesta contiene algun fallo -> [" + objServiceResponse.msgE + "]");
                        this.notifications.info('Consulta de productos', objServiceResponse.msgE);
                    }
                },
                error => {
                    //console.log("Ha ocurrido una falla en la peticion -> [" + error + "]");
                    this.notifications.info('Consulta de productos', error);
                }
            );
        }
    }

    asignarInstitucion(institucion: any) {
        if(super.isValid(institucion)) {
            /*console.log(institucion);*/
            let _objFiltrosHandler: any = this.objFiltrosHandler;
            _objFiltrosHandler.idInstitucionSelected = institucion.idInst;
            _objFiltrosHandler.idPaisInstSelected = institucion.idPais;
            _objFiltrosHandler.idProductoInstSelected = parseInt(this.idProducto,0);
            this.objFiltrosHandler = _objFiltrosHandler;
            super.loading(true);
            this.realizarPeticionHttp();
        }else {
            console.log("La institucion no es valida");
        }
    }

    asignarProducto(producto: any) {

        if (producto !== null && producto !== undefined && producto !== "") {
            let _objFiltrosHandler: any = this.objFiltrosHandler;
            _objFiltrosHandler.idProductoInstSelected = producto;
            this.objFiltrosHandler = _objFiltrosHandler;
            super.loading(true);
            this.realizarPeticionHttp();
        }
    }
    asignarAgrupamiento(radio: any) {
        /*console.log(radio);*/
        let _agrupamientoRequest: any = this.objFiltrosHandler;
        _agrupamientoRequest.agrupamientoRequest = radio.target.defaultValue;
        _agrupamientoRequest.agrupamientoCorrecto = radio.target.id;
        this.filtroSelected = radio.target.defaultValue;
        this.objFiltrosHandler = _agrupamientoRequest;

        this.obtenerDatosGrafica();
    }
    asignarTabContent(tabIndex: any) {

        if (tabIndex === 0) {
            let _objFiltrosHandler: any = this.objFiltrosHandler;
            _objFiltrosHandler.showGraficaTabContent = true;
            _objFiltrosHandler.showTablaTabContent = false;
            // _objFiltrosHandler.buildPieChart = true;
            // _objFiltrosHandler.buildColumnsChart = false;
            this.objFiltrosHandler = _objFiltrosHandler;
            this.obtenerDatosGrafica();

        } else {
            let _objFiltrosHandler: any = this.objFiltrosHandler;
            _objFiltrosHandler.showTablaTabContent = true;
            _objFiltrosHandler.showGraficaTabContent = false;
            this.objFiltrosHandler = _objFiltrosHandler;

            this.setPage(1);
        }
    }
    obtenerDatosGrafica() {
        this.resetPaginator();
        this.pager.totalPages = 1;
        super.loading(true);
        this.realizarPeticionHttp();
    }
    construirGrafica() {

        let _objFiltrosHandler: any = this.objFiltrosHandler;

        if (_objFiltrosHandler.buildPieChart) {
            this.dibujarGraficaPie(this.objServiceResponse);
        } else {
            this.dibujarGraficaColumn(this.objServiceResponse);
        }
    }
    asignarTipoGrafica(radio: any) {

        let tipoGrafica: any = radio.target.defaultValue;
        let _graficaRequest: any = this.objFiltrosHandler;
        this.graficaSelected = radio.target.defaultValue;

        if (tipoGrafica === 'pie') {
            _graficaRequest.buildPieChart = true;
            _graficaRequest.buildColumnsChart = false;
        } else if (tipoGrafica === 'columns') {
            _graficaRequest.buildPieChart = false;
            _graficaRequest.buildColumnsChart = true;
        } else {
            console.log("No fue posible generar el tipo de grafica solicitado");
        }

        this.construirGrafica();
    }
    realizarPeticionHttp() {

        let _objFiltrosHandler: any = this.objFiltrosHandler;

        let fechaI: any = _objFiltrosHandler.fechaInicialBusqueda !== null ? moment(_objFiltrosHandler.fechaInicialBusqueda).format("DD-MM-YYYY") : null;
        let fechaF: any = _objFiltrosHandler.fechaFinalBusqueda !== null ? moment(_objFiltrosHandler.fechaFinalBusqueda).format("DD-MM-YYYY") : null;

        this.objServiceRequest = {
            idInstitucion: _objFiltrosHandler.idInstitucionSelected,
            idPais: _objFiltrosHandler.idPaisInstSelected,
            idProducto: _objFiltrosHandler.idProductoInstSelected,
            fechaInicio: fechaI,
            fechaFin: fechaF,
            grafica: _objFiltrosHandler.showGraficaTabContent ? 1 : 0,
            tipoGrafica: _objFiltrosHandler.agrupamientoRequest,
            pagina: _objFiltrosHandler.pageNumberRequest
        };
        console.log(this.objServiceRequest);
        this.service.post(this.objServiceRequest, this.uriServiceRequest, 1).subscribe(
            data => {

                let objServiceResponse: any = JSON.parse(JSON.stringify(data));
                console.log(objServiceResponse);
                if (objServiceResponse.codE === 0) {
                    if (objServiceResponse.jsonResultado.length > 0) {
                        this.objServiceResponse = objServiceResponse;
                        this.construirGrafica();
                    } else {
                        //console.log("No se encontró ninguna coincidencia");
                        this.notifications.info('Consulta de créditos', objServiceResponse.msgE);
                        this.resetPaginator();
                        this.pager.totalPages = 1;
                    }
                } else {
                    //console.log("La respuesta contiene algun fallo -> [" + objServiceResponse.msgE + "]");
                    this.notifications.info('Consulta de créditos', objServiceResponse.msgE);
                }
            },
            error => {
                //console.log("Ha ocurrido una falla en la peticion -> [" + error + "]");
                this.notifications.info('Consulta de créditos', error);
            },
            () => super.loading(false)
        );
    }
    dibujarGraficaPie(responseService: any) {

        let graficaData: any[] = [];
        let valoresOrdenados: number[] = [];
        let valoresDesordenados: number[] = [];

        for (let credito of responseService.jsonResultado) {
            valoresDesordenados.push(credito.total);
        }

        valoresOrdenados = this.ordenarDatosDescendente(valoresDesordenados);
        /*console.log("Datos ordenados -> ", valoresOrdenados);*/

        let obj: any = responseService.jsonResultado;

        for (let i = 0; i <= (valoresOrdenados.length - 1); i++) {
            for (let j = 0; j <= (obj.length - 1); j++) {
                if (obj[j].total === valoresOrdenados[i]) {
                    graficaData.push({ name: obj[j].descripcion, y: valoresOrdenados[i] });
                    break;
                }
            }
        }

        let _agrupamiento: any = this.objFiltrosHandler;
        
        this.confGraficaPastel = {
            type: 'pie',
            title: _agrupamiento.agrupamientoCorrecto,
            subtitle: '',
            nameCategory: "Creditos",
            tooltip: true,
            dataLabels: false,
            drilldown: false,
            showLegends: true
        };

        setTimeout(() => {
            this.grafica.CargarGrafica(graficaData, this.confGraficaPastel);
        }, 0);

    }
    dibujarGraficaColumn(responseService: any) {
        


        let graficaData: any[] = [];
        let valoresOrdenados: number[] = [];
        let valoresDesordenados: number[] = [];
        let graficaCategorias: any[] = [];

        let dataGeneralGrafica: any[] = [];
        let confGeneralGrafica: object = {};

        let obj: any = responseService.jsonResultado;

        for (let credito of responseService.jsonResultado) {
            valoresDesordenados.push(credito.total);
        }

        valoresOrdenados = this.ordenarDatosDescendente(valoresDesordenados);
        // console.log("Datos ordenados -> ",valoresOrdenados);


        for (let i = 0; i <= (valoresOrdenados.length - 1); i++) {
            for(let j = 0; j <= (obj.length - 1); j++) {
                if(obj[j].total === valoresOrdenados[i]){
                    /*if(obj !== null && obj.length < 20) {*/
                        /*graficaData.push({name: obj[j].descripcion,data: [valoresOrdenados[i]]});*/
                    /*}else {*/
                        graficaCategorias.push(obj[j].descripcion);
                    /*}*/
                    break;
                }
            }
        }
        
/*
        this.confGraficaColumnas = {
            type: 'column',
            title: '',
            subtitle: '',
            categories: [""],
            titleCategories: '',
            titleVertical: "Cantidad de creditos (#)",
            valueSuffix: ' creditos',
            allowDecimals: true,
            drilldown: false,
            pointPadding: 50,
            showLegends: true,
            formatLabel: '',
            tooltip: false
        };*/

         let _agrupamiento: any = this.objFiltrosHandler;

        this.confStockColumn = {
            type: 'highstock',
            subType: 'simple',
            title: _agrupamiento.agrupamientoCorrecto,
            subtitle: '',
            navigator: false,
            scrollbar: (obj !== null && obj.length < 10) ? false : true,
            categories: graficaCategorias,
            minCategories: (obj !== null && obj.length < 10) ? 0 : obj.length - 10,
            allowDecimals: false,
            minyAxis: 0,
            titleCategoriesVertical: 'Cantidad de creditos (#)',
            pointWidth: 40,
            pointPadding: 10,
            drilldown: false,
            formatLabel: ''
        };

        dataGeneralGrafica = [{name: 'Cantidad de créditos', data: valoresOrdenados}];
        confGeneralGrafica = this.confStockColumn;

        /*if(obj !== null && obj.length < 20) {
            setTimeout(() => {
                this.grafica.CargarGrafica(graficaData, this.confGraficaColumnas);
            }, 0);
            dataGeneralGrafica = graficaData;
            confGeneralGrafica = this.confGraficaColumnas;
        } else {
            setTimeout(() => {
                this.grafica.CargarGrafica([{name: 'Créditos', data: valoresOrdenados}], this.confStockColumn);
            }, 0);
            dataGeneralGrafica = [{name: 'Créditos', data: valoresOrdenados}];
            confGeneralGrafica = this.confStockColumn;
        }*/

        setTimeout(() => {
                this.grafica.CargarGrafica(dataGeneralGrafica,confGeneralGrafica);
        }, 0);

    }
    setPage(page: number, rango?: number, total?: number) {
        /*console.log("Paginas totales: ", this.pager);*/
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        let countPages = _.where(this.objectArrayPaginate, { page: page });
        /*console.log("Paginas activas: ", countPages);*/
        if (countPages.length === 0) {

            let pagetoVisited = this.pageToVisited(page);

            let _objFiltrosHandler: any = this.objFiltrosHandler;

            let fechaI: any = _objFiltrosHandler.fechaInicialBusqueda !== null ? moment(_objFiltrosHandler.fechaInicialBusqueda).format("DD-MM-YYYY") : null;
            let fechaF: any = _objFiltrosHandler.fechaFinalBusqueda !== null ? moment(_objFiltrosHandler.fechaFinalBusqueda).format("DD-MM-YYYY") : null;

            this.objServiceRequest = {
                idInstitucion: _objFiltrosHandler.idInstitucionSelected,
                idPais: _objFiltrosHandler.idPaisInstSelected,
                idProducto: _objFiltrosHandler.idProductoInstSelected,
                fechaInicio: fechaI,
                fechaFin: fechaF,
                grafica: _objFiltrosHandler.showGraficaTabContent ? 1 : 0,
                tipoGrafica: _objFiltrosHandler.agrupamientoRequest,
                pagina: pagetoVisited
            };
            
            this.getAllObjectPaginate(pagetoVisited).subscribe(
                data => {
                    let object = JSON.parse(JSON.stringify(data));
                    this.pager = this.getPager(object.numeroCredito, page, object.rango);
                    this.addItemToArray(this.pager, object.jsonResultado, object.rango, object.numeroCredito);
                    this.pagedItems = _.where(this.objectArrayPaginate, { page: this.pager.currentPage });
                },
            );

        } else {
            console.log("No debe hacer consulta");
            this.pager = this.getPager(total, page, rango);
            this.pagedItems = _.where(this.objectArrayPaginate, { page: this.pager.currentPage });
        }

    }

    public getAllObjectPaginate = (page): Observable<Object> => {
        return Observable.create(
            observer => {
                super.loading(true);
                let request: any = this.objServiceRequest;
                request.pagina = page;
                this.service.post(request, this.uriServiceRequest, 1).subscribe(
                    data => {

                        let response = JSON.parse(JSON.stringify(data));
                        if (response.codE === 0) {

                            if (response.jsonResultado !== null && response.jsonResultado.length > 0) {
                                observer.next(response);
                                observer.complete();
                            } else {
                                this.notifications.info("Consulta de instituciones", response.msgE);
                            }

                        } else {
                            //console.log("Resultado imposible de obtener !!!");
                            this.notifications.error("Consulta de instituciones", response.msgE);
                        }
                    },
                    error => {
                        super.loading(false);
                        observer.next(null);
                        observer.complete();
                        this.notifications.error("Consulta de instituciones", error);
                    }, () => super.loading(false)
                );
            }
        );
    }
    private getAll(): void{
    super.loading(true);
    let path =  this.uriServiceRequest;
    let _objFiltrosHandler: any = this.objFiltrosHandler;

    let fechaI: any = _objFiltrosHandler.fechaInicialBusqueda !== null ? moment(_objFiltrosHandler.fechaInicialBusqueda).format("DD-MM-YYYY") : null;
    let fechaF: any = _objFiltrosHandler.fechaFinalBusqueda !== null ? moment(_objFiltrosHandler.fechaFinalBusqueda).format("DD-MM-YYYY") : null;
    let object: any = {
                idInstitucion: _objFiltrosHandler.idInstitucionSelected,
                idPais: _objFiltrosHandler.idPaisInstSelected,
                idProducto: _objFiltrosHandler.idProductoInstSelected,
                fechaInicio: fechaI,
                fechaFin: fechaF,
                grafica: 0,
                tipoGrafica: null,
                pagina: null
            };
            console.log(object);
        this.service.post(object, path, 1).subscribe(
        data => {
            let object = JSON.parse(JSON.stringify(data));
            if (object.codE === 0) {
                this.jsonToCsv.generateToExcel(object.jsonResultado,'reportes');
            }else{
                this.notifications.info("Descarga de excel", object.msgE);
            }
        },
        error => {
            super.loading(false);
            this.notifications.error('Error de servicio');
        },
        () => super.loading(false)
    );
    
  }
  
}