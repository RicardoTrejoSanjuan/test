/*
 * @version 1.0 (16-06-2017)
 * @author lfgonzalezr
 * @description Graficas de credito general
 * @contributors Front-end team
 */
import { Component, AfterViewInit, ViewChild } from '@angular/core';
//Importacion clase generica
import { ClassGenerica } from '../../../../classGeneric/config';
//Importacion de servicio para el consumo de servicios
import { Service } from '../../../../service/service';
//Importacion de la clase de garfica
import { GraficaComponent } from '../../../../graficas-highchart/graficas-highchart.component';
//Importacion de interfaces
import { ConfGraficaPie } from '../../../../interfaces/interfacesGraficas';
import { ConfGraficaColumn } from '../../../../interfaces/interfacesGraficas';
import { ConfGraficaLine } from '../../../../interfaces/interfacesGraficas';
import { ConfGraficaPercent } from '../../../../interfaces/interfacesGraficas';
//Importacion de la paleta de colores
import { GRAFICAS } from '../../../../constants/graficas';
import { Pagination } from '../../../../classGeneric/pagination';
import { Observable } from 'rxjs/Observable';
import * as _ from 'underscore';
import { Router } from '@angular/router';

@Component({
    selector: 'reportes-credito',
    templateUrl: 'grafica-credito-general.component.html',
    styleUrls: ['../../credito/credito.component.css']
})

export class ReportesCreditoGeneral extends Pagination implements AfterViewInit {
    //Arreglo para el menu lateral
    menuLateral: Array<Object>;
    //Paleta de Colres para la tabla de estatus
    paletaColores: string[];
    //Data para generar las tabla de estatus
    Categorias: Object[];
    //Declaracion de las variables que tendran instancias de graficas highchart
    totalCreditos: number;
    //Declaracion de array de vistas
    arrVistas: string[];
    //Vista activa
    vista: string;
    //Objeto con informacion descargada
    objData: Object;
    //tabs
    tabs: string;
    //Arreglo de vistas
    arrTabs: string[];
    //status de la busqueda
    statusBusqueda: number;
    //dInstitucion de la empresa
    dataQueryTable: Object;
    //Tabla de empleados
    dataTable: Object[];
    //Bandera la la visibilidad del boton regresar
    btnRegresar: Boolean;

    nombrePes: string[];
    numeroPes: number;
    nombreInst: string;
    estatusCreditos: string;

    pager: any = {};
    pagedItems: any[];
    empleados: any;
    showOtorgados: boolean;

    @ViewChild('graficaTotalCreditos') graficaTotalCreditos: GraficaComponent;
    @ViewChild('graficaInstituciones') graficaInstituciones: GraficaComponent;
    @ViewChild('graficaCreditoBalance') graficaCreditoBalance: GraficaComponent;
    @ViewChild('graficaCreditoDetalle') graficaCreditoDetalle: GraficaComponent;
    @ViewChild('graficaEmpleadosPorInstitucion') graficaEmpleadosPorInstitucion: GraficaComponent;
    @ViewChild('graficaDetallesPorEstatus') graficaDetallesPorEstatus: GraficaComponent;
    @ViewChild('graficaBalancePorEstatus') graficaBalancePorEstatus: GraficaComponent;

    constructor(private service: Service, private router: Router) {
        super();
        super.loading(true);//Spinner CARGANDO
        this.menuLateral = this.getMenuLateral(1);
        this.paletaColores = GRAFICAS.PALETA_COLORES;
        this.arrVistas = [];
        this.objData = {};
        this.vista = 'totalCreditos';
        this.arrTabs = [];
        this.statusBusqueda = 0;
        this.dataQueryTable = {};
        this.menuNavigation = this.menuNavigation();
        this.dataTable = [];
        this.btnRegresar = false;
        this.showOtorgados = false;
        this.nombrePes = ["Créditos"];
        this.numeroPes = 0;
        this.nombreInst = '';
        this.estatusCreditos = '';
        let pathredirec = JSON.parse(JSON.stringify(this.menuLateral[0])).url;
        this.router.navigate([pathredirec]);
    }

