import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Service } from '../../../../service/service';

import { GRAFICAS } from '../../../../constants/graficas';
import { GraficaComponent } from '../../../../graficas-highchart/graficas-highchart.component';
import { ConfGraficaPie } from '../../../../interfaces/interfacesGraficas';
import { ConfGraficaColumn } from '../../../../interfaces/interfacesGraficas';
import { ConfGraficaBar } from '../../../../interfaces/interfacesGraficas';
import { ConfGraficaLine } from '../../../../interfaces/interfacesGraficas';
import { Observable }     from 'rxjs/Observable';
import { Pagination} from '../../../../classGeneric/pagination';
import * as _ from 'underscore';

@Component({
    selector: 'reportes/creditos/instituciones-credito-general',
    templateUrl: 'grafica-instituciones.component.html',
    styleUrls: ['../../credito/credito.component.css']
})

export class ReportesCreditoInstituciones extends Pagination implements AfterViewInit {


    menuLateral: Array<Object>;
    //Variable para crear la grafica de pastel:
    _data: any[];
    tab: number;
    creditos: number[] = [];
    nombre: any[] = [];
    confGraficaPie: ConfGraficaPie;
    confGraficaColumn: ConfGraficaColumn;
    Detalle: any;
    Empleados: any;
    paletaColores: string[] = GRAFICAS.PALETA_COLORES;
    mostrarDetalle: boolean;
    activo: boolean;
    Balance: any;
    Credito: any;
    idInstitucion: number;
    totalCreditos: number;
    tablaEmpleados: Object;
    pager: any = {};
    pagedItems: any[];
    showListEmpleados:boolean;
    nombreInstitucion:string;
    tipoCreditosEmpleados:string;
    showOtorgados:boolean;

    @ViewChild(GraficaComponent) grafica: GraficaComponent;
    @ViewChild('graficaEmpleados') graficaEmpleados: GraficaComponent;
    @ViewChild('graficaEstatus') graficaEstatus: GraficaComponent;
    @ViewChild('graficaDetalle') graficaDetalle: GraficaComponent;
    @ViewChild('graficaBalance') graficaBalance: GraficaComponent;

    constructor(
        private service: Service,
        router: Router
    ) {
        super();
        console.log('ReportesCredito');
        this.menuLateral = this.getMenuLateral(1);
        console.log(this.menuLateral);
        this.mostrarDetalle = false;
        this.showListEmpleados = false;
        this.activo=false;
        this.tab=1;
        this.idInstitucion=0;
        this.activo = false;
        this.tab = 1;
        this.idInstitucion = 0;
        this.totalCreditos = 0;
        this.nombreInstitucion="";
        this.tipoCreditosEmpleados="";
        this.showOtorgados=false;
        this.menuNavigation = this.menuNavigation();
    }

