import { Component, AfterViewInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { FormControl } from '@angular/forms';

import { Service } from '../../../../service/service';

import { ClassGenerica } from '../../../../classGeneric/config';

import { Notifications } from '../../../../classGeneric/notifications';

import { ConfGraficaDoubleLine } from '../../../../interfaces/interfacesGraficas';

import { GraficaComponent } from '../../../../graficas-highchart/graficas-highchart.component';

import {FormGroup,FormBuilder,Validators} from '@angular/forms';

import { JsonToCsv } from '../../../../classGeneric/jsontocsv';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import * as moment from 'moment';

@Component({
    selector: 'reportes-dispersiones',
    templateUrl: 'grafica-dispersiones.component.html',
    styleUrls: ['../../credito/credito.component.css']

})

export class ReportesDispersiones extends ClassGenerica implements AfterViewInit {

    menu: Array<Object>;
    configGrafica: ConfGraficaDoubleLine;
    objectServiceResponse: any;
    minFecha: any;
    listaInstituciones: any;
    institucionCtrl: FormControl;
    formulario: FormGroup;
    showHighChartComponent: boolean;
    productos : any;
    isAvailable : boolean;
    idProducto : String;
    activo:boolean;
    @ViewChild(GraficaComponent) graficaComponent: GraficaComponent;
    mostrarBoton: boolean;
    modalFormulario: boolean;
    bandFechas: boolean; 
    institucion: any;
    fechaIn: any;
    constructor(private service: Service, private router: Router, private notifications: Notifications, private formBuilder: FormBuilder, private jsonToCsv : JsonToCsv) {
        super();

        this.fechaIn=false;
        this.menu = this.getMenuLateral(1);
        this.institucion="";
        this.menuNavigation = this.menuNavigation();
        this.showHighChartComponent = true;
        this.bandFechas=false; 
        this.listaInstituciones = [];
        this.objectServiceResponse = [];
        this.institucionCtrl = new FormControl();
        this.listaInstituciones = this.institucionCtrl.valueChanges.startWith(null).map(name => this.filtrarInstituciones(name));
        this.idProducto="";
        this.getProductos();
        this.isAvailable= true;
        this.activo=false;
        this.mostrarBoton=false;
        this.formulario = this.formBuilder.group({
            'parametro':[''],
			'fechaInicio': [''],
			'fechaFin': [''],
        });
        this.modalFormulario=false;
    }
    ngAfterViewInit() {

        //this.consumirServicio(uriService, objRequest);

    }

    onChange(){
        if (this.idProducto!=="") {
            this.isAvailable=false;
        }else{
            this.isAvailable=true;
        }
    }

    clickInstituciones(){
        if(this.isAvailable) {
            this.notifications.alert("Seleccione un producto");
        }
    }

    private getProductos(){
        super.loading(true);
        let path: string = '/AsesorBig/api/interno/instituciones/reportesProductos/instituciones/empleados';
        let params: object = { "idInstitucion":null, "idPais":null};
        this.service.post(params, path, 1).subscribe(
            data => {
                super.loading(false);
                let object = JSON.parse(JSON.stringify(data));
                if (object.codE === 0) {
                    this.productos=object.jsonResultado;
                }
            }, error => {
                super.loading(false);
                console.log("error del servidor");
            },
            () => super.loading(false)
        );
    }

    filtrarInstituciones(str: string) {

        let instituciones: any[] = [];
        if (this.activo===false) {



        if (this.validarContenido(str) && str !== "") {

            if (str.length > 2) {
                super.loading(true);

                let objRequest: any = {fcCadena: str, idProducto:this.idProducto};
                let uriRequest: string = "/AsesorBig/api/interno/instituciones/reportesDinamicos/instituciones/empleados";

                this.service.post(objRequest, uriRequest, 1).subscribe(
                    data => {

                        let objServiceResponse: any = JSON.parse(JSON.stringify(data));

                        if (objServiceResponse.codE === 0) {

                            if (objServiceResponse.jsonResultado.length > 0) {

                                for (let inst of objServiceResponse.jsonResultado) {
                                    instituciones.push({ nombre: inst.nombre, idInstitucion: inst.idInstitucion });
                                }

        					} else {
        						//this.notifications.info('Consulta de instituciones','El consumo del servicio no arrojo ningun resultado !!!');
        					}

                        } else {
                            this.notifications.info('Consulta de instituciones', "El servidor respondio con algun fallo -> [" + objServiceResponse.msgE + "]");
                        }
                    },
                    error => {
                        this.notifications.error('Error', "Ha ocurrido una falla en la peticion -> [" + error + "]");

                    },
                    () => super.loading(false)
                );

            } else {
                console.log("Menos de 3 caracteres");
            }
        }
    }

        return instituciones;
    }
    obtenerDispersiones(inst: any, activo) {
        this.activo=activo;
        
        if (this.validarContenido(inst)) {

            super.loading(true);
            this.institucion=inst;
            let uriService: string = "/AsesorBig/api/interno/captacion/reportes/comportamiento/dispersion";
            let objRequest: any = { idInstitucion: inst.idInstitucion };

            this.service.post(objRequest, uriService, 1).subscribe(
                data => {
                    this.activo=false;
                    let objServiceResponse: any = JSON.parse(JSON.stringify(data));

                    if (objServiceResponse.codE === 0) {

                        if (this.validarContenido(objServiceResponse.jsonResultado)) {

                            if (this.validarContenido(objServiceResponse.jsonResultado.datosEmp) && this.validarContenido(objServiceResponse.jsonResultado.datosMonto)) {

                                if (objServiceResponse.jsonResultado.datosEmp.length > 0 && objServiceResponse.jsonResultado.datosMonto.length > 0) {

                                    let categorias: any[] = [];
                                    let serieUno: any[] = [];
                                    let serieDos: any[] = [];

                                    for (let empleados of objServiceResponse.jsonResultado.datosEmp) {
                                        categorias.push(empleados.fechaAplicacion);
                                        serieUno.push(parseInt(empleados.numEmpleados, 10));
                                    }

									for(let montos of objServiceResponse.jsonResultado.datosMonto) {
										//categorias.push(montos.fechaAplicacion);
										serieDos.push(parseInt(montos.importe,10));
                                    }
                                    
                                    this.mostrarBoton=true;

									this.configGrafica = {
										type: 'doubleLine',
									    title: null,
									    subtitle: null,
									    categories: categorias,
									    titleScaleOne: 'Número de empeados',
									    sufixFormatOne: 'MXN',
									    titleScaleTwo: 'Cantidad dispersada',
									    sufixFormatTwo: 'emp.',
									    titleSerieOne: 'Monto',
									    titleSerieTwo: 'Empleados'
									};

									let json: any = {
										dataSerieOne: serieDos,
										dataSerieTwo: serieUno
									};
									this.showHighChartComponent = true;
									setTimeout(() => {this.graficaComponent.CargarGrafica(json,this.configGrafica);},0);
								}else {
									this.notifications.info('Consulta de dispersiones','No se encontraron dispersiones para la institución!!!');
								}
							}

    					} else {
    						this.notifications.info('Consulta de dispersiones','El consumo del servicio no arrojo ningun resultado !!!');
    					}

	                } else {
	                    this.notifications.info('Consulta de dispersiones',"El servidor respondio con algun fallo -> [" + objServiceResponse.msgE + "]");
	                }
				},
				error => {
					this.notifications.error('Error',"Ha ocurrido una falla en la peticion -> [" + error + "]");
                },
                ()=>super.loading(this.isAvailable)
            );

		}
	}
	validarContenido(_param: any) {
		return _param !== null && _param !== undefined;
    }
    private openForm() {
        console.log("abrir formulario");
        this.modalFormulario = true;

    }
    closeForm(){
        this.modalFormulario = false;
        this.formulario.controls['parametro'].setValue("");
        this.formulario.controls['fechaInicio'].setValue("");
        this.formulario.controls['fechaFin'].setValue("");
        this.bandFechas=false; 
        this.fechaIn=false;
        this.minFecha="";
    }
    descargar(){
        let _object: any;
        console.log(moment(this.formulario.controls['fechaInicio'].value).format('DD-MM-YYYY'));
        super.loading(true);
        if (this.formulario.controls['parametro'].value==="1") {
            _object = {idInstitucion:this.institucion.idInstitucion ,
                        parametro:this.formulario.controls['parametro'].value,  
                        fechaInicio:moment(this.formulario.controls['fechaInicio'].value).format('DD-MM-YYYY'),
                        fechaFinal:moment(this.formulario.controls['fechaFin'].value).format('DD-MM-YYYY')};
        }else{
            _object = {idInstitucion:this.institucion.idInstitucion ,
                        parametro:this.formulario.controls['parametro'].value,  
                        fechaInicio:"",
                        fechaFinal:""};
        }
        console.log(_object);
        let path="/mesacontrol/reportes/instituciones/dispersion/rangofecha";
            this.service.post(_object, path, 3).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                if (object.codE === 0) {
                    console.log(object);
                    if (object.jsonResultado !== null) {
                        if (object.jsonResultado.length!==0) {
                            this.jsonToCsv.generateToExcel(object.jsonResultado,this.institucion.nombre);
                        } else {
                            this.notifications.info("Descarga de excel", "No contiene datos");
                        }
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
        this.closeForm();
    }

    habilitarFecha(){
        console.log(this.formulario.controls['parametro'].value);
        if (this.formulario.controls['parametro'].value==="1") {
            this.bandFechas=true;
        }else{
            this.bandFechas=false;  
        }
    }
    asignarFecha(){
        this.minFecha= this.formulario.controls['fechaInicio'].value;
        this.fechaIn=true;
    }
}
