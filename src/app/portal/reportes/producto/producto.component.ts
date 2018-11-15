import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../../../service/service';
import { GraficaComponent } from '../../../graficas-highchart/graficas-highchart.component';
import { GRAFICAS } from '../../../constants/graficas';
import { ConfGraficaPie } from '../../../interfaces/interfacesGraficas';
import * as _ from 'underscore';
import { Observable } from 'rxjs/Observable';
import { Notifications } from '../../../classGeneric/notifications';
import { ClassGenerica } from '../../../classGeneric/config';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ObjDispersiones, DataReportesInstitucion, ObjFiltrosHandler } from './templates/producto';
import { ConfGraficaDoubleLine } from '../../../interfaces/interfacesGraficas';
import { JsonToCsv } from '../../../classGeneric/jsontocsv';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import * as moment from 'moment';

@Component({
    selector: 'reportes-producto',
    templateUrl: 'templates/producto.component.html',
    styleUrls: ['templates/producto.css'],
})

export class ReportesProducto extends ClassGenerica {
    @ViewChild(GraficaComponent) graficaComponent: GraficaComponent;
    public menuLateral: Array<Object>;
    public objDispersiones: ObjDispersiones;
    public objRepInstitucion: DataReportesInstitucion;
    public listaInstituciones: any = [];
    public institucionCtrl: FormControl;
    public idProducto: String = "";;
    public oFH: ObjFiltrosHandler;
    public productos: any = [];
    public configGrafica: ConfGraficaDoubleLine;
    public formulario: FormGroup;

    constructor(private service: Service, private notifications: Notifications, private jsonToCsv: JsonToCsv) {
        super();
        this.menuLateral = this.getMenuLateral(1);
        this.institucionCtrl = new FormControl();
        this.listaInstituciones = this.institucionCtrl.valueChanges.startWith(null).map(name => this.filtrarInstituciones(name));
        this.getProductos();
        this.formulario = new FormGroup({
            'parametro': new FormControl(null, Validators.required),
            'fechaInicio': new FormControl(null, Validators.required),
            'fechaFin': new FormControl(null, Validators.required)
        });
        this.init(true);
    }

    /* Cambiando de producto */
    public init(_value: boolean): void {
        if (_value) {
            this.institucionCtrl.reset();
        }
        this.formulario.reset();
        this.objDispersiones = new ObjDispersiones();
        this.objRepInstitucion = new DataReportesInstitucion();
        this.oFH = new ObjFiltrosHandler();
    }
    /* Consulta de productos disponibles */
    private getProductos(): void {
        let path: string = '/AsesorBig/api/interno/instituciones/reportesProductos/instituciones/empleados';
        let params: object = { "idInstitucion": null, "idPais": null };
        super.loading(true);
        this.service.post(params, path, 1).subscribe((data: any) => {
            super.loading(false);
            if (data.codE === 0) {
                this.productos = data.jsonResultado;
            }
        }, error => {
            console.log("error del servidor");
        });
    }
    /* Filtrado de instituciones */
    private filtrarInstituciones(val: string): any {
        if (val === null) {
            return [];
        }
        if (this.idProducto.length === 0) {
            this.notifications.info('Información', 'Debe seleccionar un producto');
            return [];
        }
        if (!this.oFH.getInstSelected()) {
            if (val.length > 2) {
                let instituciones: any[] = [];
                let jsonSend = { fcCadena: val, idProducto: this.idProducto };
                let url = "/AsesorBig/api/interno/instituciones/reportesDinamicos/instituciones/empleados";
                super.loading(true);
                this.service.post(jsonSend, url, 1).subscribe((data: any) => {
                    super.loading(false);
                    if (data.codE === 0) {
                        if (data.jsonResultado.length > 0) {
                            for (let inst of data.jsonResultado) {
                                instituciones.push({ name: inst.nombre, idInst: inst.idInstitucion, idPais: inst.idPais });
                            }
                        }
                    } else {
                        this.notifications.info('Consulta de instituciones', "El servidor respondio con algun fallo -> [" + data.msgE + "]");
                    }
                }, error => {
                    this.notifications.error('Error', "Ha ocurrido una falla en la peticion -> [" + error + "]");
                }, () => super.loading(false));
                return instituciones;
            } else {
                this.init(false);
                return [];
            }
        }
    }
    /* Consultas para generar las graficas */
    private getDispersionInstitucion(institucion: any): void {
        this.oFH.setInstitucion(institucion);
        this.oFH.setInstSelected(true);//Evita que se realice doble petición
        let path: string = '/AsesorBig/api/interno/captacion/reportes/dispersion/xInstitucion';
        let params: object = { "idInstitucion": this.oFH.getIdInstitucion() };
        super.loading(true);
        this.service.post(params, path, 1).subscribe((data: any) => {
            this.oFH.setInstSelected(false);
            if (data.codE === 0) {
                this.oFH.setDataVisible(true);
                this.objDispersiones.setValues(data.jsonResultado);
                this.getReportesInstitucion(this.oFH.getIdInstitucion());
            } else {
                super.loading(false);
            }
        }, error => {
            super.loading(false);
        });
    }
    /* Segundo servicio que retorna informacion para las graficas */
    private getReportesInstitucion(idInstitucion: number): void {
        let path: string = '/AsesorBig/api/interno/captacion/reportes/xInstitucion';
        let params: object = { "idInstitucion": idInstitucion };
        this.service.post(params, path, 1).subscribe((data: any) => {
            if (data.codE === 0) {
                this.objRepInstitucion.setValues(data.jsonResultado);
                this.getGraficaDispersiones(idInstitucion);
            } else {
                super.loading(false);
            }
        }, error => {
            super.loading(false);
            console.log("error del servidor");
        });
    }

