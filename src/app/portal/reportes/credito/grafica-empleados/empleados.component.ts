import { Component, AfterViewInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

//import {ClassGenerica} from '../../../../classGeneric/config';
import { Pagination } from '../../../../classGeneric/pagination';

import * as _ from 'underscore';
import { Observable } from 'rxjs/Observable';

import { Service } from '../../../../service/service';

import { Notifications } from '../../../../classGeneric/notifications';

import { GraficaComponent } from '../../../../graficas-highchart/graficas-highchart.component';
import { ConfGraficaBar } from '../../../../interfaces/interfacesGraficas';

import { JsonToCsv } from '../../../../classGeneric/jsontocsv';
import { LoginComponent } from '../../../../login/login.component';

import {FormControl} from '@angular/forms';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
import {ClassGenerica} from '../../../../classGeneric/config';

@Component({
    selector: 'reportes-empleados',
    templateUrl: 'empleados.component.html',
    styleUrls: ['../../credito/credito.component.css']
})
export class ReportesEmpleados extends Pagination  {

    menuLateral: Array<Object>;
    confGraficaBar: ConfGraficaBar;

    responseGrafica: Object;
    responseEmpleados: Object;
    requestConsulta: Object;

    showListEmpleados: Boolean;
    mostrarDetalle: Boolean;
    showAditionalData: Boolean;

    tipo:any[];

    instSelected: String;

    pager: any = {};
    pagedItems: any = [];

    pathService: string = '/AsesorBig/empleadosPorInstitucionPorEstatus';

     modalFormulario: boolean;

     tipoDescargas:Array<String>;

    @ViewChild(GraficaComponent) graficaC: GraficaComponent;

    constructor(private service: Service, private router: Router, private notifications: Notifications,private jsonToCsv : JsonToCsv, private formBuilder: FormBuilder) {
        super();
        this.menuLateral = this.getMenuLateral(1);
        this.instSelected = "";
        this.menuNavigation = this.menuNavigation();
        this.modalFormulario=false;
        this.tipoDescargas=[];
        this.iniciar();
    }
   /* ngAfterViewInit() {

       
    }*/
    iniciar(){
        super.loading(true);
        
                let context: string = "/AsesorBig/empleadosPorInstitucion";
        
                let paramsReq: object = {
                    idPais: null,
                    idProducto: null,
                    idInstitucion: null
                };
                console.log(paramsReq);
                this.service.post(paramsReq, context, 1).subscribe(
                    data => {
        
                        let response: any = JSON.parse(JSON.stringify(data));
        
                        this.responseGrafica = response;
        
                        if (response.codE === 0) {
                   
                            if(response.jsonResultado !== null && response.jsonResultado.instituciones.length > 0 && response.jsonResultado.series.length > 0) {
        
                                for (let i = 0; i <= (response.jsonResultado.series.length - 1); i++) {
        
                                    if(response.jsonResultado.series[i].data.length > 1) {
        
                                        let valoresOrdenados: number[] = [];
                                        let valoresDesordenados: number[] = [];
        
                                        for (let data of response.jsonResultado.series[i].data) {
                                            valoresDesordenados.push(data);
                                        }
        
                                        //response.jsonResultado.series[i].data = this.ordenarDatosDescendente(valoresDesordenados);
                                    }
                                }
        
                                this.confGraficaBar = {
                                    type: 'bar',
                                    /*horizontal: true,*/
                                    /*tooltipShared: true,*/
                                    title: null,
                                    subtitle: null,
                                    categories: response.jsonResultado.instituciones,
                                    titleCategories: "",
                                    titleData: "Numero empleados",
                                    valueSuffix: " empleados",
                                    widthBar: 30,
                                    name: "Empleados de la institucion",
                                    drilldown: true
                                };
                                this.tipo=response.jsonResultado.series;
                                
                                //this.crearGrafica(response.jsonResultado.series,this.confGraficaBar);
                                this.graficaC.CargarGrafica(response.jsonResultado.series, this.confGraficaBar);
        
                            }else {
                                this.notifications.info("Consulta de empleados",response.msgE);
                            }
                        } else {
                            /*console.log("Resultado imposible de obtener !!!");*/
                            this.notifications.error("Consulta de empleados",response.msgE);
                        }
                    }, error => {
                        /*console.error("Ha ocurrido un fallo en la peticion");*/
                        this.notifications.error("Consulta de empleados",error);
                    }, () => super.loading(false)
                );
    }
    seleccionarBarra(_params) {
        if (typeof _params !== 'undefined') {

            let responseGraf: any = this.responseGrafica;

            this.instSelected = responseGraf.jsonResultado.instituciones[_params.index];

            this.showAditionalData = _params.series.name === 'otorgados' ? true : false;
            if (_params.series.name === "sin posibilidad") {
                    _params.series.name = "sinposibilidad";
            }

            this.requestConsulta = {
                idInstitucion: responseGraf.jsonResultado.idInstituciones[_params.index],
                tipo: _params.series.name,
                idPais: responseGraf.jsonResultado.idPais[_params.index],
                pagina: 1
            };

            this.setPage(1);
        }
    }
    ocultarLista() {
        this.showListEmpleados = false;
        this.mostrarDetalle = false;
        this.resetPaginator();
        this.iniciar();
    }
    setPage(page: number, rango?: number, total?: number) {
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
                },
            );
        } else {

            this.pager = this.getPager(total, page, rango);
            this.pagedItems = _.where(this.objectArrayPaginate, { page: this.pager.currentPage });
        }

    }

    public getAllObjectPaginate = (page): Observable<Object> => {
        return Observable.create(
            observer => {
                super.loading(true);
                let req: any = this.requestConsulta;
                req.pagina = page;
                this.service.post(this.requestConsulta, this.pathService, 1).subscribe(
                    data => {

                        let response = JSON.parse(JSON.stringify(data));
                        if (response.codE === 0) {

                            if(response.jsonResultado !== null && response.jsonResultado.consulta.length > 0) {
                                this.responseEmpleados = response.jsonResultado.consulta;
                                this.showListEmpleados = true;
                                this.mostrarDetalle = true;
                                observer.next(response.jsonResultado);
                                observer.complete();
                            }else {
                                this.notifications.info("Consulta de empleados",response.msgE);
                            }

                        } else {
                            /*console.log("Resultado imposible de obtener !!!");*/
                            this.notifications.error("Consulta de empleados",response.msgE);
                        }
                    },
                    error => {
                        super.loading(false);
                        observer.next(null);
                        observer.complete();
                        this.notifications.error("Consulta de empleados",error);
                    }, () => super.loading(false)
                );
            }
        );
    }
    private getAll(): void{
        super.loading(true);
        let _object: any = this.requestConsulta;
        console.log(_object);
        _object.pagina= null;
            this.service.post(_object, this.pathService, 1).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                if (object.codE === 0) {
                    if (object.jsonResultado !== null) {
                        this.jsonToCsv.generateToExcel(object.jsonResultado.consulta,_object.tipo);
                    }else{
                        this.notifications.info("Descarga de excel", object.msgE);
                        super.loading(false);
                    }
                    console.log(object);
                    
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
      private openForm() {
        console.log("abrir formulario");
        this.modalFormulario = true;

    }
    closeForm(){
        this.modalFormulario = false;
    }
    seleccionar(e,item){
        if (e.target.checked) {
            this.tipoDescargas.push(item);
        }else{
            this.tipoDescargas.splice(this.tipoDescargas.indexOf(item), 1);
        }
    }
    descargar(){
        console.log(this.tipoDescargas);
        this.tipoDescargas.forEach(element => {
            this.requestConsulta = {
                idInstitucion: null,
                tipo: element,
                idPais: null
            };
            this.getAll();
        });
        this.closeForm();
    }
}
