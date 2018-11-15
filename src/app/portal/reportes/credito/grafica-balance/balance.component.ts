import { Component, AfterViewInit, ViewChild} from '@angular/core';

import { Router } from '@angular/router';

import { Service } from '../../../../service/service';

import { ClassGenerica } from '../../../../classGeneric/config';

import { GraficaComponent } from '../../../../graficas-highchart/graficas-highchart.component';

import { ConfGraficaLine } from '../../../../interfaces/interfacesGraficas';

@Component({
	selector: 'reportes-balance',
	templateUrl: 'balance.component.html',
	styleUrls: ['../../credito/credito.component.css']
})

export class ReportesBalance extends ClassGenerica implements AfterViewInit {

	menuLateral: Array<Object>;
	confGraficaLineas: ConfGraficaLine;

	requestSelect: Object;
	uriServiceGeneral: String;
	uriServiceDetail: String;
	categorySelected: String;

	mostrarDetalle: Boolean;

	@ViewChild(GraficaComponent) grafica: GraficaComponent;

	constructor(private service:Service, private router:Router) {
		super();
		this.uriServiceGeneral = "/AsesorBig/detalleBalance";
		this.uriServiceDetail = "/AsesorBig/consultaBalancePorEstatus";
		this.menuLateral = this.getMenuLateral(1);
		this.categorySelected = "";
		console.log(this.menuLateral);
		this.menuNavigation = this.menuNavigation();
	}

	ngAfterViewInit() {
		super.loading(true);

		this.requestSelect = {"idInstitucion":null,"idPais":null,"idStatus":null};

		this.service.post(this.requestSelect,this.uriServiceGeneral,1).subscribe(
			data => {
				let responseService: any = JSON.parse(JSON.stringify(data));

				if(responseService.codE === 0) {

					let categories: any[] = [];
					let catValores: any[] = [];

					for(let balance of responseService.jsonResultado) {
						console.log("aqui esta",balance.name);
						 if (balance.name==="Interes Pagado") {
                            balance.name="Interés Pagado";
                        }
						categories.push(balance.name);
						catValores.push(balance.data[0]);
					}

					this.confGraficaLineas = {
						type: 'line',
                        title: null,
                        subtitle: null,
                        categories: categories,
                        titleScale: "Cantidad monetaria ($)",
                        drilldown: true,
                        showLegends: false
					};

					this.grafica.CargarGrafica([{name: "Total créditos",data: catValores}],this.confGraficaLineas);
				} else {
					console.log("La respuesta contiene algun fallo -> ["+responseService.msgE+"]");
				}
			},
			error => {
				console.log("Ha ocurrido una falla en la peticion -> ["+error+"]");
			},
			() => super.loading(false)
		);

	}
	seleccionarPunto(_params) {

        if (typeof _params !== 'undefined') {

            super.loading(true);
			if (_params.category==="Interés Pagado") {
					_params.category="Interes Pagado";
				}
            this.categorySelected = _params.category;

            this.requestSelect = {"idStatus": null,"tipo": _params.category};

            this.service.post(this.requestSelect,this.uriServiceDetail,1).subscribe(
            	data => {
            		let responseService: any = JSON.parse(JSON.stringify(data));

            		if(responseService.codE === 0) {

            			this.mostrarDetalle = true;

            			let categories: any[] = [];
						let catValores: any[] = [];

						for(let detalle of responseService.jsonResultado) {
							categories.push(detalle.name);
							catValores.push(detalle.data[0]);
						}

						this.confGraficaLineas = {
							type: 'line',
	                        title: null,
	                        subtitle: null,
	                        categories: categories,
	                        titleScale: "Cantidad monetaria ($)",
	                        drilldown: false,
	                        showLegends: false
						};

						this.grafica.CargarGrafica([{name: "Créditos",data: catValores}],this.confGraficaLineas);
					} else {
						console.log("La respuesta contiene algun fallo -> ["+responseService.msgE+"]");
					}
            	},
            	error => {
            		console.log("Ha ocurrido una falla en la peticion -> ["+error+"]");
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
