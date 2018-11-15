import {Component,OnInit} from '@angular/core';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ClassGenerica} from '../../../classGeneric/config';
import {Service} from '../../../service/service';
import {Notifications} from '../../../classGeneric/notifications';
import { PaginationFron } from '../../../classGeneric/paginationFront';
import { JsonToCsv } from '../../../classGeneric/jsontocsv';
declare let jsPDF;

@Component({
	selector: '',
	templateUrl: 'autorizacion.component.html',
	styleUrls: ['../mantenimiento-empleados/templates/mantenimiento.component.css']
})

export class AutorizacionComponent extends ClassGenerica  {
	pager: any = {};
	pagedItems: any[];
	menuLateral: Array<Object>;
	periodo: any;
	public modalFormulario: boolean;
	fecha:any;
	autoriza:any;
	documento:any;
	mostrarTabla:boolean;
	constructor(private service: Service,private router: Router,private notifications: Notifications,private formBuilder: FormBuilder,private paginationfron: PaginationFron,private jsonToCsv : JsonToCsv) {
		super();
		this.consultarOfertas(null);
		this.modalFormulario = false;
		this.menuNavigation = this.menuNavigation();
		this.periodo="";
		this.fecha="";
		this.mostrarTabla=true;
		
	}
	consultarOfertas(_periodo){
		console.log(_periodo);
		if (_periodo==="") {
			_periodo=null;
		}else{
			if (_periodo!==null) {
				this.formatearPeriodo(_periodo);
				_periodo=this.periodo;
			}
		}
		
		console.log(_periodo);
		super.loading(true);
		let objRequest: any = {periodo:_periodo};
		let urlRequest: any = "/api/pensionados/issste/cifras/consulta";
		this.service.post(objRequest, urlRequest, 3).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                console.log(object);
                if (object.codE === 0) {
                	let objResponse: any = object.jsonResultado;
                	if(objResponse !== null) {
						if(objResponse.length===0){
							this.notifications.info("Aviso !!!","Periodo sin registro");
							this.mostrarTabla=false;
						}else{
							this.mostrarTabla=true;
						}
						this.pager = this.paginationfron.getPager(object.jsonResultado.length, 1, 50);
						//this.pagedItems = this.paginationfron.getPagerdata(object.jsonResultado);
						this.setArrayHabilitar(object.jsonResultado);
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
	setPage(page: number, rango?: number, total?: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.paginationfron.getPager(total, page, rango);
        this.pagedItems = this.paginationfron.getPagerdata([], page);
	}
	setArrayHabilitar(object){
		for (let index = 0; index < object.length; index++) {
			if (object[index].autorizado === "No") {
				object[index].habilitado = false;
				object[index].descargado = false;
			}else{
				object[index].habilitado = true;
				object[index].descargado = true;
			}
			
		}
		this.pagedItems = this.paginationfron.getPagerdata(object);
	}
	habilitar(e,item){
		this.openForm();
		console.log(e.target.checked);
		console.log(super.isKeyUser());
		this.autoriza={
					idCifra:item.idCifras,
					usuario:super.isKeyUser()
				};
	}
	private openForm() {
        console.log("abrir formulario");
        this.modalFormulario = true;

	}
	closeForm(){
		this.modalFormulario = false;
		this.fecha="";
		this.consultarOfertas(null);
	}

	descargar(item){
		item.descargado=true;
		super.loading(true);
		let objRequest: any = { 
								periodo:item.periodo
							  };
		let urlRequest: any = "/api/pensionados/issste/cifras/genera/reportecontrol";
		this.service.post(objRequest, urlRequest, 3).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                if (object.codE === 0) {
					let objResponse: any = object.jsonResultado;
					console.log(objResponse);
                	if(objResponse !== null && objResponse.length !== 0) {
						this.documento=objResponse;
						this.formatearDescarga(item.periodo);
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
		console.log(item);
	}
	autorizar(){
		super.loading(true);
		let objRequest: any = this.autoriza;
		let urlRequest: any = "/api/pensionados/issste/cifras/actualiza";
		this.service.post(objRequest, urlRequest, 3).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                console.log(object);
                if (object.codE === 0) {
                	let objResponse: any = object.jsonResultado;
                	if(objResponse !== null) {
						this.closeForm();
                	} else {
						this.notifications.info("Aviso !!!",object.msgE);
						this.closeForm();
                	} 
                	
                }else {
					this.notifications.info("Aviso !!!",object.msgE);
					this.closeForm();
				}
            },
            error => {
				this.notifications.error("Error !!!",error);
				this.closeForm();
			},
			() => super.loading(false)
		);
		this.autoriza="";
		
	}
	formatearPeriodo(_periodo){
		let separar = _periodo.split("-", 2);
		this.periodo=separar[1]+separar[0];
	}

	formatearDescarga(periodo){
		let clone:Object;
		let arrayClone=[];
		let columns = [
			{title: "ID EMPLEADO", dataKey: "idEmpleado"},
			{title: "NUMERO EMPLEADO", dataKey: "numEmpleado"},
			{title: "NOMBRE", dataKey: "nomEmpleado"},
			{title: "APELLIDO PATERNO", dataKey: "apMatEmpleado"},
			{title: "APELLIDO MATERNO", dataKey: "apPatEmpleado"},
			{title: "FECHA OPERACION", dataKey: "fechaOperacion"},
			{title: "TIPO VALIDACION", dataKey: "tipValidacion"}];
		let rows = this.documento;
		for (let index = 0; index < this.documento.length; index++) {
			clone={
				"ID EMPLEADO":this.documento[index].idEmpleado,
				"NUMERO EMPLEADO":this.documento[index].numEmpleado,
				"NOMBRE":this.documento[index].nomEmpleado,
				"APELLIDO PATERNO":this.documento[index].apPatEmpleado,
				"APELLIDO MATERNO":this.documento[index].apMatEmpleado,
				"FECHA OPERACION":this.documento[index].fechaOperacion,
				"TIPO VALIDACION":this.documento[index].tipValidacion
			};
			arrayClone.push(clone);
		}
		var doc = new jsPDF('p', 'pt');
		doc.autoTable(columns, rows, {
			styles:{fontSize: 6,
					halign: 'center',
					valign: 'middle'},
			addPageContent: function(data) {
				doc.text("Header", 40, 30);
			}
		});
		doc.save(periodo+'.pdf');
		//this.jsonToCsv.generateToExcel(arrayClone,"Periodo_"+periodo);
	}
	
}	