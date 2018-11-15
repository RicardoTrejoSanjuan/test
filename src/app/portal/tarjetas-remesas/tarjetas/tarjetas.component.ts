import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,FormGroup,FormControl,Validators } from '@angular/forms';

import { Service } from '../../../service/service';
import { ClassGenerica } from '../../../classGeneric/config';
import { Notifications } from '../../../classGeneric/notifications';
import { DirectivesModule } from '../../../directives/directive.module';

import { Ng2Tables } from '../../../ng2-tables/ng2-tables.component';
import { ConfigNgTable2, PagesHandler} from '../../../ng2-tables/ng2-tables';

import { FilterTable } from '../../../pipes/pipes-portal';
import { TarjetasRemesaUtils } from '../tarjetas-remesa';

import { JsonToCsv } from '../../../classGeneric/jsontocsv';

@Component({
	selector: "tarjetas-r",
	templateUrl: "tarjetas.component.html",
	styleUrls: ["../tarjetas-remesa.component.css"]
})

export class TarjetasComponent extends ClassGenerica implements OnInit {

	menuLateral: any[] = [];

	public utils: TarjetasRemesaUtils;
	public _urlsModule: any;

	public idRemesa: any;
	public idResponsable: number;
	public listaTarjetas: any[];
	public listaRemesas: any[];

	public generarCsv: boolean;
	public mostrarPaginadorTabla: boolean;

	public tarjetasFiltradas: Array<Object>;
	public pagesHandler: PagesHandler = new PagesHandler();
	public cadena:any;
	@ViewChild('tablatarjetas') tablaTarjetas: Ng2Tables;

	constructor(private service: Service,private notifications: Notifications,private formBuilder: FormBuilder,private router: Router,private csvExport: JsonToCsv) {
		
		super();
		
		this.menuLateral = this.getMenuLateral(1);
		this.menuNavigation = this.menuNavigation();

		this.utils = new TarjetasRemesaUtils(this.service);
		let urls: any = this.utils.urlsTarjetasModule;
		this._urlsModule = urls.seccionTarjetasRemesa;
		this.menuLateral = this.utils.obtenerMenuLateralLimpio(this.menuLateral);

		this.generarCsv = false;

		this.idRemesa = "";

		this.idResponsable = parseInt(super.isKeyUser(),0);

		this.listaTarjetas = [];
		this.listaRemesas = [];
		this.tarjetasFiltradas = [{}];
	}

	ngOnInit() {
		this.consultarLoteTarjetasPorRemesa();
		this.consultarRemesas();
	}

	consultarLoteTarjetasPorRemesa(): void {

		super.loading(true);

		let urlRequest: string = this._urlsModule.consultaTarjetasPorRemesa;
		let objRequest: object = {idRemesa: this.idRemesa,idStatus: null,idResponsable: this.idResponsable,numTarjeta: null,pagina: null};
		console.log(objRequest);
		this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(
			(data: any) => {
				console.log("Respuesta de la consulta de tarjetas -> ",data);

				if(data.codE === 0) {
					let response: any = JSON.parse(JSON.stringify(data.jsonResultado));


					if(!this.generarCsv) {
						this.listaTarjetas = response.consulta;
						this.notifications.success("Correcto !!!",data.msgE);
					} else {
						this.generarCsv = false;
						this.notifications.success("Correcto !!!","Los datos fueron exportados a un archivo Excel");
						this.csvExport.generateToExcel(response.consulta,'LoteTarjetas_por_remesa_'+this.idResponsable);
					}

				} else {
					this.notifications.info("Aviso !!!",data.msgE);
				}

				super.loading(false);
				this.filtrarTarjetas("");
			}
		);
	}

	exportarDatosModulo(): void {
		this.generarCsv = true;
		this.consultarLoteTarjetasPorRemesa();
	}

	consultarRemesas(): void {

		super.loading(true);

		let urlsRemesa: any = this.utils.urlsTarjetasModule;

		let urlRequest: string = urlsRemesa.seccionRemesas.consultaRemesasPorEstatus;
		let objRequest: object = {status: 1};

		console.log(objRequest);
		this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(
			(data: any) => {
				console.log("Respuesta de la consulta de remesas -> ",data);
				if(data.codE === 0) {

					let response: any = JSON.parse(JSON.stringify(data.jsonResultado));
					this.listaRemesas = response;
					this.notifications.success("Correcto !!!",data.msgE);

				} else {
					this.notifications.info("Aviso !!!",data.msgE);
				}

				super.loading(false);
			}
		);
	}

	consultarDetalleTarjeta(tarjeta: any): void {
		super.saveData(tarjeta, 'tarjetaRemesa');
		this.router.navigate(['./tarjetas-remesa/detalle-tarjetas']);
	}

	filtrarTarjetas(_str: string): void {
		
		this.tarjetasFiltradas = new FilterTable().transform(this.listaTarjetas, _str);
		
		if(this.tarjetasFiltradas.length > 0) {
			this.mostrarPaginadorTabla = true;
			setTimeout(() => {
				this.tablaTarjetas.SetTabla(new ConfigNgTable2(this.tarjetasFiltradas.length,10));
			},0);
		}else {
			this.mostrarPaginadorTabla = false;
		}
	}

	actualizarTablaTarjetas(_conf: any):void {
		this.pagesHandler = _conf;
	}
}