    private Regresar() {
        this.vista = this.arrVistas.pop();
        this.nombrePes.pop();
        this.btnRegresar = this.arrVistas.length > 0 ? true : false;
        this.numeroPes--;
        console.log(this.vista);
        switch (this.vista) {
            case 'totalCreditos':
                let _objData: any = this.objData[this.vista];
                setTimeout(() => {
                    this.graficaTotalCreditos.CargarGrafica(_objData.data, _objData.conf);
                }, 0);
                break;
            case 'tabsGraficasGral':
                let _item: string = this.arrTabs.pop();
                this.setTab(_item);
                break;
            case 'empleadosPorInstitucion':
                let grap1: any = this.objData['empleadosPorInstitucionGrap1'];
                let grap2: any = this.objData['empleadosPorInstitucionGrap2'];
                let grap3: any = this.objData['empleadosPorInstitucionGrap3'];
                setTimeout(() => {
                    this.graficaEmpleadosPorInstitucion.CargarGrafica(grap1.data, grap1.conf);
                    this.graficaCreditoBalance.CargarGrafica(grap2.data, grap2.conf);
                    this.graficaCreditoDetalle.CargarGrafica(grap3.data, grap3.conf);
                }, 0);
                super.resetPaginator();
                break;
        }
    }

    private CountTotalCreditos(_params) {
        let count: number = 0;
        for (let item of _params) {
            count += item.y;
        }
        return count;
    }

    //Set Tabs
    private setTab(_type: string, _params?: any) {
        this.tabs = _type;
        this.arrTabs.pop();
        this.arrTabs.push(_type);
        if (_type === 'creditosPorInstitucion') {
            if (_params !== undefined) {
                this.creditosPorInstitucion(_params);
            } else {
                let _data: any = this.objData[_type];
                setTimeout(() => {
                    this.graficaInstituciones.CargarGrafica(_data.data, _data.conf);
                }, 0);
            }
        } else {
            let _detalleCredito: any = this.objData['detalleCredito'];
            let _detalleBalance: any = this.objData['detalleBalance'];
            if (_detalleCredito === undefined) {
                this.detalleCredito(null, null, true);
            } else {
                setTimeout(() => {
                    this.graficaCreditoDetalle.CargarGrafica(_detalleCredito.data, _detalleCredito.conf);
                }, 0);
            }
            if (_detalleBalance === undefined) {
                this.detalleBalance(null, null, true);
            } else {
                setTimeout(() => {
                    this.graficaCreditoBalance.CargarGrafica(_detalleBalance.data, _detalleBalance.conf);
                }, 0);
            }
        }
    }

    //Consulta y muestra las primeras graficas //Muestra los Tabs
    private MostraTabsGraficas(_params) {
        if (_params !== undefined && _params !== null && _params !== '') {
            this.btnRegresar = true;
            this.arrVistas.push(this.vista);
            this.estatusCreditos = _params.name;
            let sufix = (_params.idStatus !== 3) ? 'S' : '';
            this.nombrePes.push("Créditos " + this.estatusCreditos + sufix);
            this.numeroPes++;
            this.vista = 'tabsGraficasGral';
            //Primera grafica
            this.arrTabs.push('creditosPorInstitucion');
            this.setTab('creditosPorInstitucion', _params);
        }
    }

    //Mostrar empleados por institucion
    private MostarEmpleadosPorInstitucion(_params) {
        if (_params !== undefined) {
            let params: any = _params.series.options;
            this.arrVistas.push(this.vista);
            this.nombreInst = params.name;
            this.nombrePes.push(this.nombrePes[this.numeroPes] + " de " + this.nombreInst);
            this.numeroPes++;
            this.vista = 'empleadosPorInstitucion';
            this.dataQueryTable = {
                idInstitucion: params.idInstitucion,
                idPais: params.idPais
            };
            this.empleadosPorInstitucion(params.idInstitucion, params.idPais);
            this.detalleCredito(params.idInstitucion, params.idPais, false);
            this.detalleBalance(params.idInstitucion, params.idPais, false);
        }
    }

    private MostrarDetalleCredito(_params) {
        if (_params !== undefined && _params !== null && _params !== '') {
            let type: String = _params.series.name;
            this.nombrePes.push("Detalle de crédito del " + type + " " + this.estatusCreditos);
            this.numeroPes++;
            this.arrVistas.push(this.vista);
            this.vista = 'consultaDetallesPorEstatus';
            this.consultaDetallesPorEstatus(type);
        }
    }

