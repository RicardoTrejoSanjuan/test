import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder,FormGroup,FormControl,Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
	selector: "r-remesas",
	templateUrl: "responsables.component.html",
	styleUrls: ["../tarjetas-remesa.component.css"]
})

export class ResponsablesRemesaComponent extends ClassGenerica implements OnInit {

	menuLateral: any[] = [];

	public utils: TarjetasRemesaUtils;
	public _urlsModule: any;

	public responsable: any;
	public idResponsable: number;
	public listaResponsables: any[];
	public generarCsv: boolean;
	public esCreacionResponsable: boolean;
	public mostrarPaginadorTabla: boolean;
	public mostrarPaginadorTabla2: boolean;
	public mostrarDetalleTarjetas: boolean;
	public mostrarFormularioEliminar: boolean;
	public mostrarFormularioResponsable: boolean;
	public listaResponsablesSinDuplicar: any[];

	public listaTarjetas: any[];
	public totalTarjetas: number;

	public statusTarjeta: any;
	public nombreResponsable: string;
	public responsableEliminar: any;
	public formularioResponsable: any;

	public tarjetasFiltradas: Array<Object>;
	public responsablesFiltrados: Array<Object>;
	public pagesHandler: PagesHandler = new PagesHandler();
	public pagesHandler2: PagesHandler = new PagesHandler();

	public cadena:any;
	public tarjeta:any;

	@ViewChild('tablatarjetas') tablaTarjetas: Ng2Tables;
	@ViewChild('tablaresponsables') tablaResponsables: Ng2Tables;

	constructor(private service: Service,private notifications: Notifications,private formBuilder: FormBuilder,private router: Router,private csvExport: JsonToCsv) {
		
		super();
		
		this.menuLateral = this.getMenuLateral(1);
		this.menuNavigation = this.menuNavigation();

		this.utils = new TarjetasRemesaUtils(this.service);
		let urls: any = this.utils.urlsTarjetasModule;
		this._urlsModule = urls.seccionResponsables;
		this.menuLateral = this.utils.obtenerMenuLateralLimpio(this.menuLateral);

		this.responsable = {};
		this.idResponsable = parseInt(super.isKeyUser(),0);
		this.listaResponsables = [];
		this.listaResponsablesSinDuplicar = [];
		this.tarjetasFiltradas = [{}];
		this.responsablesFiltrados = [{}];
		this.generarCsv = false;
		this.esCreacionResponsable = false;
		this.mostrarPaginadorTabla = true;
		this.mostrarPaginadorTabla2 = true;
		this.mostrarDetalleTarjetas = false;
		this.mostrarFormularioEliminar = false;
		this.mostrarFormularioResponsable = false;

		this.listaTarjetas = [];
		this.totalTarjetas = 0;

		this.nombreResponsable = "";
		this.responsableEliminar = {idresponsable: 0,nombre: ""};
		this.formularioResponsable = this.formBuilder.group(
			{
				"idResponsable": ['',Validators.compose([Validators.required,Validators.maxLength(6)])],
				"idManager": ['',[Validators.required]],
				"nombre": ['',[Validators.required]],
				"apPat": ['',[Validators.required]],
				"apMat": ['']
			}
		); 
	}

	ngOnInit() {
		this.statusTarjeta = null;
		this.consultarResponsablesRemesa();
	}

	consultarResponsablesRemesa(): void {

		super.loading(true);

		let urlRequest: string = this._urlsModule.consultaResponsables;
		let objRequest: object = {idStatus: 1,idResponsable: null,nombre: '',idManager: this.idResponsable};
		console.log(objRequest);
		this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(

			(data: any) => {
				console.log("Respuesta de la consulta de responsables -> ",data);
				if(data.codE === 0) {

					let response: any = JSON.parse(JSON.stringify(data.jsonResultado));

					if(!this.generarCsv) {
						this.listaResponsables = response;
						this.depurarContenidoDuplicado(this.listaResponsables);
						this.notifications.success("Correcto !!!",data.msgE);
					} else {
						this.generarCsv = false;
						this.notifications.success("Correcto !!!","Los datos fueron exportados a un archivo Excel");
						this.csvExport.generateToExcel(response,'Responsables_por_remesa_'+this.idResponsable);
					}

				} else {
					this.notifications.info("Aviso !!!",data.msgE);
				}

				super.loading(false);
				this.filtrarResponsables("");
			}
		);
	}

