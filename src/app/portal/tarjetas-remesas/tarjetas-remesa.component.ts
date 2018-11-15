import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Service } from '../../service/service';
import { ClassGenerica } from '../../classGeneric/config';
import { Notifications } from '../../classGeneric/notifications';

import { TarjetasRemesaUtils } from './tarjetas-remesa';

import { ConfGraficaBasicArea } from '../../interfaces/interfacesGraficas';
import { GraficaComponent } from '../../graficas-highchart/graficas-highchart.component';

@Component({
    selector: "t-remesas",
    templateUrl: "tarjetas-remesa.component.html",
    styleUrls: ["tarjetas-remesa.component.css"]
})

export class TarjetasRemesaComponent extends ClassGenerica {

    public menuLateral: any[] = [];

    public utils: TarjetasRemesaUtils;
    public _urlsModule: any;
    public idResponsable: number;

    public fechaBusqueda: any;
    public maxFechaGeneral: any;
    public minFechaGeneral: any;

    public responsableData: any;
    public configGrafica: ConfGraficaBasicArea;

    public isAvailable:any;

    @ViewChild(GraficaComponent) grafica: GraficaComponent;

    constructor(private service: Service, private notifications: Notifications) {

        super();

        this.menuLateral = this.getMenuLateral();
        this.menuNavigation = this.menuNavigation();



        this.utils = new TarjetasRemesaUtils(this.service);
        this._urlsModule = this.utils.urlsTarjetasModule;
        this.menuLateral = this.utils.obtenerMenuLateralLimpio(this.menuLateral);

        this.idResponsable = parseInt(super.isKeyUser(), 0);

        this.responsableData = {};

        this.maxFechaGeneral = new Date();
        this.minFechaGeneral = new Date(2017, 0, 1);

        this.consultarDatosResponsable();
        this.consultarDatosGrafica(null);

    }

    consultarDatosGrafica(fechaInicio: any): void {
        // super.loading(true);
        let urlRequest: string = this._urlsModule.seccionGraficaTarjetas.consultaDatosGrafica;

        let objRequest: object = { fechainicio: fechaInicio, idRemesa: null, idManager: null };

        this.utils.realizarPeticionHttp(objRequest, urlRequest).subscribe(
            (data: any) => {

                if (data.codE === 0) {

                    let response: any = JSON.parse(JSON.stringify(data.jsonResultado));

                    this.notifications.success("Correcto !!!", data.msgE);

                    if (response.DisponiblesFecha.length === response.EntregadaFecha.length) {
                        let dispFecha: any = response.DisponiblesFecha;
                        let dispTotal: any = response.DisponiblesTotal;
                        let entTotal: any = response.EntregadaTotal;
                        let arrData: object[] = [];

                        this.configGrafica = {
                            type: 'basicArea',
                            title: '',
                            subtitle: '',
                            categories: dispFecha,
                            titleScale: 'Numero de tarjetas',
                            titleSufixTooltip: 'tarjetas',
                            splitTooltip: true,
                            drilldown: false
                        };

                        let disponibles: any = { name: "Disponibles", data: dispTotal };
                        let entregadas: any = { name: "Entregadas", data: entTotal };
                        arrData.push(disponibles);
                        arrData.push(entregadas);
                        this.grafica.CargarGrafica(arrData, this.configGrafica);

                    }

                } else {
                    this.notifications.info("Aviso !!!", data.msgE);
                }

                // super.loading(false);
            }
        );
    }

    consultarDatosResponsable(): void {
        // super.loading(true);
        let urlRequest: string = this._urlsModule.seccionGraficaTarjetas.consultaDatosResponsable;

        let objRequest: object = { idResponsable: this.idResponsable };

        this.utils.realizarPeticionHttp(objRequest, urlRequest).subscribe(
            (data: any) => {

                if (data.codE === 0) {

                    let response: any = JSON.parse(JSON.stringify(data.jsonResultado));
                    this.responsableData = response.datosResponsables[0];
                    this.notifications.success("Correcto !!!", data.msgE);

                } else {
                    this.notifications.info("Aviso !!!", data.msgE);
                }

                // super.loading(false);
            }
        );
    }

    asignarFechaBusqueda(): void {

        let fechaB: any = this.fechaBusqueda !== null ? moment(this.fechaBusqueda).format("DD-MM-YYYY") : null;

        super.loading(true);
        this.consultarDatosGrafica(fechaB);
    }
}
