import {Component,OnInit} from '@angular/core';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ClassGenerica} from '../../../../classGeneric/config';
import {Service} from '../../../../service/service';
import {ValidationModule} from '../../../../validator/validation.module';
import {ValidationService} from '../../../../validator/validation.service';
import {Notifications} from '../../../../classGeneric/notifications';
import { PaginationFron } from '../../../../classGeneric/paginationFront';

import * as moment from 'moment';

@Component({
	selector: 'configuracion',
	templateUrl: 'configuracionPromociones.component.html',
	styleUrls: ['../../templates/beneficios.css']
})

export class ConfiguracionPromocionesComponent extends ClassGenerica{
	listaOfertas:any;
	pager: any = {};
	pagedItems: any[];
	modalFormulario:boolean;
	formulario: FormGroup;
	comercio:any;
	constructor(private service: Service, private notifications: Notifications,private formBuilder: FormBuilder, private router: Router, private paginationfron: PaginationFron, private formBiulder: FormBuilder) {
		super();
		this.listaOfertas=[];
		this.menuNavigation = this.menuNavigation();
		this.modalFormulario=false;
		
		this.formulario = this.formBiulder.group({
            'descripcionOferta': ['', [Validators.required]],
            'diasVigencia': ['', [Validators.required]],
            'inicioVigencia': ['', [Validators.required]],
			'finVigencia': ['', [Validators.required]],
			'idTipoOferta': ['', [Validators.required]],
            'valorOferta': ['', [Validators.required]],
            'numCupones': ['', [Validators.required]],
			'idTipoEmision': ['', [Validators.required]],
			'uso': ['', [Validators.required]],
            'vencimientoVigencia': ['', [Validators.required]],
            'campoEmail': ['', [Validators.required]],
			'campoSms': ['', [Validators.required]],
			'campoTicket': ['', [Validators.required]],
		});
		this.comercio=super.getAttr('comercio');
    }
	ngOnInit(){
		this.consultarOfertas();
	}
    consultarOfertas(){
		
		super.loading(true);
		let objRequest: any = {idComercio:this.comercio.idComercio,
								idOferta:null};
		let urlRequest: any = "/api/modulocupones/oferta/consulta";
		this.service.post(objRequest, urlRequest, 3).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                console.log(object);
                if (object.codE === 0) {

                	let objResponse: any = object.jsonResultado;
                	
                	if(objResponse !== null) {
						this.pager = this.paginationfron.getPager(object.jsonResultado.length, 1, 50);
						this.pagedItems = this.paginationfron.getPagerdata(object.jsonResultado);
						this.listaOfertas = objResponse.jsonResultado;
	                    /*this.notifications.success("Exito !!!",object.msgE);*/
                	} else {
                		this.notifications.info("Aviso !!!","La respuesta fue correcta, pero vacia !!!");
                	}
                	
                }else {
					this.listaOfertas = object.jsonResultado;
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
	public openForm() {
        console.log("abrir formulario");
        this.modalFormulario = true;

	}
	closeForm(){
        /*this.formulario.controls['institucion'].setValue("");
        this.formulario.controls['nombreComercio'].setValue("");
        this.formulario.controls['logo'].setValue("");*/
        this.modalFormulario = false;
	}
	private asignarOferta(seleccionado) {
        super.saveData(seleccionado,'oferta');
        console.log(super.getAttr('oferta'));
       this.router.navigate(['beneficios/asignacion']);
	}
	
	public guardarDispersion():void{
		
	}
}