	exportarDatosModulo(): void {
		this.generarCsv = true;
		if(!this.mostrarDetalleTarjetas) {
			this.consultarResponsablesRemesa();
		} else {
			this.consultarDetalleTarjetas(this.responsable);
		}
	}

	consultarDetalleTarjetas(responsable: any): void {
		
		super.loading(true);

		this.responsable = responsable;

		this.nombreResponsable = responsable.nombre + " " + responsable.apPaterno + " " + responsable.apMaterno;

		let urlsTarjetas: any = this.utils.urlsTarjetasModule;
		let urlRequest: string = urlsTarjetas.seccionTarjetasRemesa.consultaTarjetasPorRemesa;
		let objRequest: object = {idRemesa: null,idStatus: super.isValid(this.statusTarjeta) ? parseInt(this.statusTarjeta,0) : null,idResponsable: responsable.idResponsable,numTarjeta: null,pagina: null};
		console.log(objRequest);
		this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(
			(data: any) => {
				console.log("Respuesta de la consulta de tarjetas -> ",data);

				if(data.codE === 0) {

					let response: any = JSON.parse(JSON.stringify(data.jsonResultado));

					if(!this.generarCsv) {
						this.listaTarjetas = response.consulta;
						this.totalTarjetas = response.total;
						this.notifications.success("Correcto !!!",data.msgE);
					} else {
						this.generarCsv = false;
						this.notifications.success("Correcto !!!","Los datos fueron exportados a un archivo Excel");
						this.csvExport.generateToExcel(response.consulta,'Tarjetas_por_responsable_'+this.idResponsable);
					}
					
				} else {
					this.notifications.info("Aviso !!!",data.msgE);
				}

				super.loading(false);
				this.filtrarTarjetasResponsable("");
				this.abrirModalDetalleTarjetas();
			}
		);
	}

	abrirModalDetalleTarjetas(): void {
		this.mostrarDetalleTarjetas = true;
	}

	cerrarModalDetalleTarjetas(): void {
		this.statusTarjeta = null;
		this.mostrarDetalleTarjetas = false;
	}

	consultarDetalleMonitoreo(responsable: any): void {
		super.saveData(responsable, 'responsable');
		this.router.navigate(['./tarjetas-remesa/seguimiento']);
	}

	consultarDetalleTarjeta(tarjeta: any): void {
		super.saveData(tarjeta, 'tarjetaRemesa');
		this.router.navigate(['./tarjetas-remesa/detalle-tarjetas']);
	}

	filtrarTarjetasPorEstatus(): void {
		
		this.consultarDetalleTarjetas(this.responsable);
	}

	asignarValoresEliminar(responsable: any): void {
		
		if(super.isValid(responsable)){
			if(responsable.status !== 0) {
				this.responsableEliminar.idResponsable = responsable.idResponsable;
				this.responsableEliminar.nombre = responsable.nombre + " " + responsable.apPaterno + " " + responsable.apMaterno;

				this.abrirFormularioEliminar();
			}
		}
	}

	eliminarResponsable(): void {
		if(super.isValid(this.responsableEliminar.idResponsable)) {

			super.loading(true);

			let urlRequest: string = this._urlsModule.eliminarResponsables;
			let objRequest: object = {idResponsable: this.responsableEliminar.idResponsable};

			this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(
				(data: any) => {
					console.log("Respuesta eliminar responsable -> ",data);
					if(data.codE === 0) {
						this.notifications.success("Correcto !!!",data.msgE);
					} else {
						this.notifications.info("Aviso !!!",data.msgE);
					}

					super.loading(false);
					this.cerrarFormularioEliminar();
					this.consultarResponsablesRemesa();
				}
			);
		}
	}

	abrirFormularioEliminar(): void {
		this.mostrarFormularioEliminar = true;
	}

	cerrarFormularioEliminar(): void {
		this.mostrarFormularioEliminar = false;
	}

