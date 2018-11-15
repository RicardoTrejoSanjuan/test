import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { Service } from '../../../../service/service';
import { ClassGenerica } from '../../../../classGeneric/config';
import { Notifications } from '../../../../classGeneric/notifications';
import { TarjetasRemesaUtils } from '../../tarjetas-remesa';

@Component({
	selector: "t-detalle",
	templateUrl: "tarjetas-detalle.component.html",
	styleUrls: ["../../tarjetas-remesa.component.css"]
})

export class TarjetasDetalleComponent extends ClassGenerica implements OnInit {

	public menuLateral: any[];
	public numRemesa: string;
	public tarjetaRemesa: any;
	public utils: TarjetasRemesaUtils;

	public listaDetallesTarjeta: any[];

	constructor(private service: Service,private notifications: Notifications,private router: Router,private location: Location) {

		super();
		this.menuLateral = this.getMenuLateral(1);
		this.menuNavigation = this.menuNavigation();

		this.numRemesa = "";
		this.tarjetaRemesa = super.getAttr("tarjetaRemesa");
		console.log(this.tarjetaRemesa);
		this.listaDetallesTarjeta = [];
		this.utils = new TarjetasRemesaUtils(this.service);
		this.menuLateral = this.utils.obtenerMenuLateralLimpio(this.menuLateral);
	}

	ngOnInit() {
		this.consultarDetalleTarjeta();
	}

	consultarDetalleTarjeta(): void {

		super.loading(true);

		let objUrls: any = this.utils.urlsTarjetasModule;

		let urlRequest: string = objUrls.seccionTarjetasRemesa.consultaDetalleTarjeta;

		let objRequest: object = {numTarjeta: this.tarjetaRemesa.numTarjeta};

		console.log(objRequest);

		this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(
			(data: any) => {
				console.log("Respuesta de la consulta de tarjetas -> ",data);
				if(data.codE === 0) {

					let response: any = JSON.parse(JSON.stringify(data.jsonResultado));

					for(let tarjeta of response) {

						let objFechaFragmentada: object;
						let cadenaFecha: string = tarjeta.fechaRecibido;

						if(super.isValid(cadenaFecha)) {
							let arrayFecha: string[] = cadenaFecha.split("-");
							objFechaFragmentada  = {"dia": arrayFecha[0],"mes": arrayFecha[1],"anio": arrayFecha[2]};
						} else {
							objFechaFragmentada = {"dia": "?","mes": "?","anio": "?"};
						}

						
						tarjeta.fechaFragmentada = objFechaFragmentada;

						this.listaDetallesTarjeta.push(tarjeta);
						
						if(super.isValid(this.numRemesa)) {
							if(this.numRemesa === tarjeta.fcNumRemesa) {
								continue;
							}
						}

						this.numRemesa = tarjeta.fcNumRemesa;
					}

					console.log("Respuesta modificada -> ",this.listaDetallesTarjeta);
					/*this.numRemesa = "xxxxxxxxxxxxxxxxxxxxxxxxxxx";
					this.listaDetallesTarjeta = [
						{
							comentario:"Se entrego de forma incoherente",
							fechaRecibido:"31-01-2017",
							idFolio:1008,
							idOtorgante:178720,
							idReceptor:172578,
							idStatus:1,
							idTipoMov:1,
							numTarjetas:2,
							otorgante:"Nydia Valencia Molina",
							receptor:"Luis Alfredo Sánchez Ángeles",
							status:"PENDIENTE",
							tipoMov:"ENTREGAR"
						},
						{
							comentario:null,
							fechaRecibido:null,
							idFolio:1008,
							idOtorgante:178720,
							idReceptor:172578,
							idStatus:1,
							idTipoMov:1,
							numTarjetas:2,
							otorgante:"Nydia Valencia Molina",
							receptor:"Luis Alfredo Sánchez Ángeles",
							status:"PENDIENTE",
							tipoMov:"ENTREGAR"
						},
						{
							comentario:null,
							fechaRecibido:null,
							idFolio:1008,
							idOtorgante:178720,
							idReceptor:172578,
							idStatus:1,
							idTipoMov:1,
							numTarjetas:2,
							otorgante:"Nydia Valencia Molina",
							receptor:"Luis Alfredo Sánchez Ángeles",
							status:"PENDIENTE",
							tipoMov:"ENTREGAR"
						},
						{
							comentario:null,
							fechaRecibido:null,
							idFolio:1008,
							idOtorgante:178720,
							idReceptor:172578,
							idStatus:1,
							idTipoMov:1,
							numTarjetas:2,
							otorgante:"Nydia Valencia Molina",
							receptor:"Luis Alfredo Sánchez Ángeles",
							status:"PENDIENTE",
							tipoMov:"ENTREGAR"
						},
						{
							comentario:null,
							fechaRecibido:null,
							idFolio:1008,
							idOtorgante:178720,
							idReceptor:172578,
							idStatus:1,
							idTipoMov:1,
							numTarjetas:2,
							otorgante:"Nydia Valencia Molina",
							receptor:"Luis Alfredo Sánchez Ángeles",
							status:"PENDIENTE",
							tipoMov:"ENTREGAR"
						},
						{
							comentario:null,
							fechaRecibido:null,
							idFolio:1008,
							idOtorgante:178720,
							idReceptor:172578,
							idStatus:1,
							idTipoMov:1,
							numTarjetas:2,
							otorgante:"Nydia Valencia Molina",
							receptor:"Luis Alfredo Sánchez Ángeles",
							status:"PENDIENTE",
							tipoMov:"ENTREGAR"
						},
						{
							comentario:null,
							fechaRecibido:null,
							idFolio:1008,
							idOtorgante:178720,
							idReceptor:172578,
							idStatus:1,
							idTipoMov:1,
							numTarjetas:2,
							otorgante:"Nydia Valencia Molina",
							receptor:"Luis Alfredo Sánchez Ángeles",
							status:"PENDIENTE",
							tipoMov:"ENTREGAR"
						}
					];*/
					this.notifications.success("Correcto !!!",data.msgE);
				} else {
					this.notifications.info("Aviso !!!",data.msgE);
				}
				super.loading(false);
			}
		);
	}

	regresar(): void {
		this.location.back();
	}
}