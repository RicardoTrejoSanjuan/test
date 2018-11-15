import {Component, AfterViewInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ClassGenerica} from '../../../classGeneric/config';
import {Service} from '../../../service/service';
import {Notifications} from '../../../classGeneric/notifications';
import {FormControl} from '@angular/forms';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
import { PaginationFron } from '../../../classGeneric/paginationFront';
import { Pagination } from '../../../classGeneric/pagination';
@Component({
    selector: 'my-seguridad',
    styleUrls: [
        "../../mantenimiento/mantenimiento-instituciones/instituciones.component.css",
        "../../mesa-control/mesa-control.component.css",
        "../../depositos/alta-servicio-daz/alta.css"
      ],
    templateUrl: './alta-servicio.component.html'
})


export class AltaServicioComponent extends Pagination {
    private menuLateral: Array<Object>;
    showDialogAlert: Boolean = false;
    pager: any = {};
    pagedItems: any[];
	estructuras:any;
	objFiltrosHandler: Object;
	bandIst:boolean;
	institucion:any;
	institucionCtrl:FormControl;
	listaInstituciones: any;
	estructuraCtrl: FormControl;
	parametros:any;
	usuario:any;
	boton:boolean;
	inst:any;
    constructor(private service: Service, private notifications: Notifications,private formBuilder: FormBuilder, private router: Router, private paginationfron: PaginationFron) {
        super();
        this.menuNavigation = this.menuNavigation();
        this.menuLateral = this.getMenuLateral();
        this.consultarEstructura();
		console.log(this.menuNavigation);
		this.usuario=super.getFullName();
		console.log(this.usuario);
		this.objFiltrosHandler = {
			agrupamientoRequest: "INSTITUCION",
			anyoneSearchResult: false,
			institucionSelected: false
		};
		
		this.boton=false;
		this.bandIst=true;
		this.institucion=0;
		this.institucionCtrl = new FormControl();
		this.estructuraCtrl= new FormControl();
		this.estructuraCtrl.setValue(0);
		//console.log(this.institucionCtrl.value.startWith(null));
		//this.listaInstituciones = this.institucionCtrl.valueChanges.startWith(null).map(name => this.filtrarInstituciones(name));
    }

