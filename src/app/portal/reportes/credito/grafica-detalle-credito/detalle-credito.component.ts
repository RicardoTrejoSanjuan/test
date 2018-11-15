import { Component, AfterViewInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { Service } from '../../../../service/service';

import { ClassGenerica } from '../../../../classGeneric/config';

import { GraficaComponent } from '../../../../graficas-highchart/graficas-highchart.component';

import { ConfGraficaColumn } from '../../../../interfaces/interfacesGraficas';

@Component({
    selector: 'reportes-detalle-credito',
    templateUrl: 'detalle-credito.component.html',
    styleUrls: ['../../credito/credito.component.css']
})

export class ReportesDetalleCredito extends ClassGenerica implements AfterViewInit {

    menuLateral: Array<Object>;
    confGraficaColumnas: ConfGraficaColumn;

    requestSelect: Object;
    uriServiceGeneral: String;
    uriServiceDetail: String;
    categorySelected: String;

    mostrarDetalle: Boolean;

    @ViewChild(GraficaComponent) grafica: GraficaComponent;

    constructor(private service: Service, private router: Router) {
        super();
        this.uriServiceGeneral = "/AsesorBig/detalleCredito";
        this.uriServiceDetail = "/AsesorBig/consultaDetallesPorEstatus";
        this.menuLateral = this.getMenuLateral(1);
        this.categorySelected = "";
        this.menuNavigation = this.menuNavigation();
        console.log(this.menuLateral);
    }
    ngAfterViewInit() {

        super.loading(true);

        this.requestSelect = { "idInstitucion": null, "idPais": null, "idStatus": null };

        this.service.post(this.requestSelect, this.uriServiceGeneral, 1).subscribe(
            data => {
                let responseService: any = JSON.parse(JSON.stringify(data));

                if (responseService.codE === 0) {

                    let categories: any[] = [];
                    let catValores: any[] = [];

                    for (let credito of responseService.jsonResultado) {
                        if (credito.name==="Interes") {
                            credito.name="Interés";
                        }
                        categories.push(credito.name);
                        catValores.push(credito.data[0]);
                    }

                    this.confGraficaColumnas = {
                        type: 'column',
                        title: '',
                        subtitle: '',
                        categories: [""],
                        titleCategories: '',
                        titleVertical: "Cantidad monetaria ($)",
                        valueSuffix: ' creditos',
                        allowDecimals: true,
                        drilldown: true,
                        pointPadding: 150,
                        showLegends: true,
                        formatLabel: ' $ ',
                        tooltip: true
                    };

                    this.grafica.CargarGrafica(responseService.jsonResultado, this.confGraficaColumnas);
                } else {
                    console.log("La respuesta contiene algun fallo -> [" + responseService.msgE + "]");
                }
            },
            error => {
                console.log("Ha ocurrido una falla en la peticion -> [" + error + "]");
            },
            () => super.loading(false)
        );
    }
    seleccionarColumna(_params) {

        if (typeof _params !== 'undefined') {
            if (_params.series.name==="Interés") {
                _params.series.name="Interes";
            }
            super.loading(true);
            console.log(_params);
            this.categorySelected = _params.series.name;

            this.requestSelect = { "idStatus": null, "tipo": _params.series.name };

            this.service.post(this.requestSelect, this.uriServiceDetail, 1).subscribe(
                data => {

                    let responseService: any = JSON.parse(JSON.stringify(data));

                    if (responseService.codE === 0) {

                        this.mostrarDetalle = true;

                        let categories: any[] = [];
                        let catValores: any[] = [];

                        for (let detalle of responseService.jsonResultado) {
                            categories.push(detalle.name);
                            catValores.push(detalle.data[0]);
                        }

                        this.confGraficaColumnas = {
                            type: 'column',
                            title: '',
                            subtitle: '',
                            categories: [""],
                            allowDecimals: true,
                            titleCategories: '',
                            titleVertical: "Cantidad monetaria ($)",
                            valueSuffix: ' creditos',
                            drilldown: false,
                            pointPadding: 100,
                            showLegends: true,
                            formatLabel: ' $ ',
                            tooltip: true
                        };

                        this.grafica.CargarGrafica(responseService.jsonResultado, this.confGraficaColumnas);
                    } else {
                        console.log("La respuesta contiene algun fallo -> [" + responseService.msgE + "]");
                    }
                },
                error => {
                    console.log("Ha ocurrido una falla en la peticion -> [" + error + "]");
                },
                () => super.loading(false)
            );
        }
    }
    regresar() {
        this.ngAfterViewInit();
        this.mostrarDetalle = false;
    }
}