    ngAfterViewInit() {
        super.loading(true);
        let path: string = '/AsesorBig/creditosPorInstitucion';
        let params: object = { idStatus: null };

        this.service.post(params, path, 1).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                if (object.codE === 0) {
                    this._data = object.jsonResultado;
                    this.confGraficaColumn = {
                        type: 'column',
                        title: '',
                        subtitle: '',
                        categories: [""],
                        titleCategories: '',
                        titleVertical: 'No. Créditos',
                        valueSuffix: '',
                        allowDecimals: false,
                        drilldown: true,
                        pointPadding: 0,
                        showLegends: true,
                        formatLabel: '',
                        tooltip: true
                    };
                    this.grafica.CargarGrafica(this._data, this.confGraficaColumn);
                } else {
                    console.log('No se obtuvo la informacion correctamente');
                }
            },
            error => {
                console.log('Error del servidor');
            },
            () => super.loading(false)
        );
    }
    setTab(num: number) {
        this.tab = num;
        if (this.tab === 1) {
            this.activo = false;
            console.log(this.tab);
            this.ConsultarDesglose(this.idInstitucion);

        }
        if (this.tab === 2) {
            this.activo = true;
            console.log(this.tab);
            this.ConsultarDesgloseDB(this.idInstitucion);
        }

        console.log(this.Empleados);

    }

    isSelected(num: number) {
        return this.tab === num;
    }
    CambiarGrafica(_params) {
        if(_params!==undefined){
            this.setTab(1);
            this.mostrarDetalle = true;
            if (_params.options) {
                this.nombreInstitucion=_params.series.options.name;
                this.idInstitucion= _params.series.options.idInstitucion;
            }else{
                this.nombreInstitucion=_params.name;
                this.idInstitucion= _params.idInstitucion;
            }
            this.idInstitucion = _params.series.options.idInstitucion;
            this.ConsultarDesglose(this.idInstitucion);
        }
    }

    ConsultarDesglose(_institucion) {
        super.loading(true);
        let path: string = "/AsesorBig/empleadosPorInstitucion";
        let params: object = {
            idInstitucion: _institucion,
            idPais: 1,
            idStatus: null,
            idProducto: null
        };
        console.log(params);
        this.service.post(params, path, 1).subscribe(
            data => {
                let response = JSON.parse(JSON.stringify(data));
                if (response.codE === 0) {
                    this.Empleados = response.jsonResultado.series;

                    let confGraficaBar: ConfGraficaBar = {
                        type: "bar",
                        title: "Empleados",
                        subtitle: "",
                        categories: [""],
                        titleCategories: "",// Titulo de las categorias
                        titleData: "",// Titulo que se muestra paralelo(horizontal) a la informacion (grafica).
                        valueSuffix: "",//Tipo de valor que se muestra en el tooltip
                        widthBar: 50,// Ancho de cada barra que compone la grafica
                        name: "",// Nombre de los datos de cada catgoria
                        drilldown: true
                    };
                    //Desplegamos las graficas
                    this.graficaEmpleados.CargarGrafica(this.Empleados, confGraficaBar);
                } else {
                    console.log('Error al recibir los datos');
                }
            },
            error => {
                console.log('Error del servidor');
            },
            () => super.loading(false)
        );
        this.service.post(params, "/AsesorBig/consultaEstatusCredito", 1).subscribe(
            data => {
                let response = JSON.parse(JSON.stringify(data));
                if (response.codE === 0) {
                    this.Credito = response.jsonResultado;
                    for (let item of this.Credito) {
                        this.totalCreditos += item.y;
                    }
                    let confGraficaEstatus: ConfGraficaPie = {
                        type: "pie",
                        title: "",
                        subtitle: "",
                        drilldown: false,
                        nameCategory: " ", //Nobre de las categorias
                        tooltip: true,// Valor para mostrar u ocultar el tooltip de la grafica
                        dataLabels: false,
                        showLegends: false
                    };
                    console.log("CREDITO", this.Credito);
                    //Desplegamos las graficas
                    this.graficaEstatus.CargarGrafica(this.Credito, confGraficaEstatus);
                } else {
                    console.log('Error al recibir los datos');
                }
            },
            error => {
                console.log('Error del servidor');
            },
            () => super.loading(false)
        );


    }
    ConsultarDesgloseDB(_institucion) {
        super.loading(true);
        let path: string = "/AsesorBig/detalleCredito";
        let params: object = {
            idInstitucion: _institucion,
            idPais: 1,
            idStatus: null
        };
        console.log(params);
        this.service.post(params, path, 1).subscribe(
            data => {
                let response = JSON.parse(JSON.stringify(data));
                if (response.codE === 0) {
                    console.log(response.jsonResultado);
                    this.Detalle = response.jsonResultado;
                    let ConfGraficaColumn: ConfGraficaColumn = {
                        type: 'column',//tipo de grafica: Barras verticales
                        title: "",
                        subtitle: "",
                        categories: this.nombre,
                        allowDecimals: false,
                        titleVertical: "Cantidad Monetaria ($)",
                        pointPadding: 40,
                        drilldown: false,
                        titleCategories: '',
                        valueSuffix: '',
                        showLegends: false,
                        formatLabel: ' $ ',
                        tooltip: true
                    };
                    //Desplegamos las graficas
                    this.graficaDetalle.CargarGrafica(this.Detalle, ConfGraficaColumn);

                } else {
                    console.log('Error al recibir los datos');
                }
            },
            error => {
                console.log('Error del servidor');
            },
            () => super.loading(false)
        );
        this.service.post(params, "/AsesorBig/detalleBalance ", 1).subscribe(
            data => {
                let response = JSON.parse(JSON.stringify(data));
                if (response.codE === 0) {
                    this.Balance = response.jsonResultado;
                    let categories: any[] = [];
                    let catValores: any[] = [];

                    for (let balance of this.Balance) {
                        if (balance.name==="Interes Pagado") {
                            balance.name="Interés Pagado";
                        }
                        categories.push(balance.name);
                        catValores.push(balance.data[0]);
                    }
                    console.log(this.Balance);
                    let confGraficaEstatus: ConfGraficaLine = {
                        type: "line",
                        title: "",
                        subtitle: "",
                        drilldown: false,
                        titleScale: "Cantidad Monetaria ($)",//Titulo de las categorias
                        showLegends: true,//Visibilidad de las categorias de la informacion
                        categories: categories//Categorias de la informacion
                    };
                    //Desplegamos las graficas
                    this.graficaBalance.CargarGrafica([{ data: catValores }], confGraficaEstatus);
                } else {
                    console.log('Error al recibir los datos');
                }
            },
            error => {
                console.log('Error del servidor');
            },
            () => super.loading(false)
        );
    }

    Regresar() {
        this.mostrarDetalle = false;
        this.tab=1;
        this.showListEmpleados = false;
        super.resetPaginator();
        this.tab = 1;
        this.ngAfterViewInit();

    }

    RegresarGraficas(){
        this.mostrarDetalle = true;
        this.tab=1;
        this.showListEmpleados = false;
        this.resetPaginator();
        this.ConsultarDesglose(this.idInstitucion);
    }
    seleccionarBarra(_params) {
        console.log('entrada: ', _params);
        if (typeof _params!=="undefined") {
            this.tipoCreditosEmpleados=_params.series.name;
            if(_params.series.name==="otorgados"){
                this.showOtorgados=true;
            }else{
                this.showOtorgados=false;
            }
            console.log("entra");
            this.tablaEmpleados = {
                idInstitucion: this.idInstitucion,
                idPais: 1,
                tipo: _params.series.name,
                pagina: 1
            };
            console.log(this.tablaEmpleados);
            this.setPage(1);

        }


    }

    public getAllObjectPaginate = (page) : Observable<Object> =>{
    return Observable.create(observer => {
        super.loading(true);
        let path = '/AsesorBig/empleadosPorInstitucionPorEstatus';
        let object=this.tablaEmpleados;
        this.service.post(object,path,1).subscribe(
        data => {
                let object = JSON.parse(JSON.stringify(data));
                console.log("objeto",object);
                if(object.jsonResultado !== null){
                    this.showListEmpleados=true;
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


    setPage(page: number,rango?:number,total?:number) {
      if (page < 1 || page > this.pager.totalPages) {
          return;
      }
      let countPages = _.where(this.objectArrayPaginate, { page: page });
      console.log(countPages);
      if (countPages.length === 0) {
          let pagetoVisited = this.pageToVisited(page);
          this.getAllObjectPaginate(pagetoVisited).subscribe(
              data => {
                    let object = JSON.parse(JSON.stringify(data));
                    this.pager = this.getPager(object.total, page,object.rango);
                    this.addItemToArray(this.pager,object.consulta,object.rango,object.total);
                    this.pagedItems = _.where(this.objectArrayPaginate, { page: this.pager.currentPage });
              },
          );
      } else {
          this.pager = this.getPager(total, page,rango);
          this.pagedItems = _.where(this.objectArrayPaginate, { page: this.pager.currentPage });
      }

    }
}
