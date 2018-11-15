import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RequestOptions,Headers,Http,URLSearchParams } from '@angular/http';
import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder,FormGroup,FormControl,Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Service } from '../../../service/service';
import { CryptoJSi } from '../../../classGeneric/CryptoJS';
// import { PathService } from '../../../classGeneric/config';

// import { PathService } from "../../../classGeneric/environments/environment.ts/environment";
import { PathServicedes } from "../../../classGeneric/environments/des/environment";
import { PathServiceprod } from "../../../classGeneric/environments/prod/environment";

import { Notifications } from '../../../classGeneric/notifications';

import { TarjetasRemesaUtils } from '../tarjetas-remesa';

import { FilterTable } from '../../../pipes/pipes-portal';
import { Ng2Tables } from '../../../ng2-tables/ng2-tables.component';
import { ConfigNgTable2, PagesHandler} from '../../../ng2-tables/ng2-tables';

import { JsonToCsv } from '../../../classGeneric/jsontocsv';

@Component({
	selector: "f-remesas",
	templateUrl: "folios.component.html",
	styleUrls: [
		"../tarjetas-remesa.component.css",
		"../../reportes/credito/credito.component.css"
	]
})

export class FoliosRemesaComponent extends CryptoJSi implements OnInit {

	public menuLateral: any[];
	public listaFoliosRemesa: any[];
	public utils: TarjetasRemesaUtils;

	public generarCsv: boolean;
	public mostrarFormularioFolio: boolean;
	public mostrarModalConfirmacion: boolean;
	public formularioSolicitudFolio: any;
	public listaTiposMovimiento: any[];
	public listaResponsables: any[];
	public listaResponsablesFiltrados: any[];
	public listaLotesTarjetas: any [];
	public listaTarjetasDisponibles: any[];
	public listaTarjetasSeleccion: any[];

	public file: File;
	public formData: FormData;
	
	public responsable: any;
	
	public remesa: any;
	public manejadorTabs: any;
	private numeroTarjetasSeleccion: any;

	public mostrarPaginadorTabla: boolean;
	public foliosFiltrados: Array<Object>;
	public manejadorPaginas: PagesHandler = new PagesHandler();
	public cadena:any;
	public solicitarFolio:any;
	@ViewChild('tablaFolios') tablaFolios_vc: Ng2Tables;
	@ViewChild('archivoTarjetas') archivo: ElementRef;

	constructor(private _service: Service,private _notifications: Notifications,private _http: Http,private _router: Router,private _location: Location,private _formBuilder: FormBuilder,private csvExport: JsonToCsv) {
		super();
		this.menuLateral = this.getMenuLateral(1);
		this.menuNavigation = this.menuNavigation();
		
		this.generarCsv = false;
		this.mostrarFormularioFolio = false;
		this.mostrarModalConfirmacion = false;

		this.listaFoliosRemesa = [];
		this.listaTiposMovimiento = [];
		this.listaLotesTarjetas = [];
		this.listaTarjetasDisponibles = [];
		this.listaTarjetasSeleccion = [];
		this.listaResponsablesFiltrados = [];

		this.file = null;
		this.responsable = {};
		this.formData = new FormData();

		this.listaFoliosRemesa = [];
		this.foliosFiltrados = [{}];
		this.numeroTarjetasSeleccion = 0;
		
		this.manejadorTabs = {showTabOne: true,showTabTwo: false};

		this.utils = new TarjetasRemesaUtils(this._service);
		this.menuLateral = this.utils.obtenerMenuLateralLimpio(this.menuLateral);

		this.formularioSolicitudFolio = this._formBuilder.group(
			{
				"idTipoMovimiento": [null,Validators.required],
				"idOtorgante": [null],
				"idReceptor": [null,Validators.required],
				"comentarios": [null,Validators.required],
				"numeroTarjetas": [null,Validators.required]
			}
		);
	}

	ngOnInit() {
		this.consultarFoliosRemesa();
		this.consultarTiposMovimiento();
		this.consultarResponsables();
		this.consultarRemesasDisponibles();
	}

