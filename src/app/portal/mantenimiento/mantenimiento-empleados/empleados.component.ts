import { Component, OnInit } from '@angular/core';
import { Service } from '../../../service/service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ClassGenerica } from '../../../classGeneric/config';
import {ValidationModule} from '../../../validator/validation.module';
import {ValidationService} from '../../../validator/validation.service';
import { Notifications} from '../../../classGeneric/notifications';
import { Pagination } from '../../../classGeneric/pagination';
import { Observable } from 'rxjs/Observable';
import * as _ from 'underscore';
import {FormControl} from '@angular/forms';
import * as moment from 'moment';
import { PaginationFron } from '../../../classGeneric/paginationFront';

@Component({
    selector: 'mantenimientos',
    templateUrl: 'templates/mantenimiento.component.html',
	styleUrls: [
		'templates/mantenimiento.component.css',
		'../../mesa-control/mesa-control.component.css',
		'../../reportes/producto/templates/producto.css'
	]
})

export class EmpleadoComponent extends Pagination {
    private childrenEmpleados: Object[];
    institucionCtrl:FormControl;
    clienteControl:FormControl;
    pager: any = {};
    pagedItems: any[];
    private jsonRequest: Object;
    private objHandler: Object;
    private permisosUser: any;
    menuLateral: Array<Object>;
    listaInstituciones: any;
    objFiltrosHandler: Object;
    institucion:any;
    uri:any;
	clientes:any;
	bandIst:boolean;
	boton:boolean;
	isAvailable:any;
    constructor(private service: Service, private router: Router,private notifications: Notifications, private paginationfron: PaginationFron){
        super();
        this.menuLateral = this.getMenuLateral();
         this.jsonRequest = {
                cadenaBusqueda:null,
                idInstitucion: null
            };
         this.objHandler = {
            existenRegistros: false,
            nvaBusqueda: false,
            strBusqueda: '',
            searching: false
		};
		this.boton=false;
		this.bandIst=true;
        this.uri="/mantenimiento/empleado/busqueda";
        this.institucionCtrl = new FormControl();
        this.clienteControl=new FormControl();
        this.clientes = [];
        this.listaInstituciones = this.institucionCtrl.valueChanges.startWith(null).map(name => this.filtrarInstituciones(name));
        this.clientes=null;
        this.objFiltrosHandler = {
			agrupamientoRequest: "INSTITUCION",
			anyoneSearchResult: false,
			institucionSelected: false
        };
        this.institucion=0;
    }
   
    public Regresar(){
        this.router.navigate(['./mantenimientos']);
    }
    
    filtrarInstituciones(val: string) {

		let instituciones: any[] = [];
		if (this.bandIst) {
			if(val !== null && val !== undefined) {

				let _objFiltrosHandler: any = this.objFiltrosHandler;

				_objFiltrosHandler.anyoneSearchResult = false;

				if(val.length > 2) {

					super.loading(true);

					let objRequest = {cadenaBusqueda: val};

					let uriRequest = "/mantenimiento/institucion/busqueda";

					this.service.post(objRequest, uriRequest,3).subscribe(
						data => {

							let objServiceResponse: any = JSON.parse(JSON.stringify(data));

							if (objServiceResponse.codE === 0) {

								if(objServiceResponse.jsonResultado.length > 0) {

									for (let inst of objServiceResponse.jsonResultado) {
										console.log(objServiceResponse.jsonResultado);
										instituciones.push({name: inst.razonSocial,idInst: inst.idInstitucion,idPais: inst.idPais });
									}

								} else {
									_objFiltrosHandler.anyoneSearchResult = true;
									_objFiltrosHandler.institucionSelected = false;
								}

							} else {
								//console.log("La respuesta contiene algun fallo -> [" + objServiceResponse.msgE + "]");
								this.notifications.info('Consulta de instituciones',"El servidor respondio con algun fallo -> [" + objServiceResponse.msgE + "]");
								_objFiltrosHandler.institucionSelected = false;
							}
						},
						error => {
							//console.log("Ha ocurrido una falla en la peticion -> [" + error + "]");
							this.notifications.error('Error',"Ha ocurrido una falla en la peticion -> [" + error + "]");
						},
						() => super.loading(false)
					);
				} else {
					_objFiltrosHandler.institucionSelected = false;
				}

				this.objFiltrosHandler = _objFiltrosHandler;
			}else{
				this.institucion=0;
			}
		}
		this.bandIst=true;
    	return instituciones;
      }
    getInstitucion(idInstitucion){
		this.institucion=idInstitucion;
		console.log(this.institucion);
		this.bandIst=false;
        this.jsonRequest = {
                cadenaBusqueda:null,
                idInstitucion: idInstitucion.idInst
            };
    }
	consultarEmpleados(){
		console.log(this.institucionCtrl.value);
		if (this.institucionCtrl.value==="") {
			this.institucion=0;
		}
		console.log(this.institucion);
		super.loading(true);
		let objRequest = {cadenaBusqueda: this.clienteControl.value,  idInstitucion: this.institucion.idInst};
		console.log(objRequest);
		this.service.post(objRequest, this.uri, 3).subscribe(
			data => {
				let object = JSON.parse(JSON.stringify(data));
				console.log(object);
				if (object.codE === 0) {
					let objResponse: any = object.jsonResultado;
					if(objResponse !== null) {
						console.log(objResponse,"aqui");
						this.pager = this.paginationfron.getPager(object.jsonResultado.length, 1, 50);
						this.pagedItems = this.paginationfron.getPagerdata(object.jsonResultado);
						console.log(this.pager,"aqui");
						/*this.notifications.success("Exito !!!",object.msgE);*/
					} else {
						this.notifications.info("Aviso !!!","La respuesta fue correcta, pero vacia !!!");
					}
					
				}else {
					this.notifications.info("Aviso !!!",object.msgE);
				}
			},
			error => {
				this.notifications.error("Error !!!",error);
			},
			() => super.loading(false)
		);
	}
      getCliente(cliente){
		if (this.institucion === 0) {
			this.institucion = {
				idInst:cliente.idInstitucion,
				name:cliente.descInstitucion,
				idPais:cliente.idPais,
			};
		};
		super.saveData(this.institucion,'institucion');
		cliente = super.saveData(cliente,'cliente');
		console.log(super.getAttr('cliente'));
        this.router.navigate(['mantenimientos/empleados/datos-basicos']);
	  }
	  setPage(page: number, rango?: number, total?: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.paginationfron.getPager(total, page, rango);
        this.pagedItems = this.paginationfron.getPagerdata([], page);
	}
	abilitar(){
		try {
			if (this.clienteControl.value.length>2) {
				this.boton=true;
			}else{
				this.boton=false;
			}
		}
		catch (e){
			if(e instanceof RangeError){
				console.log('out of range');
			}
		}
		
	}
}