    private MostrarBalanceCredito(_params) {
        if (_params !== undefined && _params !== null && _params !== '') {
            this.arrVistas.push(this.vista);
            this.nombrePes.push(_params.category + " por instituciones");
            this.numeroPes++;
            this.vista = 'consultaBalancePorEstatus';
            this.consultaBalancePorEstatus();
        }
    }

    private MostrarTablaEmpleados(_params) {
        if (_params !== undefined && _params !== null && _params !== '') {
            this.arrVistas.push(this.vista);
            this.nombrePes.push("Lista de empleados de " + this.nombreInst + " por créditos " + _params.series.name);
            this.numeroPes++;
            this.empleados = _params;
            console.log(this.empleados);
            this.setPage(1);
            console.log("Termina de settear pagina");
            super.resetPaginator();
            console.log("Termina de resettear el paginador");
        }
    }

    private eventoNuevo(_params) {
        //funcion para nuevos eventos
    }

    ngAfterViewInit() {
        let path: string = "/AsesorBig/consultaEstatusCredito";
        let params: Object = {
            idInstitucion: null,
            idPais: null
        };
        this.service.post(params, path, 1).subscribe(
            data => {
                let response: any = JSON.parse(JSON.stringify(data));
                if (response.codE === 0) {
                    this.Categorias = JSON.parse(JSON.stringify(response.jsonResultado));
                    this.totalCreditos = this.CountTotalCreditos(response.jsonResultado);
                    let titulo: string = 'Total de Créditos: ' + this.totalCreditos;
                    let confGraficaPie: ConfGraficaPie = {
                        type: 'pie',
                        nameCategory: 'Porc',
                        title: titulo,
                        subtitle: '',
                        tooltip: true,
                        dataLabels: false,
                        drilldown: true,
                        showLegends: false
                    };
                    this.objData['totalCreditos'] = { data: response.jsonResultado, conf: confGraficaPie };
                    this.graficaTotalCreditos.CargarGrafica(response.jsonResultado, confGraficaPie);
                }
            },
            error => {
                console.log('Error del servidor');
            },
            () => super.loading(false) //Spinner CERRAR CARGANDO
        );
    }

    private creditosPorInstitucion(_params) {
        let path: string = "/AsesorBig/creditosPorInstitucion";
        let params: Object = { idStatus: _params.idStatus };
        this.statusBusqueda = _params.idStatus;
        console.log(_params);
        super.loading(true);//Spinner CARGANDO
        this.service.post(params, path, 1).subscribe(
            data => {
                let response: any = JSON.parse(JSON.stringify(data));
                let count: Number = 0;
                for (let item of response.jsonResultado) {
                    count += item.data[0];
                }
                let sufix = (_params.idStatus !== 3) ? 'S' : '';
                let titleGraph: string = count + ' CRÉDITOS ' + _params.name + '' + sufix;
                if (response.codE === 0) {
                    let confGraficaColumn: ConfGraficaColumn = {
                        type: 'column',
                        title: titleGraph,
                        subtitle: '',
                        categories: [''],
                        titleCategories: '',
                        titleVertical: '',
                        valueSuffix: '',
                        allowDecimals: false,
                        drilldown: true,
                        pointPadding: 10,
                        showLegends: true,
                        formatLabel: '',
                        tooltip: true
                    };
                    this.objData['creditosPorInstitucion'] = { data: response.jsonResultado, conf: confGraficaColumn };
                    this.graficaInstituciones.CargarGrafica(response.jsonResultado, confGraficaColumn);
                }
            },
            error => {
                console.log('Error del servidor');
            },
            () => super.loading(false) //Spinner CERRAR CARGANDO
        );
    }

    private empleadosPorInstitucion(_idInstitucion: any, _idPais: any) {
        let path: string = "/AsesorBig/empleadosPorInstitucion";
        let params: Object = {
            idInstitucion: _idInstitucion,
            idPais: _idPais,
            idProducto: null
        };
        super.loading(true);
        this.service.post(params, path, 1).subscribe(
            data => {
                let response: any = JSON.parse(JSON.stringify(data));
                 for (var index = 0; index < response.jsonResultado.series.length; index++) {
                    if(response.jsonResultado.series[index].name==="sinposibilidad"){
                        response.jsonResultado.series[index].name = "sin posibilidad";
                    }
                }
                if (response.codE === 0) {
                    let confGraficaPercent: ConfGraficaPercent = {
                        type: 'percent',
                        title: 'Estado de Créditos de los Empleados',
                        subtitle: '',
                        categories: [''],
                        titleCategories: '',
                        drilldown: true,
                        horizontal: true,
                        tooltipShared: false,
                        widthBar: 50
                    };
                    this.objData['empleadosPorInstitucionGrap1'] = { data: response.jsonResultado.series, conf: confGraficaPercent };
                    this.graficaEmpleadosPorInstitucion.CargarGrafica(response.jsonResultado.series, confGraficaPercent);
                }
            },
            error => {
                console.log('Error del servidor');
            },
            () => super.loading(false) //Spinner CERRAR CARGANDO
        );
    }

