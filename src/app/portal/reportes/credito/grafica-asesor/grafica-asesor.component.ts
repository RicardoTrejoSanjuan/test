import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
//Importacion clase generica
import { ClassGenerica } from '../../../../classGeneric/config';
//Importacion de servicio para el consumo de servicios
import { Service } from '../../../../service/service';
//Importacion de la clase de garfica
import { GraficaComponent } from '../../../../graficas-highchart/graficas-highchart.component';
///Importacion de interfaces
import { ConfGraficaPie } from '../../../../interfaces/interfacesGraficas';
import { ConfGraficaPercent } from '../../../../interfaces/interfacesGraficas';
//Importacion de la paleta de colores
import { GRAFICAS } from '../../../../constants/graficas';

@Component({
    selector: 'reportes/creditos/asesor-credito-general',
    templateUrl: 'grafica-asesor.component.html',
    styleUrls: ['../../credito/credito.component.css']
})
export class ReportesCreditoAsesor extends ClassGenerica implements AfterViewInit {
    //Arreglo para el menu lateral
    menuLateral: Array<Object>;
    //Declaracion de var tipo GraficaComponent
    @ViewChild(GraficaComponent) grafica: GraficaComponent;
    @ViewChild('graficaBalance') graficaBalance: GraficaComponent;
    @ViewChild('graficaDetalle') graficaDetalle: GraficaComponent;

    //variable para generar la tabla de lateral de la informacion recibida
    data: any[];
    //Paleta de colores
    paletaColores: string[];
    //Banderas para mostrar-ocultar graficas
    mostrarDetalle: boolean;
    totalCreditos: number;

    //Constructor de la clase
    constructor(private service: Service, router: Router) {
        super();
        this.paletaColores = GRAFICAS.PALETA_COLORES;
        this.mostrarDetalle = false;
        this.menuLateral = this.getMenuLateral(1);
        this.menuNavigation = this.menuNavigation();
        this.totalCreditos=0;
        console.log(this.totalCreditos);
        
        super.loading(true);
    }

    //Funcion que se ejecuta al tener todo el html cargado
    ngAfterViewInit() {
        this.totalCreditos = 0;
        // super.loading(true);
        let path: string = '/AsesorBig/colocacion';
        let params: object = {
            idInstitucion: null,
            idPais: null
        };

        this.service.post(params, path, 1).subscribe(
            //Funcion flecha para manejo de los datos recibidos por el servicio
            data => {
                let response = JSON.parse(JSON.stringify(data));
                if (response.codE === 0) {
                    this.data = response.jsonResultado;
                    for (let item of this.data) {
                        this.totalCreditos += item.y;
                    }
                    let titulo: string = 'Total de Créditos: ' + this.totalCreditos;
                    console.log("esto",this.data);
                    let conf: ConfGraficaPie = {
                        type: 'pie',
                        nameCategory: 'Asesor',
                        title: titulo,
                        subtitle: '',
                        tooltip: true,
                        //dataLabels: '',
                        dataLabels: true,
                        drilldown: true,
                        showLegends: false
                    };
                    this.grafica.CargarGrafica(this.data, conf);
                }
            },
            error => {
                console.log('Error del servidor');
            },
            () => super.loading(false)
        );
    }

    //Funcion para cambiar de grafica
    CambiarGrafica(_params) {

        if (_params!==undefined) {
            this.mostrarDetalle = true;
            let empleado: string = _params.name;
        this.ConsultarBalance(empleado);
        }

    }

    ConsultarBalance(_empleado) {
        super.loading(true);
        let path: string = "/AsesorBig/balance";
        let params: object = {
            idInstitucion: null,
            idPais: null,
            idStatus: 0,
            idEmpleadocoloco: _empleado
        };
        console.log(params);
        this.service.post(params, path, 1).subscribe(
            data => {
                let response = JSON.parse(JSON.stringify(data));
                if (response.codE === 0) {
                    let { Balance, Detalle } = response.jsonResultado;
                    for (var index = 0; index < Balance.estatus.length; index++) {
                        if(Balance.estatus[index].name==="Interes"){
                            Balance.estatus[index].name = "Interés";
                        }
                    }
                    console.log(Balance.estatus[0].name);
                    //Obtenemos y asignamos los valores a la grafica de BALANCE
                    let confGraficaBalance: ConfGraficaPercent = {
                        type: "percent",
                        title: "Balance",
                        subtitle: "",
                        categories: Balance.categorias,
                        titleCategories: "Cantidad Monetaria ($)",
                        drilldown: false,
                        horizontal: false,
                        tooltipShared: true,
                        widthBar: 50
                    };
                    let dataBalance: object[] = Balance.estatus;
                    for (var index = 0; index < Detalle.estatus.length; index++) {
                        if(Detalle.estatus[index].name==="Interes"){
                            Detalle.estatus[index].name = "Interés";
                        }
                    }
                    //Obtenemos y asignamos los valores a la grafica de DETALLE
                    let confGraficaDetalle: ConfGraficaPercent = {
                        type: "percent",
                        title: "Detalle",
                        subtitle: "",
                        categories: Detalle.categorias,
                        titleCategories: "Cantidad Monetaria ($)",
                        drilldown: false,
                        horizontal: false,
                        tooltipShared: true,
                        widthBar: 50
                    };
                    let dataDetalle: Object[] = Detalle.estatus;
                    //Desplegamos las graficas
                    this.graficaBalance.CargarGrafica(dataBalance, confGraficaBalance);
                    this.graficaDetalle.CargarGrafica(dataDetalle, confGraficaDetalle);
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

    Regresar (){
        this.mostrarDetalle = false;
        this.ngAfterViewInit();
    }

}
