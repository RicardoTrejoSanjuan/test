import {Component,OnInit} from '@angular/core';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ClassGenerica} from '../../../../classGeneric/config';
import {Service} from '../../../../service/service';
import {ValidationModule} from '../../../../validator/validation.module';
import {ValidationService} from '../../../../validator/validation.service';
import {Notifications} from '../../../../classGeneric/notifications';
import {PaginationFron} from '../../../../classGeneric/paginationFront';
import { DragulaService } from 'ng2-dragula';

import * as moment from 'moment';

@Component({
	selector: 'asignacion',
	templateUrl: 'asignacionPromociones.component.html',
	styleUrls: ['../../templates/beneficios.css']
})

export class AsignacionPromocionesComponent extends ClassGenerica{
	comercio:any;
	oferta:any;
	pager: any = {};
	pagedItems: any[];
	pagerIns: any = {};
	pagedItemsIns: any[];
	paginationfronIns:any;
	institucionBand:boolean;
	institucion:any;
	constructor(private service: Service, private notifications: Notifications,private formBuilder: FormBuilder, private router: Router, private paginationfron: PaginationFron, private formBiulder: FormBuilder) {
		super();
		this.menuNavigation = this.menuNavigation();
		this.comercio=super.getAttr('comercio');
		this.paginationfronIns=new PaginationFron;
		
		
    }
	ngOnInit(){
		if(super.getAttr('oferta')!=="" ){
			console.log(super.getAttr('oferta'),"ofertas");
			this.institucionBand=false;
			this.oferta=super.getAttr('oferta');
			this.consultarInstituciones();
			super.saveData("",'oferta');
		} 
		if (super.getAttr('institucion')!=="" ) {
			console.log(super.getAttr('institucion'),"instituciones");
			this.institucion=super.getAttr('institucion');
			super.saveData("",'institucion');
			this.institucionBand=true;
		}
		
	}
    consultarInstituciones(){
		
		super.loading(true);
		let objRequest: any = {idComercio:this.oferta.idComercio,
								idOferta:this.oferta.idOferta};
		let urlRequest: any = "/api/modulocupones/oferta/consulta/institucion";
		this.service.post(objRequest, urlRequest, 3).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                console.log(object);
                if (object.codE === 1) {
                	let objResponse: any = object.jsonResultado;
                	if(objResponse !== null) {
						console.log(objResponse,"aqui");
						this.pager = this.paginationfron.getPager(object.jsonResultado.ofertaInst2.length, 1, 50);
						this.pagedItems = this.paginationfron.getPagerdata(object.jsonResultado.ofertaInst2);
						this.pagerIns = this.paginationfronIns.getPager(object.jsonResultado.ofertaInst1.length, 1, 50);
						this.pagedItemsIns = this.paginationfronIns.getPagerdata(object.jsonResultado.ofertaInst1);
						console.log(this.pagedItems,"aqui");
						console.log(this.pagedItemsIns,"aqui");
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
	setPageInst(page: number, rango?: number, total?: number) {
        if (page < 1 || page > this.pagerIns.totalPages) {
            return;
        }
        this.pagerIns = this.paginationfronIns.getPager(total, page, rango);
        this.pagedItemsIns = this.paginationfronIns.getPagerdata([], page);
	}
	private Regresar(){
        this.router.navigate(['beneficios/configuracion']);
	}
	private RegresarInst(){
        this.router.navigate(['beneficios']);
	}
	private onDropModel(args) {
		let [el, target, source] = args;
		// do something else
	  }
	
	  private onRemoveModel(args) {
		let [el, source] = args;
		// do something else
	  }
}