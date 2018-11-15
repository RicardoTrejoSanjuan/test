import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder,FormControl,Validators} from '@angular/forms';

import {ClassGenerica} from '../../../classGeneric/config';
import {Service} from '../../../service/service';
import {ValidationModule} from '../../../validator/validation.module';
import {ValidationService} from '../../../validator/validation.service';
import {Notifications} from '../../../classGeneric/notifications';
import {Pagination} from '../../../classGeneric/pagination';

import {Observable} from 'rxjs/Observable';
import * as _ from 'underscore';

@Component({
	selector: 'sucursales',
	templateUrl: 'template/sucursales.component.html',
	styleUrls: [
		'template/sucursales.component.css',
		'../../mesa-control/mesa-control.component.css']
})

export class SucursalesComponent extends ClassGenerica {
	
	listaSucursales: any;
    sucursalCtrl: FormControl;
    sucursalSelected: any;
    showTablaSucursal: Boolean;
    formulario: any;
    displayModal: Boolean;
    displayDetail: Boolean;

    respuestasCortas: any;


	constructor(private service: Service,private router: Router,private notifications: Notifications,private formBuilder: FormBuilder) {
		super();
		this.displayModal = false;
		this.displayDetail = false;
		this.showTablaSucursal = false;
		this.sucursalCtrl = new FormControl();
        this.listaSucursales = this.sucursalCtrl.valueChanges.startWith(null).map(name => this.filtrarSucursales(name));

        this.respuestasCortas = [{resValue: "1",resText: "Si"},{resValue: "0",resText: "No"}];

        this.formulario = this.formBuilder.group({
			'pais': ['',Validators.compose([Validators.required,Validators.minLength(1)])],
			'canal': ['',Validators.compose([Validators.required,Validators.minLength(1)])],
			'sucursal': ['',Validators.compose([Validators.required,Validators.minLength(1)])],
			'noc': ['',[Validators.required]],
			'big': ['',[Validators.required]]
		});
	}

	private filtrarSucursales(str: string) {

        let sucursales: any[] = [];

        if (this.validarContenido(str) && str !== "") {

            if (str.length > 2) {
                super.loading(true);

                let objRequest: any = {idSucursal: str};
                let uriRequest: string = "/mantenimiento/wrapper/sucursal/consulta";

                this.service.post(objRequest, uriRequest, 3).subscribe(
                    data => {

                        let objServiceResponse: any = JSON.parse(JSON.stringify(data));

                        if (objServiceResponse.codE === 0) {

                            if (objServiceResponse.jsonResultado.length > 0) {

                                for (let suc of objServiceResponse.jsonResultado) {
                                    sucursales.push(suc);
                                }
                          
        					} else {
        						this.notifications.info('Consulta de sucursales','El consumo del servicio no arrojo ningun resultado !!!');
        					}

                        } else {
                            this.notifications.info('Consulta de sucursales', objServiceResponse.msgE);
                        }
                    },
                    error => {
                        this.notifications.error('Error', error);

                    },
                    () => super.loading(false)
                );

            }
        }

        return sucursales;
    }

    public enviarDatos() {

    	if(this.formulario.valid) {

    		super.loading(true);
			this.displayModal = false;

			let objRequest: any = {
				idPais: parseInt(this.formulario.controls['pais'].value,0),
				idCanal: parseInt(this.formulario.controls['canal'].value,0),
				idSucursal: parseInt(this.formulario.controls['sucursal'].value,0),
				bnoc: parseInt(this.formulario.controls['noc'].value,0),
				bbig: parseInt(this.formulario.controls['big'].value,0)
			};

			/*console.log(objRequest);*/

			this.service.post(objRequest, "/mantenimiento/wrapper/sucursal/actualiza", 3).subscribe(
	            data => {

	                let object = JSON.parse(JSON.stringify(data));

	                if (object.codE === 0) {
	                    this.notifications.success("Exito !!!",object.msgE);
	                }else {
						this.notifications.info("Aviso !!!",object.msgE);
					}

					this.sucursalSelected = {};
    				this.showTablaSucursal = false;
	            },
	            error => {
	                this.notifications.error("Error !!!",error);
	            },
	            () => super.loading(false)
	        );
    	}
    }

    private dibujarTabla(sucursal: any) {
    	this.sucursalSelected = sucursal;
    	this.showTablaSucursal = true;
    }

    private mostrarModalDetalle() {
    	this.displayModal = true;
    	this.displayDetail = true;
    	let sucursal: any = this.sucursalSelected;
    	this.formulario.controls['pais'].setValue(sucursal.idPais);
    	this.formulario.controls['canal'].setValue(sucursal.idCanal);
    	this.formulario.controls['sucursal'].setValue(sucursal.idSucursal);
    	this.formulario.controls['noc'].setValue(sucursal.bnoc);
    	this.formulario.controls['big'].setValue(sucursal.bbig);
    }

    public mostrarModalAlta() {
    	this.displayModal = true;
    	this.displayDetail = false;
    	this.formulario.controls['pais'].reset({value: "",disabled: false});
    	this.formulario.controls['canal'].reset({value: "",disabled: false});
    	this.formulario.controls['sucursal'].reset({value: "",disabled: false});
    	this.formulario.controls['noc'].reset({value: "",disabled: false});
    	this.formulario.controls['big'].reset({value: "",disabled: false});
    }

	public Regresar(){
    	this.router.navigate(['./mantenimientos']);
    }
}