    private getGraficaDispersiones(idInstitucion: number): void {
        let path: string = '/AsesorBig/api/interno/captacion/reportes/comportamiento/dispersion';
        let params: object = { "idInstitucion": idInstitucion };
        this.service.post(params, path, 1).subscribe((data: any) => {
            super.loading(false);
            if (data.codE === 0) {
                this.oFH.setGraphVisible(true);
                let categorias: any[] = [];
                let serieUno: any[] = [];
                let serieDos: any[] = [];

                for (let empleados of data.jsonResultado.datosEmp) {
                    categorias.push(empleados.fechaAplicacion);
                    serieUno.push(parseInt(empleados.numEmpleados, 10));
                }
                for (let montos of data.jsonResultado.datosMonto) {
                    serieDos.push(parseInt(montos.importe, 10));
                }
                for (let montos of data.jsonResultado.datosMonto) {
                    serieDos.push(parseInt(montos.importe, 10));
                }
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
                setTimeout(() => {
                    this.oFH.setBtnVisible(true);
                    this.objRepInstitucion.animate();
                    this.objDispersiones.animate();
                    this.graficaComponent.CargarGrafica(json, this.configGrafica);
                }, 500);
            }
        }, error => {
            super.loading(false);
            console.log("error del servidor");
        });
    }
    public habilitarFecha(): void {
        if (this.formulario.controls['parametro'].value === "1") {
            this.oFH.setFechasVisible(true);
        } else {
            this.oFH.setFechasVisible(false);
        }
    }
    private asignarFecha(): void {
        this.oFH.setFechasInVisible(true);
    }
    private openForm(): void {
        this.oFH.setModalVisible(true);
    }
    public closeForm(): void {
        this.oFH.setModalVisible(false);
    }
    public descargarExcel(formulario: any): void {
        if (this.oFH.getFechasVisible()) {
            if (formulario.fechaInicio === null) {
                this.notifications.info("Importante", "Debe seleccionar fecha de inicio");
                return;
            }
            if (formulario.fechaFin === null) {
                this.notifications.info("Importante", "Debe seleccionar fecha final");
                return;
            }
            this.descargar();
        } else {
            this.descargar();
        }
    }
    private descargar(): void {
        this.closeForm();
        let jsonSend: any;
        let path = "/mesacontrol/reportes/instituciones/dispersion/rangofecha";
        super.loading(true);
        if (this.formulario.controls['parametro'].value === "1") {
            jsonSend = {
                idInstitucion: this.oFH.getIdInstitucion(),
                parametro: this.formulario.controls['parametro'].value,
                fechaInicio: moment(this.formulario.controls['fechaInicio'].value).format('DD-MM-YYYY'),
                fechaFinal: moment(this.formulario.controls['fechaFin'].value).format('DD-MM-YYYY')
            };
        } else {
            jsonSend = {
                idInstitucion: this.oFH.getIdInstitucion(),
                parametro: this.formulario.controls['parametro'].value,
                fechaInicio: "",
                fechaFinal: ""
            };
        }
        this.service.post(jsonSend, path, 3).subscribe((data: any) => {
            if (data.codE === 0) {
                if (data.jsonResultado !== null) {
                    if (data.jsonResultado.length !== 0) {
                        this.jsonToCsv.generateToExcel(data.jsonResultado, this.oFH.getNombreInstitucion());
                    } else {
                        this.notifications.info("Descarga de excel", "No contiene datos");
                    }
                } else {
                    this.notifications.info("Descarga de excel", data.msgE);
                    super.loading(false);
                }
            } else {
                this.notifications.info("Descarga de excel", data.msgE);
            }
        }, error => {
            super.loading(false);
            this.notifications.error('Error de servicio');
        }, () => super.loading(false));
    }
}