    private detalleBalance(_idInstitucion: any, _idPais: any, _type: boolean) {
        let path: string = "/AsesorBig/detalleBalance";
        let params: Object = {
            idInstitucion: _idInstitucion,
            idPais: _idPais,
            idStatus: this.statusBusqueda
        };
        super.loading(true);//Spinner CARGANDO
        this.service.post(params, path, 1).subscribe(
            data => {
                let response: any = JSON.parse(JSON.stringify(data));
                if (response.codE === 0) {
                    let categories: any[] = [];
                    let catValores: any[] = [];
                    for (let balance of response.jsonResultado) {
                        if (balance.name==="Interes Pagado") {
                            balance.name="Interés Pagado";
                        }
                        categories.push(balance.name);
                        catValores.push(balance.data[0]);
                    }
                    let confGraficaLine: ConfGraficaLine = {
                        type: 'line',
                        title: 'Balance',
                        subtitle: null,
                        categories: categories,
                        titleScale: "Cantidad monetaria ($)",
                        drilldown: true,
                        showLegends: false
                    };

                    if (_type) {
                        console.log("balance 1");
                        this.objData['detalleBalance'] = { data: [{ name: "Créditos", data: catValores }], conf: confGraficaLine };
                    } else {
                        console.log("balance 2");
                        this.objData['empleadosPorInstitucionGrap2'] = { data: [{ name: "Créditos", data: catValores }], conf: confGraficaLine };
                    }
                    this.graficaCreditoBalance.CargarGrafica([{ name: "Créditos", data: catValores }], confGraficaLine);
                }
            },
            error => {
                console.log('Error del servidor');
            },
            () => super.loading(false) //Spinner CERRAR CARGANDO
        );
    }

    private detalleCredito(_idInstitucion: String, _idPais: String, _type: Boolean) {
        let path: string = "/AsesorBig/detalleCredito";
        let params: Object = {
            idInstitucion: _idInstitucion,
            idPais: _idPais,
            idStatus: this.statusBusqueda
        };
        super.loading(true);//Spinner CARGANDO
        this.service.post(params, path, 1).subscribe(
            data => {
                //this.objJsonRequest['detalleCredito'] = params;
                let response: any = JSON.parse(JSON.stringify(data));
                if (response.codE === 0) {
                    console.log(response.jsonResultado);
                    for (var index = 0; index < response.jsonResultado.length; index++) {
                        if(response.jsonResultado[index].name==="Interes"){
                            response.jsonResultado[index].name = "Interés";
                        }
                    }
                    let confGraficaColumn: ConfGraficaColumn = {
                        type: 'column',
                        title: 'Detalle de Crédito',
                        subtitle: '',
                        categories: [''],
                        titleCategories: '',
                        titleVertical: '',
                        valueSuffix: '',
                        allowDecimals: false,
                        drilldown: false,
                        pointPadding: 10,
                        showLegends: true,
                        formatLabel: ' $ ',
                        tooltip: true
                    };
                    //detalleCredito
                    if (_type) {
                        this.objData['detalleCredito'] = { data: response.jsonResultado, conf: confGraficaColumn };
                    } else {
                        this.objData['empleadosPorInstitucionGrap3'] = { data: response.jsonResultado, conf: confGraficaColumn };
                    }
                    this.graficaCreditoDetalle.CargarGrafica(response.jsonResultado, confGraficaColumn);
                }
            },
            error => {
                console.log('Error del servidor');
            },
            () => super.loading(false) //Spinner CERRAR CARGANDO
        );
    }