	consultarFoliosRemesa(): void {

		super.loading(true);

		let objUrls: any = this.utils.urlsTarjetasModule;

		let urlRequest: string = objUrls.seccionFolios.consultarFoliosPorEstatus;

		let objRequest: object = {idStatus: null,idResponsable: parseInt(super.isKeyUser(),0)};

		console.log(objRequest);

		this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(
			(data: any) => {
				console.log("Respuesta de la consulta de folios -> ",data);
				let response: any = JSON.parse(JSON.stringify(data));
				if(response.codE === 0) {

					if(!this.generarCsv) {
						this.listaFoliosRemesa = response.jsonResultado;
						this._notifications.success("Correcto !!!",response.msgE);
					} else {
						this.generarCsv = false;
						this._notifications.success("Correcto !!!","Los datos fueron exportados a un archivo Excel");
						this.csvExport.generateToExcel(response.jsonResultado,'Folios_por_remesa_'+super.isKeyUser());
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
		this.consultarFoliosRemesa();
	}

	consultarTiposMovimiento(): void {

		super.loading(true);

		let objUrls: any = this.utils.urlsTarjetasModule;

		let urlRequest: string = objUrls.seccionCatalogosGenerales.consultaTiposMovimientoCat;

		let objRequest: object = {idTipoMov: null,status: null,descripcion: ''};

		console.log(objRequest);

		this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(
			(data: any) => {
				let response: any = JSON.parse(JSON.stringify(data));
				console.log("Respuesta de la consulta de tipos de movimiento -> ",response);
				if(response.codE === 0) {
					this.listaTiposMovimiento = response.jsonResultado;
					/*this._notifications.success("Correcto !!!",response.msgE);*/
				} else {
					this._notifications.info("Aviso !!!",response.msgE);
				}
				super.loading(false);
			}
		);
	}

	consultarResponsables(): void {

		super.loading(true);

		let objUrls: any = this.utils.urlsTarjetasModule;

		let urlRequest: string = objUrls.seccionResponsables.consultaResponsables;

		let objRequest: object = {idStatus: 1,idResponsable: null,nombre: '',idManager: null};
		console.log(objRequest);
		this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(

			(data: any) => {
				let response: any = JSON.parse(JSON.stringify(data));
				console.log("Respuesta de la consulta de responsables -> ",response);
				if(response.codE === 0) {
					this.listaResponsables = response.jsonResultado;
					/*this._notifications.success("Correcto !!!",response.msgE);*/
					this.obtenerResponsableSesion();
				} else {
					this._notifications.info("Aviso !!!",response.msgE);
				}
				super.loading(false);
			}
		);
	}

	obtenerResponsableSesion(): void {
		for(let _responsable of this.listaResponsables) {
			if(parseInt(super.isKeyUser(),0) === _responsable.idResponsable) {
				this.responsable = _responsable;
				break;
			}
		}
	}

	consultarRemesasDisponibles(): void {

		super.loading(true);

		let objUrls: any = this.utils.urlsTarjetasModule;

		let urlRequest: string = objUrls.seccionRemesas.consultaRemesasTarjetasDisponibles;

		let objRequest: object = {idResponsable: super.isKeyUser()};
		console.log(objRequest);
		this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(

			(data: any) => {
				let response: any = JSON.parse(JSON.stringify(data));
				console.log("Respuesta de la consulta de remesas disponibles -> ",response);
				if(response.codE === 0) {
					this.listaLotesTarjetas = response.jsonResultado;
					/*this._notifications.success("Correcto !!!",response.msgE);*/
				} else {
					this._notifications.info("Aviso !!!",response.msgE);
				}
				super.loading(false);
			}
		);
	}

	consultarTarjetasDisponiblesPorRemesa(_remesa): void {

		if(super.isValid(_remesa)) {

			super.loading(true);

			let objUrls: any = this.utils.urlsTarjetasModule;

			let urlRequest: string = objUrls.seccionTarjetasRemesa.consultaTarjetasPorRemesa;

			let objRequest: object = {
				idRemesa: _remesa,
				idStatus: 1,
				idResponsable: super.isKeyUser(),
				numTarjeta: null,
				pagina: null
			};
			console.log(objRequest);
			this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(

				(data: any) => {
					let response: any = JSON.parse(JSON.stringify(data));
					console.log("Respuesta de la consulta de tarjetas disponibles -> ",response);
					if(response.codE === 0) {
						for(let tarjeta of response.jsonResultado.consulta){
							this.listaTarjetasDisponibles.push(tarjeta.numTarjeta);
						}
						this._notifications.success("Correcto !!!",response.msgE);
					} else {
						this._notifications.info("Aviso !!!",response.msgE);
					}
					super.loading(false);
				}
			);
		} else {
			this.listaTarjetasSeleccion = [];
			this.listaTarjetasDisponibles = [];
		}
	}

	asignarPosiblesReceptores(): void {

		let paramResponsableOtorga: string = '';
		let paramResponsableRecibe: string = '';
		let tipoMovimiento: string = this.formularioSolicitudFolio.controls['idTipoMovimiento'].value;

		this.listaResponsablesFiltrados = [];

		if(super.isValid(tipoMovimiento)) {

			switch (tipoMovimiento) {
				case "1":

					paramResponsableOtorga = 'idResponsable';
					paramResponsableRecibe = 'idManager';

					break;
				case "2":

					paramResponsableOtorga = 'idManager';
					paramResponsableRecibe = 'idResponsable';

					break;
			}

			this.formularioSolicitudFolio.controls['idReceptor'].reset({value: "",disabled: false});

			for(let responsable_ of this.listaResponsables) {
				if(responsable_[paramResponsableRecibe] === this.responsable[paramResponsableOtorga]) {
					this.listaResponsablesFiltrados.push(responsable_);
				}
			}
		} else {
			this.formularioSolicitudFolio.controls['idReceptor'].reset({value: "",disabled: false});
		}

		
	}

	crearSolicitudFolio(_form: any): void {
		if(super.isValid(_form)) {

			this.formularioSolicitudFolio.controls['numeroTarjetas'].setValue(this.numeroTarjetasSeleccion);

			let numeroTarjetas: any = parseInt(this.formularioSolicitudFolio.controls['numeroTarjetas'].value,0);

			console.log("Numero de tarjetas asignado: ",numeroTarjetas);

			if(super.isValid(numeroTarjetas)) {
				if(numeroTarjetas === 0) {
					this._notifications.info("Aviso!!!","El número de tarjetas debe ser mayor a cero y exclusivamente un valor numerico");
				} else {

					if(this.manejadorTabs.showTabOne) {

						super.loading(true);
			
						let objUrls: any = this.utils.urlsTarjetasModule;
						let urlRequest: string = objUrls.seccionFolios.altaFolio;
						let objRequest: object = {
							"idOtorgante": parseInt(_form.idOtorgante,0),
							"idReceptor": parseInt(_form.idReceptor,0),
							"idTipoMov": parseInt(_form.idTipoMovimiento,0),
							"numTarjetas": numeroTarjetas,
							"xmlTarjetas": this.construirParametroTarjetas(this.listaTarjetasSeleccion),
							"comentario": _form.comentarios,
							"usuario": this.isKeyUser()
						};
						
						console.log(objRequest);
						this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(

							(data: any) => {
								let response: any = JSON.parse(JSON.stringify(data));
								console.log("Respuesta de alta de folio -> ",response);
								if(response.codE === 0) {
									this._notifications.success("Correcto !!!",response.msgE);
									this.cerrarFormularioFolio();
									this.consultarFoliosRemesa();
								} else {
									this._notifications.info("Aviso !!!",response.msgE);
								}
								super.loading(false);
							}
						);
					} else {
						this.enviarArchivoTarjetas();
					}
				}
			} else {
				this._notifications.info("Aviso!!!","El número de tarjetas es requerido y debe tener un formato valido");
			}
		}
	}

	construirParametroTarjetas(_tarjetas: any): any {

		let objTarjetas: any = {"tarjeta": []};

		for(let tarjeta_ of _tarjetas) {
			let _objTarjeta: any = {"numTarjeta": tarjeta_};
			objTarjetas["tarjeta"].push(_objTarjeta);
		}

		return objTarjetas;
	}

	asignarArchivoTarjetas(_event): void {

		let fileList: FileList = _event.target.files;

	    if(fileList.length > 0) {
	        this.file = fileList[0];
			this.formData.append('file', this.file,this.file.name);
	    } else {
	    	this.file = null;
	    }
	}

	enviarArchivoTarjetas(): void {

	        if(super.isValid(this.file)) {

		        /*let headersConfig = new Headers();*/
				let paramsConfig = new URLSearchParams();

				let _form: any = this.formularioSolicitudFolio.getRawValue();
				let urlRequest: string = "/tarjeta/folios/solicitudfolioexcel";
				let numeroTarjetas: any = parseInt(this.formularioSolicitudFolio.controls['numeroTarjetas'].value,0);
		        
		        /*headersConfig.append('Content-Type', 'multipart/form-data');*/
		        /*headersConfig.append('Accept', 'application/json; charset=UTF-8');*/

	    		if(super.addShowToken() !== null){
	    			paramsConfig.append('ticket', super.addShowToken());
					paramsConfig.append('app', '2');				
					paramsConfig.append("idOtorgante", _form.idOtorgante);
					paramsConfig.append("idReceptor", _form.idReceptor);
					paramsConfig.append("idTipoMov", _form.idTipoMovimiento);
					paramsConfig.append("numTarjetas", numeroTarjetas);
					paramsConfig.append("comentario", _form.comentarios);
					paramsConfig.append("usuario", this.isKeyUser());
				}

				let requestPath = this.pathServiceUse(3)+urlRequest;
				
		        let optionsRequest = new RequestOptions({ /*"headers": headersConfig,*/"search": paramsConfig});

		        console.log(optionsRequest);

				this._http.post(requestPath, this.formData, optionsRequest)
							.map(response => JSON.parse(this.decryptAES(response.text())))
							.catch(error => Observable.throw(error))
							.subscribe(
				                data => this._notifications.info("Aviso!!!",data.msgE),
				                error => this._notifications.error("Error!!!",error)
				            );
			} else {
				this._notifications.info("Aviso!!!","Se debe seleccionar un archivo Excel(.xls,.xlsx) para poder continuar");
			}
	}

	pathServiceUse(idPath): string {

		let PathService;

		if (process.env.NODE_ENV === 'production') {
			PathService = PathServiceprod;
		} else {
			PathService = PathServicedes;
		}

		for (let i in PathService.paths) {
			if (PathService.paths.hasOwnProperty(i)) {
				if(PathService.paths[i].idPath === idPath){
					return PathService.paths[i].path;
				}
			}
		}
	}

	consultarDetalleFolio(folio: any): void {
		super.saveData(folio, 'folioRemesa');
		this._router.navigate(['./tarjetas-remesa/detalle-folios']);
	}

	seleccionarTarjeta(_tarjeta): void {
		
		if(super.isValid(_tarjeta)) {
			let tarjeta: any = "";		
			for (var i = this.listaTarjetasDisponibles.length; i--;) {
				tarjeta = this.listaTarjetasDisponibles[i];
				if (tarjeta === _tarjeta) {
				 	this.listaTarjetasDisponibles.splice(i, 1);
				 	break;
				}
			}
			this.listaTarjetasSeleccion.push(tarjeta);
			this.actualizarNumeroElementosSeleccionados();
		}
	}

	descartarTarjeta(_tarjeta): void {

		if(super.isValid(_tarjeta)) {
			let tarjeta: any = "";		
			for (var i = this.listaTarjetasSeleccion.length; i--;) {
				tarjeta = this.listaTarjetasSeleccion[i];
				if (tarjeta === _tarjeta) {
				 	this.listaTarjetasSeleccion.splice(i, 1);
				 	break;
				}
			}
			this.listaTarjetasDisponibles.push(tarjeta);
			this.actualizarNumeroElementosSeleccionados();
		}
	}

	seleccionarConjuntoTarjetas(): void {
		if(this.listaTarjetasDisponibles.length > 0) {

			if(this.listaTarjetasSeleccion.length === 0) {

				this.listaTarjetasSeleccion = this.listaTarjetasDisponibles.slice();

			}else if(this.listaTarjetasSeleccion.length > 0) {

				for (var i = this.listaTarjetasDisponibles.length; i--;) {

					let tarjeta = this.listaTarjetasDisponibles[i];

					for (var j = this.listaTarjetasSeleccion.length;j--;) {

						let _tarjeta = this.listaTarjetasSeleccion[j];

						if (tarjeta !== _tarjeta) {
						 	this.listaTarjetasSeleccion.push(tarjeta);
						 	this.listaTarjetasDisponibles.splice(i, 1);
						 	break;
						}
					}					
				}
			}

			this.listaTarjetasDisponibles = [];
			this.actualizarNumeroElementosSeleccionados();
		}
	}

	descartarConjuntoTarjetas(): void {
		if(this.listaTarjetasSeleccion.length > 0) {

			if(this.listaTarjetasDisponibles.length === 0) {

				this.listaTarjetasDisponibles = this.listaTarjetasSeleccion.slice();
				
			}else if(this.listaTarjetasDisponibles.length > 0) {

				for (var i = this.listaTarjetasSeleccion.length; i--;) {

					let tarjeta = this.listaTarjetasSeleccion[i];

					for (var j = this.listaTarjetasDisponibles.length;j--;) {

						let _tarjeta = this.listaTarjetasDisponibles[j];

						if (tarjeta !== _tarjeta) {
						 	this.listaTarjetasDisponibles.push(tarjeta);
						 	this.listaTarjetasSeleccion.splice(i, 1);
						 	break;
						}
					}					
				}
			}

			this.listaTarjetasSeleccion = [];
			this.actualizarNumeroElementosSeleccionados();
		}
	}

	actualizarNumeroElementosSeleccionados(): void {
		this.numeroTarjetasSeleccion = this.listaTarjetasSeleccion.length;
		this.formularioSolicitudFolio.controls['numeroTarjetas'].reset({value: this.numeroTarjetasSeleccion});
	}

	abrirFormularioFolio(): void {
		this.reiniciarValoresFormulario();
		this.mostrarFormularioFolio = true;
	}

	cerrarFormularioFolio(): void {this.mostrarFormularioFolio = false;}
	abrirModalConfirmacion(): void {this.mostrarModalConfirmacion = true;}
	cerrarModalConfirmacion(): void {this.mostrarModalConfirmacion = false;}

	showContentTabOne(): void {
		this.file = null;
		this.descartarConjuntoTarjetas();
		this.numeroTarjetasSeleccion = this.listaTarjetasSeleccion.length;
		this.formularioSolicitudFolio.controls['numeroTarjetas'].reset({value: this.numeroTarjetasSeleccion,disabled: true});
		this.manejadorTabs.showTabOne = true;
		this.manejadorTabs.showTabTwo = false;
	}

	showContentTabTwo(): void {
		this.formularioSolicitudFolio.controls['numeroTarjetas'].reset({value: 0,disabled: false});
		this.manejadorTabs.showTabOne = false;
		this.manejadorTabs.showTabTwo = true;
	}

	reiniciarValoresFormulario(): void {
		this.remesa = "";
		this.listaResponsablesFiltrados = [];
		this.formularioSolicitudFolio.controls['idTipoMovimiento'].reset({value: "",disabled: false});
		this.formularioSolicitudFolio.controls['idOtorgante'].reset({value: super.isKeyUser(),disabled: true});
		this.formularioSolicitudFolio.controls['idReceptor'].reset({value: "",disabled: false});
		this.formularioSolicitudFolio.controls['comentarios'].reset({value: "",disabled: false});
		this.formularioSolicitudFolio.controls['numeroTarjetas'].reset({value: 0,disabled: false});
	}

	filtrarFolios(_str: string): void {
		
		this.foliosFiltrados = new FilterTable().transform(this.listaFoliosRemesa, _str);
		
		if(this.foliosFiltrados.length > 0) {
			this.mostrarPaginadorTabla = true;
			setTimeout(() => {
				this.tablaFolios_vc.SetTabla(new ConfigNgTable2(this.foliosFiltrados.length,10));
			},0);
		}else {
			this.mostrarPaginadorTabla = false;
		}
	}

	actualizarTablaFolios(_conf: any):void {
		this.manejadorPaginas = _conf;
	}
}