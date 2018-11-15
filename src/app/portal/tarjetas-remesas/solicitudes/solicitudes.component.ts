import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder,FormGroup,FormControl,Validators } from '@angular/forms';

import { Service } from '../../../service/service';
import { ClassGenerica } from '../../../classGeneric/config';
import { Notifications } from '../../../classGeneric/notifications';
import { PaginationFron } from '../../../classGeneric/paginationFront';

import { Ng2Tables } from '../../../ng2-tables/ng2-tables.component';
import { ConfigNgTable2, PagesHandler} from '../../../ng2-tables/ng2-tables';

import { FilterTable } from '../../../pipes/pipes-portal';
import { TarjetasRemesaUtils } from '../tarjetas-remesa';

import { JsonToCsv } from '../../../classGeneric/jsontocsv';

@Component({
	selector: "s-remesas",
	templateUrl: "solicitudes.component.html",
	styleUrls: ["../tarjetas-remesa.component.css"]
})

export class SolicitudesRemesaComponent extends ClassGenerica implements OnInit {

	menuLateral: any[] = [];

	public utils: TarjetasRemesaUtils;
	public _urlsModule: any;
	public idResponsable: number;
	public listaSolicitudes: any[];

	public generarCsv: boolean;
	public esCreacionItem: boolean;
	public mostrarPaginadorTabla: boolean;
	public mostrarFormularioSolicitud: boolean;

	public formularioSolicitud: any;

	public solicitudesFiltradas: Array<Object>;
	public pagesHandler: PagesHandler = new PagesHandler();
	public cadena:any;
	@ViewChild('tablasolicitudes') tablaSolicitudes: Ng2Tables;

	constructor(private service: Service,private notifications: Notifications,private pagination: PaginationFron,private formBuilder: FormBuilder,private csvExport: JsonToCsv) {

		super();

		this.menuLateral = this.getMenuLateral(1);
		this.menuNavigation = this.menuNavigation();

		this.utils = new TarjetasRemesaUtils(this.service);
		let urls: any = this.utils.urlsTarjetasModule;
		this._urlsModule = urls.seccionSolicitudes;
		this.menuLateral = this.utils.obtenerMenuLateralLimpio(this.menuLateral);

		this.idResponsable = parseInt(super.isKeyUser(),0);
		
		this.listaSolicitudes = [];
		this.solicitudesFiltradas = [{}];

		this.generarCsv = false;
		this.esCreacionItem = false;
		this.mostrarPaginadorTabla = true;
		this.mostrarFormularioSolicitud = false;

		this.formularioSolicitud = this.formBuilder.group(
			{
				'numeroRemesas': ['',Validators.compose([Validators.required,Validators.maxLength(3)])],
				'numeroTarjetas': ['',Validators.compose([Validators.required,Validators.maxLength(5)])]
			}
		);
	}

	ngOnInit() {
		this.consultarSolicitudesPorResponsable();
	}

	crearSolicitud(_form: any): void {
		if(super.isValid(_form.numeroRemesas) && super.isValid(_form.numeroTarjetas)) {

			super.loading(true);
			
			let urlRequest: string = this._urlsModule.altaSolicitud;

			let objRequest: object = {
				idResponsable: this.idResponsable,
				numRemesas: _form.numeroRemesas,
				numTarjetasRemesa: _form.numeroTarjetas,
				tipoTarjeta: "VM"
			};
			console.log(objRequest);
			this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(
				(data: any) => {
					console.log("Respuesta del alta de solicitudes -> ",data);

					if(data.codE === 0) {
						this.notifications.success("Correcto !!!",data.msgE);
					} else {
						this.notifications.info("Aviso !!!",data.msgE);
					}

					super.loading(false);
					this.ocultarFormularioSolicitudes();
					this.consultarSolicitudesPorResponsable();
				}
			);
		}
	}

	consultarSolicitudesPorResponsable(): void {
		super.loading(true);
		let urlRequest: string = this._urlsModule.consultaSolicitudesPorResponsable;

		let objRequest: object = {idStatus: null,idResponsable: this.idResponsable};
		console.log(objRequest);
		this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(
			(data: any) => {
				console.log("Respuesta de la consulta de solicitudes -> ",data);
				if(data.codE === 0) {

					let response: any = JSON.parse(JSON.stringify(data.jsonResultado));

					if(!this.generarCsv) {
						this.listaSolicitudes = response;
						this.notifications.success("Correcto !!!",data.msgE);
					} else {
						this.generarCsv = false;
						this.notifications.success("Correcto !!!","Los datos fueron exportados a un archivo Excel");
						this.csvExport.generateToExcel(response,'Solicitudes_por_responsable_'+this.idResponsable);
					}

				} else {
					this.notifications.info("Aviso !!!",data.msgE);
				}

				super.loading(false);
				this.filtrarSolicitudes("");
			}
		);
	}

	exportarDatosModulo(): void {
		this.generarCsv = true;
		this.consultarSolicitudesPorResponsable();
	}

	abrirModalCreacion(): void {
		this.esCreacionItem = true;
		this.mostrarFormularioSolicitudes();
	}

	abrirModalModificacion(): void {
		this.esCreacionItem = false;
		this.mostrarFormularioSolicitudes();
	}

	mostrarFormularioSolicitudes(): void {
		this.limpiarFormularioSolicitudes();
		this.mostrarFormularioSolicitud = true;
	}

	ocultarFormularioSolicitudes(): void {
		this.mostrarFormularioSolicitud = false;
	}

	limpiarFormularioSolicitudes(): void {
		this.formularioSolicitud.controls['numeroRemesas'].reset({value: "", disabled: false});
		this.formularioSolicitud.controls['numeroTarjetas'].reset({value: "", disabled: false});
	}

	filtrarSolicitudes(_str: string): void {
		
		this.solicitudesFiltradas = new FilterTable().transform(this.listaSolicitudes, _str);
		
		if(this.solicitudesFiltradas.length > 0) {
			this.mostrarPaginadorTabla = true;
			setTimeout(() => {
				this.tablaSolicitudes.SetTabla(new ConfigNgTable2(this.solicitudesFiltradas.length,10));
			},0);
		}else {
			this.mostrarPaginadorTabla = false;
		}
	}

	actualizarTablaSolicitudes(_conf: any):void {
		this.pagesHandler = _conf;
	}
}