    private consultaDetallesPorEstatus(_type: String) {
        let path: string = "/AsesorBig/consultaDetallesPorEstatus";
        let params: Object = {
            idStatus: this.statusBusqueda,
            tipo: _type
        };
        super.loading(true);
        this.service.post(params, path, 1).subscribe(
            data => {
                let response: any = JSON.parse(JSON.stringify(data));
                if (response.codE === 0) {
                    let confGraficaColumn: ConfGraficaColumn = {
                        type: 'column',
                        title: '',
                        subtitle: '',
                        categories: [''],
                        titleCategories: '',
                        titleVertical: 'No. de Créditos',
                        valueSuffix: '',
                        allowDecimals: false,
                        drilldown: false,
                        pointPadding: 10,
                        showLegends: true,
                        formatLabel: '',
                        tooltip: true
                    };
                    this.graficaDetallesPorEstatus.CargarGrafica(response.jsonResultado, confGraficaColumn);
                }
            },
            error => {
                console.log('Error del servidor');
            },
            () => super.loading(false) //Spinner CERRAR CARGANDO
        );
    }

    private consultaBalancePorEstatus() {
        let path: string = "/AsesorBig/consultaBalancePorEstatus";
        let params: Object = {
            idStatus: 3,
            tipo: 'Capital Pagado'
        };
        super.loading(true);
        this.service.post(params, path, 1).subscribe(
            data => {
                let response: any = JSON.parse(JSON.stringify(data));
                if (response.codE === 0) {
                    /*  let confGraficaColumn: ConfGraficaColumn = {
                        type: 'line',
                        title: 'Balance de Créditos',
                        subtitle: '',
                        categories: [''],
                        titleCategories: 'Cantidad Monetaria ($)',
                        titleVertical: 'Cantidad Monetaria ($)',
                        valueSuffix: '',
                        allowDecimals: false,
                        drilldown: false,
                        pointPadding: 10,
                        showLegends: false
                    }; */
                    let confGraficaLine: ConfGraficaLine = {
                        type: 'line',
                        title: 'Detalle de Crédito',
                        subtitle: '',
                        titleScale: 'Cantidad Monetaria ($)',
                        categories: [''],
                        drilldown: true,
                        showLegends: true
                    };
                    this.graficaDetallesPorEstatus.CargarGrafica(response.jsonResultado, confGraficaLine);
                }
            },
            error => {
                console.log('Error del servidor');
            },
            () => super.loading(false) //Spinner CERRAR CARGANDO
        );
    }


    public getAllObjectPaginate = (page): Observable<Object> => {
        return Observable.create(observer => {
            super.loading(true);
            let dataQuery: any = this.dataQueryTable;
            let path = '/AsesorBig/empleadosPorInstitucionPorEstatus';
            console.log(this.empleados.series.name);
            if (this.empleados.series.name === "otorgados") {
                this.showOtorgados = true;
            } else {
                this.showOtorgados = false;
            }
             if (this.empleados.series.name === "sin posibilidad") {
                this.empleados.series.name = "sinposibilidad";
            }
            let params: Object = {
                idInstitucion: dataQuery.idInstitucion,
                idPais: dataQuery.idPais,
                tipo: this.empleados.series.name,
                pagina: 1
            };
            this.service.post(params, path, 1).subscribe(
                data => {
                    let object = JSON.parse(JSON.stringify(data));
                    console.log("objeto", object);
                    if (object.jsonResultado !== null) {
                        this.vista = 'empleadosPorInstitucionPorEstatus';
                        observer.next(object.jsonResultado);
                        observer.complete();
                    }
                },
                error => {
                    super.loading(false);
                    console.log("Error");
                    observer.next(null);
                    observer.complete();
                },
                () => super.loading(false)
            );
        });
    }
    setPage(page: number, rango?: number, total?: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        let countPages = _.where(this.objectArrayPaginate, { page: page });
        if (countPages.length === 0) {
            console.log("El numero de paginas es 0");
            let pagetoVisited = this.pageToVisited(page);
            this.getAllObjectPaginate(pagetoVisited).subscribe(
                data => {
                    let object = JSON.parse(JSON.stringify(data));
                    this.pager = this.getPager(object.total, page, object.rango);
                    this.addItemToArray(this.pager, object.consulta, object.rango, object.total);
                    this.pagedItems = _.where(this.objectArrayPaginate, { page: this.pager.currentPage });
                },
            );
        } else {
            console.log("El numero de paginas es diferente de 0");
            this.pager = this.getPager(total, page, rango);
            this.pagedItems = _.where(this.objectArrayPaginate, { page: this.pager.currentPage });
        }

    }
}