	manejadorResponsable(_form: any): void {

		if(super.isValid(_form)) {
			
			super.loading(true);

			let urlRequest: string = "";
			let objRequest: object = {idResponsable: _form.idResponsable,idManager: _form.idManager,nombre: _form.nombre,apPaterno: _form.apPat,apMaterno: _form.apMat};
			console.log(objRequest);
			if(this.esCreacionResponsable){
				urlRequest = this._urlsModule.registrarResponsables;
			}else {
				urlRequest = this._urlsModule.actualizarResponsables;
			}

			this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(
				(data: any) => {
					console.log(data);
					if(data.codE === 0) {
						this.notifications.success("Correcto !!!",data.msgE);
					} else {
						this.notifications.info("Aviso !!!",data.msgE);
					}

					super.loading(false);
					this.cerrarFormularioResponsable();
					this.consultarResponsablesRemesa();
				}
			);
		}
	}

	mostrarModalCreacionResponsable(): void {
		this.limpiarFormularioResponsables();
		this.esCreacionResponsable = true;
		this.abrirFormularioResponsable();
	}

	mostrarModalActualizacionResponsable(_responsable: any): void {
		this.llenarFormularioResponsables(_responsable);
		this.esCreacionResponsable = false;
		this.abrirFormularioResponsable();
	}

	abrirFormularioResponsable(): void {
		this.mostrarFormularioResponsable = true;
	}

	cerrarFormularioResponsable(): void {
		this.mostrarFormularioResponsable = false;
	}

	llenarFormularioResponsables(_item: any): void {
		this.formularioResponsable.controls['idResponsable'].reset({value: _item.idResponsable,disabled: true});
		this.formularioResponsable.controls['idManager'].reset({value: _item.idManager,disabled: false});
		this.formularioResponsable.controls['nombre'].reset({value: _item.nombre,disabled: false});
		this.formularioResponsable.controls['apPat'].reset({value: _item.apPaterno,disabled: false});
		this.formularioResponsable.controls['apMat'].reset({value: _item.apMaterno,disabled: false});
	}

	limpiarFormularioResponsables(): void {
		this.formularioResponsable.controls['idResponsable'].reset({value: "",disabled: false});
		this.formularioResponsable.controls['idManager'].reset({value: "",disabled: false});
		this.formularioResponsable.controls['nombre'].reset({value: "",disabled: false});
		this.formularioResponsable.controls['apPat'].reset({value: "",disabled: false});
		this.formularioResponsable.controls['apMat'].reset({value: "",disabled: false});
	}

	depurarContenidoDuplicado(_data: any[]): void {

        let found, x, y;
        let oldArray: any;
        let newArray: any;

        //Se ietra sobre el arreglo que contiene la informacion
        for (x = 0; x < _data.length; x++) {
            found = false;
            oldArray = _data[x];
            // Por cada valor del arreglo original se itera el contenido del arreglo nuevo
            for (y = 0; y < this.listaResponsablesSinDuplicar.length; y++) {

                newArray = this.listaResponsablesSinDuplicar[y];

                // Si el valor de la posicion obtenida en el arreglo original es igual a la del arreglo nuevo se marca una bandera
                if (oldArray.idManager === newArray.idManager) {
                    found = true;
                    break;
                }
            }    
            // Si los valores no son iguales se agrega al nuevo arreglo
            if (!found) {
            	if(oldArray.idManager !== 0) {
            		this.listaResponsablesSinDuplicar.push({idManager: oldArray.idManager,nomManager: oldArray.nomManager});
            	}
            }
        }
    }

	filtrarResponsables(_str: string): void {
		
		this.responsablesFiltrados = new FilterTable().transform(this.listaResponsables, _str);
		
		if(this.responsablesFiltrados.length > 0) {
			this.mostrarPaginadorTabla = true;
			setTimeout(() => {
				this.tablaResponsables.SetTabla(new ConfigNgTable2(this.responsablesFiltrados.length,10));
			},0);
		}else {
			this.mostrarPaginadorTabla = false;
		}
	}

	actualizarTablaResponsables(_conf: any):void {
		this.pagesHandler = _conf;
	}

	filtrarTarjetasResponsable(_str: string): void {
		
		this.tarjetasFiltradas = new FilterTable().transform(this.listaTarjetas, _str);
		
		if(this.tarjetasFiltradas.length > 0) {
			this.mostrarPaginadorTabla2 = true;
			setTimeout(() => {
				this.tablaTarjetas.SetTabla(new ConfigNgTable2(this.tarjetasFiltradas.length,5));
			},0);
		}else {
			this.mostrarPaginadorTabla2 = false;
		}
	}

	actualizarTarjetasResponsable(_conf: any):void {
		this.pagesHandler2 = _conf;
	}
}