    actualizarStatus(status, item){
		console.log(status);
			this.showDialogAlert=true;
			console.log(item);
			this.parametros={
				idPais: item.idPais,
				idInstitucion: item.idInstitucion,
				idEstructura: this.estructuraCtrl.value,
				numeroCuenta: item.numeroCuenta,
				//numeroCuenta:"012701720111964265",
				nombre: item.titularCuenta,
				idclientealn:this.inst.idAlnova,
				idclientebea:this.inst.idBea,
				razonsocial:this.inst.name,
				rfc:this.inst.rfc,
				emisora:item.emisora,
				producto:item.subproducto,
				subproducto:item.producto,
				idmoneda:item.idMoneda,
				statusctral:item.status === true ?  1 :  2,
				cuentaa18:item.numCta18
				//"cuentaa18":"012701720111964265"
			};
		//this.buscarCuentas(this.inst);
		
    }
    buscarCuentas(inst){
		console.log(this.estructuraCtrl.value);
		this.inst=inst;
		this.listaInstituciones=[];
		super.loading(true);
		let objRequest = {
			idPais: this.inst.idPais,
			idInst: this.inst.idInst,
			//idEstructura: this.estructuraCtrl.value,
			//razonsocial: this.inst.name,
			//rfc: this.inst.rfc,
			//idclientealn: this.inst.idAlnova,
			//idclientebea: this.inst.idBea,
		};
		console.log(objRequest);
        let uri="/cuentascentralizadas/altaserv/conxinstctalnova";
		this.service.post(objRequest, uri, 3).subscribe(
			data => {
				let object = JSON.parse(JSON.stringify(data));
				console.log(object);
				if (object.codE === 0) {
					let objResponse: any = object.jsonResultado;
					if(objResponse !== null || objResponse.length !== 0) {
						console.log(objResponse,"aqui");
						let quitados=this.quitarInst(object.jsonResultado);
						if (quitados.length===0) {
							this.notifications.info("Aviso !!!","No se encontraron cuentas para esta institución");
						}
						this.pager = this.paginationfron.getPager(quitados.length, 1, 50);
						this.pagedItems = this.paginationfron.getPagerdata(quitados);
						console.log(this.pager,"aqui");
						/*this.notifications.success("Exito !!!",object.msgE);+*/
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
	quitarInst(inst){
		let instCopia:any=[];
		for (let index = 0; index < inst.length; index++) {
			if(inst[index].numeroCuenta!==null){
				instCopia.push(inst[index]);
			}
			
		}
		return instCopia;
	}
    setPage(page: number, rango?: number, total?: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.paginationfron.getPager(total, page, rango);
        this.pagedItems = this.paginationfron.getPagerdata([], page);
    }
    consultarEstructura(){
		super.loading(true);
		let objRequest = {
            
        };
        let uri="/cuentascentralizadas/altaserv/consctaestruct";
		this.service.post(objRequest, uri, 3).subscribe(
			data => {
				let object = JSON.parse(JSON.stringify(data));
				console.log(object);
				if (object.codE === 0) {
					let objResponse: any = object.jsonResultado;
					if(objResponse !== null) {
                        console.log(objResponse,);
                        this.estructuras=objResponse;
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
	
    filtrarInstituciones(val: string) {

		let instituciones: any[] = [];
		if (this.bandIst) {
			if(val !== null && val !== undefined) {

				let _objFiltrosHandler: any = this.objFiltrosHandler;

				_objFiltrosHandler.anyoneSearchResult = false;

				if(val.length > 2) {

					super.loading(true);

					let objRequest = {institucion: val};

					let uriRequest = "/cuentascentralizadas/altaserv/coninstitucion";

					this.service.post(objRequest, uriRequest,3).subscribe(
						data => {

							let objServiceResponse: any = JSON.parse(JSON.stringify(data));
							console.log(objServiceResponse);
							if (objServiceResponse.codE === 0) {

								if(objServiceResponse.jsonResultado.length > 0) {

									for (let inst of objServiceResponse.jsonResultado) {
										console.log(objServiceResponse.jsonResultado);
										instituciones.push({name: inst.razonSocial,idInst: inst.idInstitucion,idPais: inst.idPais, rfc: inst.rfc, idAlnova: inst.idClienteAlnova, idBea: inst.idClienteBea });
									}
									document.getElementById('inst').focus();
									this.institucionCtrl.setValue(this.institucionCtrl.value+" ");

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
	buscar(){
		this.listaInstituciones = this.filtrarInstituciones(this.institucionCtrl.value);
		
	}
    activar(){
		super.loading(true);
		console.log(this.parametros);
        let uri="/cuentascentralizadas/altaserv/insertaServicio";
		this.service.post(this.parametros, uri, 3).subscribe(
			data => {
				let object = JSON.parse(JSON.stringify(data));
				console.log(object);
				if (object.codE === 0) {
					let objResponse: any = object.jsonResultado;
						this.notifications.info("Aviso !!!",object.msgE);
						//this.showDialogAlert = !this.showDialogAlert;
						if (this.parametros.statusctral===1) {
							super.saveData(this.parametros,'institucionCent');
							this.router.navigate(['centralizacion-cuentas/parametrizacion-cuenta-principal']);
						}else{
							this.buscarCuentas(this.inst);
							this.showDialogAlert = !this.showDialogAlert;
						}
				}else {
					this.notifications.info("Aviso !!!",object.msgE);
					this.buscarCuentas(this.inst);
					this.showDialogAlert = !this.showDialogAlert;
				}
			},
			error => {
				this.notifications.error("Error !!!",error);
				this.showDialogAlert = !this.showDialogAlert;
			},
			() => super.loading(false)
		);
		
		
	}
	activarBoton(){
		this.boton=true;
	}
}