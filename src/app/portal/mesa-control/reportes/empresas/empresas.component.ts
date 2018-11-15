import { Component, AfterViewInit, ViewChild } from '@angular/core';
//Importacion clase generica
import { ClassGenerica } from '../../../../classGeneric/config';
//Importacion de servicio para el consumo de servicios
import { Service } from '../../../../service/service';
//Importacion de la clase de garfica
import { GraficaComponent } from '../../../../graficas-highchart/graficas-highchart.component';
//Importacion de interfaces
import { ConfGraficaPie } from '../../../../interfaces/interfacesGraficas';
//Importacion de la paleta de colores
import { GRAFICAS } from '../../../../constants/graficas';

import { ValidationService } from '../../../../validator/validation.service';
import { Observable } from 'rxjs/Observable';
import * as _ from 'underscore';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { Pagination } from '../../../../classGeneric/pagination';
import { PaginationFron } from '../../../../classGeneric/paginationFront';
import { Notifications } from '../../../../classGeneric/notifications';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import {ValidationModule} from '../../../../validator/validation.module';
import { JsonToCsv } from '../../../../classGeneric/jsontocsv';

@Component({
  selector: 'empresas',
  templateUrl: 'empresas.component.html',
  styleUrls: ['empresas.component.css'],

})

export class Empresas extends ClassGenerica {


    //Arreglo para el menu lateral
    menuLateral: Array<Object>;
    //Bandera la la visibilidad del boton regresar
    btnRegresar: Boolean;
    objFiltrosHandler: any;
    institucionCtrl: FormControl;
    listaInstituciones: any;
    pager: any = {};
    pagedItems: any[];
    clientes: any;
    minFechaGeneral: any;
    maxFechaGeneral: any;
    habilitarFecha: boolean;
    habilitarTabla: boolean;
    segunda: boolean;
    tercera: boolean;
    constructor(private service: Service, private notifications: Notifications, private paginationfron: PaginationFron, private jsonToCsv : JsonToCsv) {
        super();
        this.maxFechaGeneral = new Date();
        this.habilitarFecha = false;
        this.menuLateral = this.getMenuLateral(1);
        this.menuNavigation = this.menuNavigation();
        this.habilitarTabla = false;
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
        this.btnRegresar = false;
        this.listaInstituciones = [];
        this.institucionCtrl = new FormControl();
        this.listaInstituciones = this.institucionCtrl.valueChanges.startWith(null).map(name => this.filtrarInstituciones(name));
    }
     asignarRangoFechas() {

        let _objFiltrosHandler: any = this.objFiltrosHandler;
        if (_objFiltrosHandler.fechaInicialBusqueda !== null) {
            this.habilitarFecha=true;
        }
        if (_objFiltrosHandler.fechaInicialBusqueda !== null && _objFiltrosHandler.fechaFinalBusqueda !== null) {

            if (!moment(_objFiltrosHandler.fechaFinalBusqueda).isBefore(moment(_objFiltrosHandler.fechaInicialBusqueda))) {
            } else {
                this.notifications.error('Rango de fechas', 'La fecha final debe ser mayor a la inicial');
            }
        }
    }
    filtrarInstituciones(val: string) {

        let instituciones: any[] = [];

        if (val !== null && val !== undefined) {

            let _objFiltrosHandler: any = this.objFiltrosHandler;

            _objFiltrosHandler.anyoneSearchResult = false;

            if (val.length > 2) {

                super.loading(true);

                let objRequest = { nombre  : val };
                let uriRequest = "/mesacontrol/credito/instituciones/todas/consulta";


                this.service.post(objRequest, uriRequest, 3).subscribe(
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
                                /*this.notifications.info("Consulta de instituciones",objServiceResponse.msgE);*/
                            }

                        } else {
                            this.notifications.info('Consulta de instituciones', objServiceResponse.msgE);
                            _objFiltrosHandler.institucionSelected = false;
                        }
                    },
                    error => {
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
    asignar(institucion: any){
        this.objFiltrosHandler.idInstitucionSelected=institucion.idInst;
    }

    buscar(){
        this.obtenerListaUsuarios();
        this.habilitarTabla=true;
    }
    private obtenerListaUsuarios(): void {

		super.loading(true);

        let urlRequestGeneral = "/mesacontrol/reportes/empresa/solicitudes/consulta";

        let fechaI: any = this.objFiltrosHandler.fechaInicialBusqueda !== null ? moment(this.objFiltrosHandler.fechaInicialBusqueda).format("DD-MM-YYYY") : null;
        let fechaF: any = this.objFiltrosHandler.fechaFinalBusqueda !== null ? moment(this.objFiltrosHandler.fechaFinalBusqueda).format("DD-MM-YYYY") : null;
		let _requestGeneral: any = {
                        rol: 101,
                        empresa: this.objFiltrosHandler.idInstitucionSelected,
                        fechaInicio: fechaI,
                        fechaFin: fechaF
                    };
		this.service.post(_requestGeneral, urlRequestGeneral, 3).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                console.log(object);
                if (object.codE === 0) {
                    this.clientes=object.jsonResultado;
                    this.pager = this.paginationfron.getPager(object.jsonResultado.length, 1, 50);
                    this.pagedItems = this.paginationfron.getPagerdata(object.jsonResultado);
                }
            },
            error => {
                super.loading(false);
                this.notifications.error('Error de servicio');
            },
            () => super.loading(false)
        );
    }
    limpiar(){
        this.institucionCtrl = new FormControl();
        this.listaInstituciones = this.institucionCtrl.valueChanges.startWith(null).map(name => this.filtrarInstituciones(name));
        this.objFiltrosHandler.fechaInicialBusqueda=null;
        this.objFiltrosHandler.fechaFinalBusqueda=null;
        this.habilitarFecha=false;
    }
   setPage(page: number, rango?: number, total?: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.paginationfron.getPager(total, page, rango);
        this.pagedItems = this.paginationfron.getPagerdata([],page);
    }
    exportarExcel(){
        this.jsonToCsv.generateToExcel( this.clientes,'Solicitudes');
    }

    private getAll(): void{
        super.loading(true);
        let path =  "/mesacontrol/reportes/empresa/solicitudes/rubros/consulta";

        let fechaI: any = this.objFiltrosHandler.fechaInicialBusqueda !== null ? moment(this.objFiltrosHandler.fechaInicialBusqueda).format("DD-MM-YYYY") : null;
        let fechaF: any = this.objFiltrosHandler.fechaFinalBusqueda !== null ? moment(this.objFiltrosHandler.fechaFinalBusqueda).format("DD-MM-YYYY") : null;
		let _requestGeneral: any = {
                        rol: 101,
                        empresa: this.objFiltrosHandler.idInstitucionSelected,
                        fechaInicio: fechaI,
                        fechaFin: fechaF
                    };
            this.service.post(_requestGeneral, path, 3).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                if (object.codE === 0) {
                    this.jsonToCsv.generateToExcel(object.jsonResultado,'Rubros');
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
