import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit,ViewChild } from '@angular/core';

import { Service } from '../../../../service/service';
import { ClassGenerica } from '../../../../classGeneric/config';
import { Notifications } from '../../../../classGeneric/notifications';
import { PaginationFron } from '../../../../classGeneric/paginationFront';

import { TarjetasRemesaUtils } from '../../tarjetas-remesa';

import { FilterTable } from '../../../../pipes/pipes-portal';
import { Ng2Tables } from '../../../../ng2-tables/ng2-tables.component';
import { ConfigNgTable2, PagesHandler} from '../../../../ng2-tables/ng2-tables';

import { JsonToCsv } from '../../../../classGeneric/jsontocsv';

@Component({
	selector: "f-detalle",
	templateUrl: "folios-detalle.component.html",
	styleUrls: ["../../tarjetas-remesa.component.css"]
})

export class FoliosDetalleComponent extends ClassGenerica implements OnInit {

	public menuLateral: any[];
	private utils: TarjetasRemesaUtils;

	
	public folioRemesa: any;
	private idResponsable: number;
	public listaEstatusFolio: any;
	private listaFoliosDetalle: any[];

	private generarCsv: boolean;

	public mostrarPaginadorTabla: boolean;
	public detalleFolioFiltrados: Array<Object>;
	public manejadorPaginas: PagesHandler = new PagesHandler();
	public cadena:any;
	@ViewChild('tablaDetalleFolio') tablaDetalleFolios_vc: Ng2Tables;

	constructor(private _service: Service,private _notifications: Notifications,private _location: Location,private _router: Router,private csvExport: JsonToCsv) {

		super();
		this.menuLateral = this.getMenuLateral(1);
		this.menuNavigation = this.menuNavigation();
		
		this.generarCsv = false;

		this.listaFoliosDetalle = [];
		this.detalleFolioFiltrados = [{}];

		this.listaEstatusFolio = {"pendiente": 1,"aceptado": 2,"rechazado": 3,"cancelado": 4};

		this.idResponsable = parseInt(super.isKeyUser(),0);

		this.folioRemesa = super.getAttr('folioRemesa');

		this.utils = new TarjetasRemesaUtils(this._service);
		this.menuLateral = this.utils.obtenerMenuLateralLimpio(this.menuLateral);
	}

	ngOnInit() {
		this.consultarDetalleFolio();

	}

	consultarDetalleFolio(): void {

		super.loading(true);

		let objUrls: any = this.utils.urlsTarjetasModule;

		let urlRequest: string = objUrls.seccionFolios.consultarFoliosDetalle;

		let objRequest: object = {idFolio: this.folioRemesa.idFolio,numTarjeta: null,pagina: null};

		console.log(objRequest);

		this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(
			(data: any) => {
				console.log("Respuesta de la consulta detalle de folios -> ",data);
				let response: any = JSON.parse(JSON.stringify(data));
				if(response.codE === 0) {

					if(!this.generarCsv) {
						this.listaFoliosDetalle = response.jsonResultado.consulta;
						this._notifications.success("Correcto !!!",response.msgE);
					} else {
						this.generarCsv = false;
						this._notifications.success("Correcto !!!","Los datos fueron exportados a un archivo Excel");
						this.csvExport.generateToExcel(response.jsonResultado.consulta,'Tarjetas_por_folio_'+this.folioRemesa.idFolio);
					}

					
				} else {
					this._notifications.info("Aviso !!!",response.msgE);
				}
				super.loading(false);
				this.filtrarFolios("");
			}
		);
	}

	exportarDatosModulo(): void {
		this.generarCsv = true;
		this.consultarDetalleFolio();
	}

	actualizarEstatusFolio(_idStatusFolio): void {

		if(super.isValid(_idStatusFolio)) {

			super.loading(true);

			let objUrls: any = this.utils.urlsTarjetasModule;
			let urlRequest: string = objUrls.seccionFolios.actualizarEstatusFolio;
			let objRequest: object = {"idFolio": this.folioRemesa.idFolio,"idStatus": _idStatusFolio,"usuario": this.isKeyUser()};

			console.log(objRequest);

			this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(
				(data: any) => {
					console.log("Respuesta de la actualizacion de folios -> ",data);
					let response: any = JSON.parse(JSON.stringify(data));
					if(response.codE === 0) {
						this._notifications.success("Correcto !!!",response.msgE);
					} else {
						this._notifications.info("Aviso !!!",response.msgE);
					}
					super.loading(false);
					/*this.consultarDetalleFolio();*/
					this.regresar();
				}
			);
		}
	}

	regresar(): void {
		this._location.back();
	}

	consultarDetalleTarjeta(folio: any): void {
		super.saveData(folio, 'tarjetaRemesa');
		this._router.navigate(['./tarjetas-remesa/detalle-tarjetas']);
	}

	filtrarFolios(_str: string): void {
		
		this.detalleFolioFiltrados = new FilterTable().transform(this.listaFoliosDetalle, _str);
		
		if(this.detalleFolioFiltrados.length > 0) {
			this.mostrarPaginadorTabla = true;
			setTimeout(() => {
				this.tablaDetalleFolios_vc.SetTabla(new ConfigNgTable2(this.detalleFolioFiltrados.length,10));
			},0);
		}else {
			this.mostrarPaginadorTabla = false;
		}
	}

	actualizarTablaFolios(_conf: any):void {
		this.manejadorPaginas = _conf;
	}
}