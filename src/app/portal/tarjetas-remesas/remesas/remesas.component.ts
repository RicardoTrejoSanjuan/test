import { Router } from '@angular/router';
import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder,FormGroup,FormControl,Validators } from '@angular/forms';

import { Service } from '../../../service/service';
import { ClassGenerica } from '../../../classGeneric/config';
import { Notifications } from '../../../classGeneric/notifications';
import { PaginationFron } from '../../../classGeneric/paginationFront';
import { DirectivesModule } from '../../../directives/directive.module';

import { Ng2Tables } from '../../../ng2-tables/ng2-tables.component';
import { ConfigNgTable2, PagesHandler} from '../../../ng2-tables/ng2-tables';

import { FilterTable } from '../../../pipes/pipes-portal';
import { TarjetasRemesaUtils } from '../tarjetas-remesa';

import { JsonToCsv } from '../../../classGeneric/jsontocsv';

@Component({
	selector: "remesas",
	templateUrl: "remesas.component.html",
	styleUrls: ["../tarjetas-remesa.component.css"]
})

export class RemesasComponent extends ClassGenerica implements OnInit {

	menuLateral: any[] = [];

	private utils: TarjetasRemesaUtils;
	private _urlsModule: any;
	private idResponsable: number;
	private listaRemesas: any[];
	public listaSolicitudes: any[];
	public formularioRecepcionRemesa: any;

	private generarCsv: boolean;
	public mostrarPaginadorTabla: boolean;
	public mostrarFormularioRecepcionar: boolean;

	public remesasFiltradas: Array<Object>;
	public pagesHandler: PagesHandler = new PagesHandler();
	public cadena:any;
	@ViewChild('tablaremesas') tablaRemesas: Ng2Tables;

	constructor(private service: Service,private notifications: Notifications,private pagination: PaginationFron,private formBuilder: FormBuilder,private csvExport: JsonToCsv,private _router: Router) {
		super();

		this.menuLateral = this.getMenuLateral(1);
		this.menuNavigation = this.menuNavigation();

		this.utils = new TarjetasRemesaUtils(this.service);
		let urls: any = this.utils.urlsTarjetasModule;
		this._urlsModule = urls.seccionRemesas;
		this.menuLateral = this.utils.obtenerMenuLateralLimpio(this.menuLateral);

		this.idResponsable = parseInt(super.isKeyUser(),0);

		this.listaRemesas = [];
		this.listaSolicitudes = [];
		this.remesasFiltradas = [{}];

		this.generarCsv = false;
		this.mostrarPaginadorTabla = true;

		this.formularioRecepcionRemesa = this.formBuilder.group(
            {
                "numeroRemesa": ["",Validators.required],
                "numeroGuia": ["",Validators.required],
                "numeroSolicitud": [""]
            }
        );
	}

	ngOnInit() {
		this.consultarLoteRemesasPorEstatus();
		this.consultarSolicitudesRemesa();
	}

	crearRecepcionRemesa(_recepcion: any): void {

		if(super.isValid(_recepcion)) {

			let numeroGuia: number = super.isValid(_recepcion.numeroGuia) ? parseInt(_recepcion.numeroGuia,0) : null;
			let numeroRemesa: number = super.isValid(_recepcion.numeroRemesa) ? _recepcion.numeroRemesa : null;
			let numeroSolicitud: number = super.isValid(_recepcion.numeroSolicitud) ? parseInt(_recepcion.numeroSolicitud,0) : null;
			
			super.loading(true);

			let objUrls: any = this.utils.urlsTarjetasModule;

			let urlRequest: string = objUrls.seccionSolicitudes.recepcionarSolicitudRemesa;

			let objRequest: object = {numGuia: numeroGuia,numRemesa: numeroRemesa,idSolicitud: numeroSolicitud};

			console.log(objRequest);
			this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(
				(data: any) => {
					console.log("Respuesta de la recepcion de solicitud -> ",data);
					if(data.codE === 0) {
						this.notifications.success("Correcto !!!",data.msgE);
					}else {
						this.notifications.info("Aviso !!!",data.msgE);
					}

					super.loading(false);
					this.consultarLoteRemesasPorEstatus();
					this.cerrarFormularioRecepcion();
				}
			);

		}
	}

	consultarLoteRemesasPorEstatus(): void {

		super.loading(true);

		let urlRequest: string = this._urlsModule.consultaRemesasPorEstatus;

		let objRequest: object = {status: null};
		console.log(objRequest);
		this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(
			(data: any) => {
				console.log("Respuesta de la consulta de remesas -> ",data);
				if(data.codE === 0) {

					let response: any = JSON.parse(JSON.stringify(data.jsonResultado));

					if(!this.generarCsv) {
						this.listaRemesas = response;
						this.notifications.success("Correcto !!!",data.msgE);
					} else {
						this.generarCsv = false;
						this.notifications.success("Correcto !!!","Los datos fueron exportados a un archivo Excel");
						this.csvExport.generateToExcel(response,'Remesas_por_estatus_'+super.isKeyUser());
					}
					
				}else {
					this.notifications.info("Aviso !!!",data.msgE);
				}

				super.loading(false);
				this.filtrarRemesas("");
			}
		);
	}

	consultarSolicitudesRemesa(): void {

		super.loading(true);

		let objUrls: any = this.utils.urlsTarjetasModule;

		let urlRequest: string = objUrls.seccionSolicitudes.consultaSolicitudesPorResponsable;

		let objRequest: object = {idStatus: null,idResponsable: this.idResponsable};

		console.log(objRequest);
		this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(
			(data: any) => {
				console.log("Respuesta de la consulta de solicitudes -> ",data);
				if(data.codE === 0) {
					let response: any = JSON.parse(JSON.stringify(data.jsonResultado));
					this.listaSolicitudes = response;
					/*this.notifications.success("Correcto !!!",data.msgE);*/
				}else {
					this.notifications.info("Aviso !!!",data.msgE);
				}

				super.loading(false);
			}
		);
	}

	cerrarFormularioRecepcion(): void {
        this.mostrarFormularioRecepcionar = false;
    }

    abrirFormularioRecepcion(): void {
        this.limpiarFormularioRecepcion();
        this.mostrarFormularioRecepcionar = true;
    }

    limpiarFormularioRecepcion(): void {
        this.formularioRecepcionRemesa.controls['numeroRemesa'].reset({value : "", disabled: false});
        this.formularioRecepcionRemesa.controls['numeroGuia'].reset({value : "", disabled: false});
        this.formularioRecepcionRemesa.controls['numeroSolicitud'].reset({value : "", disabled: false});
    }

	consultarDetalleRemesa(remesa_: any): void {
		super.saveData(remesa_, 'remesa');
		this._router.navigate(['./tarjetas-remesa/detalle-remesas']);
	}

	exportarDatosModulo(): void {
		this.generarCsv = true;
		this.consultarLoteRemesasPorEstatus();
	}

	filtrarRemesas(_str: string): void {
		
		this.remesasFiltradas = new FilterTable().transform(this.listaRemesas, _str);
		
		if(this.remesasFiltradas.length > 0) {
			this.mostrarPaginadorTabla = true;
			setTimeout(() => {
				this.tablaRemesas.SetTabla(new ConfigNgTable2(this.remesasFiltradas.length,10));
			},0);
		}else {
			this.mostrarPaginadorTabla = false;
		}
	}

	actualizarTablaRemesas(_conf: any):void {
		this.pagesHandler = _conf;
	}
}