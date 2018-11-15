import { Component, AfterViewInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import { Service } from '../../../../service/service';

import { ClassGenerica } from '../../../../classGeneric/config';
import { Notifications } from '../../../../classGeneric/notifications';

import { GraficaComponent } from '../../../../graficas-highchart/graficas-highchart.component';
import { ConfStockColumn } from '../../../../interfaces/interfacesGraficas';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

@Component({
    selector: 'reporte-colocacion-general',
    templateUrl: 'grafica-colocacion.component.html',
    styleUrls: ['../../colocacion/colocacion.component.css']
})

export class ReporteColocacionGeneral extends ClassGenerica implements AfterViewInit {
    //
    @ViewChild('graficaColocacion') graficaColocacion: GraficaComponent;
    public jsonRequest: Object;
    public menuLateral: Array<Object>;
    public colocacionCtrl: FormControl;
    public ctrlHandler: any;
    public listaInstituciones: any;
    public listaProductosInst: any;
    public maxDate: Date;
    public minDate: Date;
    public fechaInicial: Date;
    public fechaFinal: Date;
    public idProducto: string;
    public isEnabled: boolean;
    //Construcor
    constructor(private service: Service, private router: Router, private notifications: Notifications) {
        super();
        //Control de cambios del formulario
        this.colocacionCtrl = new FormControl();
        //Menu lateral
        this.menuLateral = this.getMenuLateral(1);
        //Menu de navegación
        this.menuNavigation = this.menuNavigation();
        //Inicializacion del arreglo de instituciones
        this.listaInstituciones = this.colocacionCtrl.valueChanges.startWith(null).map(nombre => this.BuscarInstitucion(nombre));
        //Lista de productos por institucion
        this.listaProductosInst = [];
        //Inicializacion de variables y fechas
        this.maxDate = new Date();
        this.minDate = null;
        this.fechaInicial = null;
        this.fechaFinal = null;
        //Iniciaización de variables
        this.jsonRequest = {
            idInstitucion: null,
            idPais: null,
            idProducto: null,
            fechaInicio: null,
            fechaFin: null
        };
        //Inicialización de variables de control
        this.ctrlHandler = {
            tipoGrafica: true
        };

        this.idProducto="";

        this.isEnabled = true;
    }

    //Metodo que se ejecuta al terminar la carga del html
    ngAfterViewInit() {
        this.ConsultaInformacion(this.jsonRequest);
        this.BuscarProductos(this.jsonRequest);
    }
    clickInstituciones() {
        if (this.isEnabled) {
            this.notifications.info("Seleccione un producto");
        }
    }
    //Ajuste de grafica a mostrar
    public SetTipoGrafica(_params: String): void {
        let type: any = this.ctrlHandler;
        if (_params === 'creditos' && !type.tipoGrafica) {
            type.tipoGrafica = true;
            this.ConsultaInformacion(this.jsonRequest);
        } else if (_params === 'capital' && type.tipoGrafica) {
            type.tipoGrafica = false;
            this.ConsultaInformacion(this.jsonRequest);
        }
    }
    //Conuslta las intituciones a mostrar en los filtros
    private BuscarInstitucion(_str: String): any {
        let instituciones: any[] = [];
        if (typeof (_str) === 'string' && _str.length > 2) {
            super.loading(true);
            let params = { fcCadena: _str, idProducto: this.idProducto };
            let path = '/AsesorBig/api/interno/instituciones/reportesDinamicos/instituciones/creditos';
            console.log("Buscar instituciones -> ",params);
            this.service.post(params, path, 1).subscribe(
                data => {
                    super.loading(false);
                    let response = JSON.parse(JSON.stringify(data));
                    console.log("Buscar instituciones -> ",response);
                    if (response.codE === 0) {
                        for (let item of response.jsonResultado) {
                            instituciones.push({ idInstitucion: item.idInstitucion, idPais: item.idPais, nombre: item.nombre, total: item.total });
                        }
                    }
                },
                error => {
                    super.loading(false);
                },
                () => super.loading(false)
            );
        }
        return instituciones;
    }

    private ConsultaProductosPorEmpresa = (_item: any): Observable<Object> => {
        return Observable.create(
            observer => {
                let params = {
                    idInstitucion: _item.idInstitucion,
                    idPais: _item.idPais
                };
                /*let path = '/AsesorBig/api/instituciones/credito/reporte';*/
                let path = '/AsesorBig/api/interno/instituciones/reportesProductos/instituciones/creditos';
                console.log("Buscar productos -> ",params);
                this.service.post(params, path, 1).subscribe(
                    data => {
                        let response = JSON.parse(JSON.stringify(data));
                        console.log("Buscar productos -> ",response);
                        if (response.codE === 0) {
                            this.listaProductosInst = response.jsonResultado;
                            observer.next();
                            observer.complete();
                        }
                    },
                    error => {
                        observer.next();
                        observer.complete();
                    }
                );
            }
        );
    }

    //Consumo de servicio para consulta de productos
    private BuscarProductos(_item: any): void {
        super.loading(true);
        let json: any = this.jsonRequest;
        json.idInstitucion = _item.idInstitucion;
        json.idPais = _item.idPais;
        this.jsonRequest = json;        
        this.ConsultaProductosPorEmpresa(_item).subscribe(
            data => {
                super.loading(false);
                /*this.ConsultaInformacion(this.jsonRequest);*/
            }
        );
    }
    //Consumo de servicio con tipo de producto
    public SeleccionarProducto(): void {

        let json: any = this.jsonRequest;

        if (this.idProducto === "") {

            this.isEnabled = true;

            json.idInstitucion = null;
            json.idPais = null;
            json.idProducto = null;
            json.fechaInicio = null;
            json.fechaFin = null;

            this.fechaInicial = null;
            this.fechaFinal = null;

            this.colocacionCtrl = new FormControl();
            this.listaInstituciones = this.colocacionCtrl.valueChanges.startWith(null).map(nombre => this.BuscarInstitucion(nombre));

        } else {
            this.isEnabled = false;
            json.idProducto = parseInt(this.idProducto,0);
        }

        this.jsonRequest = json;
        this.ConsultaInformacion(this.jsonRequest);
    }
    //Ajuste y validación de fechas
    public SeleccionandoFecha(_item: Date, type: String) {
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
        this.ConsultaInformacion(this.jsonRequest);
    }
    asignarInstitucion(institucion: any) {
        if(super.isValid(institucion)) {
            
            let _json: any = this.jsonRequest;

            _json.idInstitucion = institucion.idInstitucion;
            _json.idPais = institucion.idPais;
            _json.idProducto = parseInt(this.idProducto,0);
            _json.fechaInicio = this.fechaInicial;
            _json.fechaFin = this.fechaFinal;

           this.jsonRequest = _json;
 
           this.ConsultaInformacion(this.jsonRequest);
        }
    }
    //Consumo de servicio para construccion de la grafica
    private ConsultaInformacion(_params: Object): void {
        super.loading(true);//Spinner CARGANDO
        let path: String = '/AsesorBig/api/credito/reporte/colocacion/mes';
        console.log("Buscar info inicial -> ",_params);
        this.service.post(_params, path, 1).subscribe(
            data => {
                let response = JSON.parse(JSON.stringify(data));
                console.log("Buscar info inicial -> ",response);
                if (response.codE === 0) {
                    this.ConfigurarGrafica(response.jsonResultado);
                }
            },
            error => {
                console.log('Error del servidor');
            },
            () => super.loading(false)
        );
    }
    //Ajustar y Cargar Grafica
    private ConfigurarGrafica(_data: any): void {
        let
            mss: String[] = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"],
            series: Object[] = [],
            handler: any = this.ctrlHandler,
            total: Number = _data.length,
            mesActual = (new Date).getMonth();

        for (let item of _data) {
            let visible: Boolean =
                (item.nombre.split(' ')[0]).toLowerCase() === (mss[mesActual]).toLowerCase() ||
                (item.nombre.split(' ')[0]).toLowerCase() === (mss[mesActual - 1]).toLowerCase() ||
                (item.nombre.split(' ')[0]).toLowerCase() === (mss[mesActual - 2]).toLowerCase();
            visible = total < 12 ? true : visible;
            series.push({
                name: item.nombre,
                data: this.AgruparDatos(item.diasList, handler.tipoGrafica),
                visible: visible
            });
        }
        let confStockColumn: ConfStockColumn = {
            type: 'highstock',
            subType: 'line',
            title: '',
            subtitle: '',
            navigator: false,
            scrollbar: true,
            categories: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
            minCategories: 20,
            allowDecimals: false,
            minyAxis: 0,
            titleCategoriesVertical: '',
            pointWidth: 60,
            pointPadding: 10,
            drilldown: false,
            formatLabel: handler.tipoGrafica ? '' : '$'
        };
        this.graficaColocacion.CargarGrafica(series, confStockColumn);
    }
    //Metodo para selecionar tipo de datos a mostrar
    private AgruparDatos(data: any[], tipoGrafica: Boolean): Object[] {
        let arr: Number[] = [];
        for (let item of data) {
            arr.push(tipoGrafica ? item.totalCreditos : item.totalCapital);
        }
        return arr;
    }

}
