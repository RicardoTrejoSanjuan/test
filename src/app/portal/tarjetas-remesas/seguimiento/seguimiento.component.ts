import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,FormControl,Validators } from '@angular/forms';

import { Service } from '../../../service/service';
import { ClassGenerica } from '../../../classGeneric/config';
import { Notifications } from '../../../classGeneric/notifications';
import { TarjetasRemesaUtils } from '../tarjetas-remesa';

@Component({
	selector: "seguimiento-r",
	templateUrl: "seguimiento.component.html",
	styleUrls: ["../tarjetas-remesa.component.css"]
})

export class SeguimientoRemesaComponent extends ClassGenerica implements OnInit {

	public menuLateral: any[] = [];
	public utils: TarjetasRemesaUtils;

	public idManager: number;
	public numRemesa: string;
	public cadenaSeparador: string;
	public esMaganerGeneral: boolean;

	public responsableAntiguo: any;
	public listaRemesas: any[];
	public listaResponsables: any[];
	public listaResponsablesFiltrada: any[];

	public breadcumbsSeguimiento: string[];

	constructor(private _service: Service, private _notifications: Notifications) {
		super();
		this.menuLateral = this.getMenuLateral(1);
		this.menuNavigation = this.menuNavigation();

		let manager: any = super.getAttr("responsable");

		this.numRemesa = "";
		this.cadenaSeparador = "&nbsp;/&nbsp;";

		this.idManager = super.isValid(manager) ? manager.idResponsable : parseInt(super.isKeyUser(),0);

		this.responsableAntiguo = {};
		this.listaRemesas = [];
		this.listaResponsables = [];
		this.listaResponsablesFiltrada = [];
		this.breadcumbsSeguimiento = [];

		this.esMaganerGeneral = true;

		this.utils = new TarjetasRemesaUtils(this._service);
		this.menuLateral = this.utils.obtenerMenuLateralLimpio(this.menuLateral);
	}

	ngOnInit() {
		this.consultarDetalleSeguimiento();
		this.consultarLoteTarjetasSeguimiento();
	}

	consultarDetalleSeguimiento(): void {

			super.loading(true);

			let objUrls: any = this.utils.urlsTarjetasModule;

			let urlRequest: string = objUrls.seccionSeguimientoResponsables.consultaDistribucionTarjetas;

			let objRequest: object = {numRemesa: this.numRemesa,idManager: this.idManager};

			console.log(objRequest);

			this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(
				(data: any) => {
					let response: any = JSON.parse(JSON.stringify(data));
					console.log("Respuesta de la consulta de seguimiento -> ",response);
					if(response.codE === 0) {
						this.listaResponsables = response.jsonResultado;
						this._notifications.success("Correcto !!!",response.msgE);

						this.asignarManagerPrincipal();
						
					} else {
						this._notifications.info("Aviso !!!",response.msgE);
					}
					super.loading(false);
				}
			);
	}

	consultarLoteTarjetasSeguimiento(): void {

		super.loading(true);

		let objUrls: any = this.utils.urlsTarjetasModule;

		let urlRequest: string = objUrls.seccionRemesas.consultaRemesasPorEstatus;

		let objRequest: object = {status: 1};

		console.log(objRequest);

		this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(
			(data: any) => {
				let response: any = JSON.parse(JSON.stringify(data));
				console.log("Respuesta de la consulta de lote tarjetas de seguimiento -> ",response);
				if(response.codE === 0) {
					this.listaRemesas = response.jsonResultado;
					this._notifications.success("Correcto !!!",response.msgE);
					
				} else {
					this._notifications.info("Aviso !!!",response.msgE);
				}
				super.loading(false);
			}
		);
	}

	asignarManagerPrincipal(): void {

		this.esMaganerGeneral = true;
		this.limpiarListaResponsablesFiltrada();
		this.limpiarListaBreadcumbsSeguimiento();
		this.agregarValoresBreadcumbs(this.cadenaSeparador);

		let responsables_: any[] = this.listaResponsables;

		for(let responsable_ of responsables_) {
			if(responsable_.parent === "#") {
				this.agregarValoresResponsables(responsable_);
				break;
			}
		}
	}

	navegarResponsablesPorManager(_responsable_: any): void {
		
		let responsables_: any[] = this.listaResponsables;
		let responsablesRespaldo_: any[] = this.listaResponsablesFiltrada;

		this.limpiarListaResponsablesFiltrada();
		
		for(let _responsable of responsables_) {
			if(_responsable.parent !== "#") {
				let respParent: number = parseInt(_responsable.parent,0);
				if(respParent === _responsable_.id) {
					this.agregarValoresResponsables(_responsable);
				}
			}
		}

		if(this.listaResponsablesFiltrada.length > 0) {
			this.esMaganerGeneral = false;
			this.responsableAntiguo = _responsable_;
			this.agregarValoresBreadcumbs(this.obetenerNombreCompletoResponsable(_responsable_.text));
		}else {
			this.listaResponsablesFiltrada = responsablesRespaldo_;
			this._notifications.info("Aviso!!!","El empleado "+_responsable_.id+" no cuenta con responsables a su cargo");
		}

	}

	regresarNivelGerarquia(): void {

		if(this.responsableAntiguo.parent !== "#") {

			let responsables_: any[] = this.listaResponsables;
			
			for(let _responsable of responsables_) {

				let idResponsable: number = parseInt(_responsable.id,0);
				let idResponsableParent: number = parseInt(this.responsableAntiguo.parent,0);

				if(idResponsable === idResponsableParent) {
					this.reestablecerValoresBreadcumbs();
					this.navegarResponsablesPorManager(_responsable);
					break;
				}
			}

		} else {
			this.asignarManagerPrincipal();
		}
	}

	obetenerNombreCompletoResponsable(_cadena: string): string {

		let inicio: number = _cadena.indexOf("-");
		let final: number = _cadena.indexOf("</h4>");

		let cadena_final: string = _cadena.substring(inicio+1,final).trim();

		return cadena_final+this.cadenaSeparador;
	}

	limpiarListaResponsablesFiltrada(): void {
		this.listaResponsablesFiltrada = [];
	}

	limpiarListaBreadcumbsSeguimiento(): void {
		this.breadcumbsSeguimiento = [];
	}

	reestablecerValoresBreadcumbs(): void {
		this.breadcumbsSeguimiento.pop();
		this.breadcumbsSeguimiento.pop();
	}

	agregarValoresBreadcumbs(_cadena: string): void {
		if(super.isValid(_cadena)) {
			this.breadcumbsSeguimiento.push(_cadena);
		}
	}

	agregarValoresResponsables(_objeto: object): void {
		if(super.isValid(_objeto)) {
			this.listaResponsablesFiltrada.push(_objeto);
		}
	}
}