import { Component,ViewChild } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Service } from '../../../../service/service';
import { ClassGenerica } from '../../../../classGeneric/config';
import { Notifications } from '../../../../classGeneric/notifications';
import { PaginationFron } from '../../../../classGeneric/paginationFront';
import { RangoValidate,EdadValidate } from '../instituciones';

@Component({
    selector: 'mantenimiento-instituciones-credito',
    templateUrl: 'credito.component.html',
    styleUrls: [
        '../instituciones.component.css',
        '../../../mesa-control/mesa-control.component.css']
})
export class MantenimientoInstitucionesCredito extends ClassGenerica {

    public menuLateral: Array<Object>;
    public objUrlServiciosCredito: any = {};

    public numeroCreditosActivos: number;
    public institucionActual: any = null;
    public formularioBusqueda: any = null;
    public formularioCreditos: any = null;
    public formularioActualizaCred: any = null;
    public formularioActualizaValidaciones: any = null;

    public listaProductos: any[] = [];
    public informacionCredito: any[] = [];
    public listaValidaciones: any[] = [];
    public catalogoValidaciones: any[] = [];
    public listaEdades: any[] = [];
    public arregloValidacionesControls: string[] = [];

    public mostrarTablaDetalle: boolean = false;
    public mostrarFormularioModal: boolean = false;
    public mostrarFormularioAct: boolean = false;
    public mostrarFormularioValidaciones: boolean = false;

    public rangosValidate: RangoValidate = new RangoValidate();
    public edadesValidate: EdadValidate = new EdadValidate();

    constructor(private service: Service,private notifications: Notifications,private pagination: PaginationFron) {
        super();
        this.menuLateral = this.getMenuLateral(1);
        this.menuNavigation = this.menuNavigation();

        this.numeroCreditosActivos = 0;
        this.listaEdades = this.edadesValidate.getAll();
        this.institucionActual = super.getAttr('institucionMantenimiento');

        this.objUrlServiciosCredito = {
        	alta: "/mantenimiento/configuracioncredito/alta",
        	actualizacion: "/mantenimiento/configuracioncredito/actualiza/validacion",
        	consultaInst: "/mantenimiento/configuracioncredito/validacionxInstitucion/consulta",
        	consultaConfig: "/mantenimiento/configuracioncredito/consulta"
        };
        this.inicializarFormularios();
        this.consultarConfigCreditoInstitucion();
    }

    private inicializarFormularios(): void {
    	this.formularioBusqueda = new FormGroup({
    		producto: new FormControl("",[Validators.required])
    	});
    	this.formularioCreditos = new FormGroup({
    		validacion: new FormControl("",[Validators.required]),
    		estatus: new FormControl("",[Validators.required])
    	});
    	this.formularioActualizaCred = new FormGroup({
            arraigo: new FormControl("",[Validators.required]),
            edadMin: new FormControl("",[Validators.required]),
            edadMinMeses: new FormControl("",[Validators.required]),
            edadMax: new FormControl("",[Validators.required]),
            edadMaxMeses: new FormControl("",[Validators.required]),
            sinHistorial: new FormControl("",[Validators.required]),
            tipoCalSal: new FormControl("",[Validators.required]),
            esquemaCred: new FormControl("",[Validators.required]),
            dispPromediar: new FormControl("",[Validators.required]),
            dispPromediarMax: new FormControl("",[Validators.required])
        });
        this.formularioActualizaValidaciones = new FormGroup({
    		condicionesCred: new FormControl("",[]),
    		factorSeguro: new FormControl("",[]),
    		salarioEmp: new FormControl("",[]),
    		tasasConfig: new FormControl("",[]),
    		plazoCredSalario: new FormControl("",[]),
    		plazoCredFico: new FormControl("",[])
    	});
    }

    private reestablecerFormularioAlta(): void {
    	this.formularioCreditos.controls['validacion'].reset({value: "",disabled: false});
    	this.formularioCreditos.controls['estatus'].reset({value: "",disabled: false});
    }

    private mostrarModalAlta(): void {
    	this.mostrarFormularioModal = true;
    	this.reestablecerFormularioAlta();
    }

    public esconderModalAlta(): void {
    	this.mostrarFormularioModal = false;
    }

    private mostrarModalAct(): void {

    	this.mostrarFormularioAct = true;
        this.llenarFormControl();
    }

    public esconderModalAct(): void {
    	this.mostrarFormularioAct = false;
    }

    private mostrarModalValidaciones(): void {

        this.mostrarFormularioValidaciones = true;
        this.llenarFormControl();
        this.reestablecerFormularioValidaciones();

        for(let validacion of this.listaValidaciones) {

            let controlName: string = "";
            let statusNumber: number = null;

            statusNumber = super.isValid(validacion.status) ? validacion.status : 0;

            switch (validacion.idValidacion) {
                case 1: controlName = "condicionesCred"; break;
                case 2: controlName = "factorSeguro"; break;
                case 3: controlName = "salarioEmp"; break;
                case 4: controlName = "tasasConfig"; break;
                case 5: controlName = "plazoCredSalario"; break;
                case 6: controlName = "plazoCredFico"; break;
            }
            this.arregloValidacionesControls.push(controlName);
            this.formularioActualizaValidaciones.controls[controlName].reset({value: statusNumber, disabled: false});
        }
    }

    public esconderModalValidaciones(): void {
        this.mostrarFormularioValidaciones = false;
        this.arregloValidacionesControls = [];
    }

    private reestablecerFormularioValidaciones(): void {
        this.formularioActualizaValidaciones.controls['condicionesCred'].reset({value: "",disabled: false});
        this.formularioActualizaValidaciones.controls['factorSeguro'].reset({value: "",disabled: false});
        this.formularioActualizaValidaciones.controls['salarioEmp'].reset({value: "",disabled: false});
        this.formularioActualizaValidaciones.controls['tasasConfig'].reset({value: "",disabled: false});
        this.formularioActualizaValidaciones.controls['plazoCredSalario'].reset({value: "",disabled: false});
        this.formularioActualizaValidaciones.controls['plazoCredFico'].reset({value: "",disabled: false});
    }

    private llenarFormControl(): void {

        let edadMin: any = this.informacionCredito[0].edadMin === null || this.informacionCredito[0].edadMin === 0 ? "" : this.informacionCredito[0].edadMin;
        let edadMax: any = this.informacionCredito[0].edadMax === null || this.informacionCredito[0].edadMax === 0 ? "" : this.informacionCredito[0].edadMax;
        let historial: any = this.informacionCredito[0].sinHistorial === null || this.informacionCredito[0].sinHistorial === 0 ? "" : this.informacionCredito[0].sinHistorial;
        let salario: any = this.informacionCredito[0].tipoCalSal === null || this.informacionCredito[0].tipoCalSal === 0 ? "" : this.informacionCredito[0].tipoCalSal;
        let esquema: any = this.informacionCredito[0].idEsquemaCred === null || this.informacionCredito[0].idEsquemaCred === 0 ? "" : this.informacionCredito[0].idEsquemaCred;
 
        this.formularioActualizaCred.controls['arraigo'].reset({value: this.informacionCredito[0].arraigoLaboral,disabled: true});
        this.formularioActualizaCred.controls['edadMin'].setValue(edadMin);
        this.formularioActualizaCred.controls['edadMinMeses'].setValue(this.informacionCredito[0].edadMinMeses);
        this.formularioActualizaCred.controls['edadMax'].setValue(edadMax);
        this.formularioActualizaCred.controls['edadMaxMeses'].setValue(this.informacionCredito[0].edadMaxMeses);
        this.formularioActualizaCred.controls['sinHistorial'].setValue(historial);
        this.formularioActualizaCred.controls['tipoCalSal'].setValue(salario);
        this.formularioActualizaCred.controls['esquemaCred'].setValue(esquema);
        this.formularioActualizaCred.controls['dispPromediar'].setValue(this.informacionCredito[0].dispPromediar);
        this.formularioActualizaCred.controls['dispPromediarMax'].setValue(this.informacionCredito[0].dispPromediarMAx);
    }

    private actualizarConfigCreditoValidaciones(_form: any): void {
        if(super.isValid(_form)) {

            let condicionesCred: number = parseInt(_form.condicionesCred,0);
            let factorSeguro: number = parseInt(_form.factorSeguro,0);
            let salarioEmp: number = parseInt(_form.salarioEmp,0);
            let tasasConfig: number = parseInt(_form.tasasConfig,0);
            let plazoCredSalario: number = parseInt(_form.plazoCredSalario,0);
            let plazoCredFico: number = super.isValid(_form.plazoCredFico) ? parseInt(_form.plazoCredFico,0) : null;

            let edadMin: number = parseInt(this.formularioActualizaCred.controls['edadMin'].value,0);
            let edadMinMeses: number = parseInt(this.formularioActualizaCred.controls['edadMinMeses'].value,0);
            let edadMax: number = parseInt(this.formularioActualizaCred.controls['edadMax'].value,0);
            let edadMaxMeses: number = parseInt(this.formularioActualizaCred.controls['edadMaxMeses'].value,0);

            let dispMin: number = parseInt(this.formularioActualizaCred.controls['dispPromediar'].value,0);
            let dispMax: number = parseInt(this.formularioActualizaCred.controls['dispPromediarMax'].value,0);

            let arraigo: number = parseInt(this.formularioActualizaCred.controls['arraigo'].value,0);
            let sinHistorial: number = this.formularioActualizaCred.controls['sinHistorial'].value;
            let tipoCalSal: number = parseInt(this.formularioActualizaCred.controls['tipoCalSal'].value,0);
            let esquemaCred: number = parseInt(this.formularioActualizaCred.controls['esquemaCred'].value,0);
            
            super.loading(true);
            let objRequest: object = {
                idInstitucion: this.institucionActual.idInstitucion,
                idProducto: parseInt(this.formularioBusqueda.controls['producto'].value,0),
                numCreditoActivos:null,
                condicionCredito: condicionesCred,
                factorSeguro: factorSeguro,
                salarioEmp: salarioEmp,
                configTasas: tasasConfig,
                plazoCreditoSalario: plazoCredSalario,
                plazoCreditofico: plazoCredFico,
                arraigoLaboral: arraigo,
                edadMin: edadMin,
                edadMinMeses: edadMinMeses,
                edadMax: edadMax,
                edadMaxMeses: edadMaxMeses,
                sinHistorial: sinHistorial,
                dispPromediar: dispMin,
                dispPromediarMAx: dispMax,
                tipoCalSal: tipoCalSal,
                idEsquemaCred: esquemaCred,
            };

            /*console.log(objRequest);*/
            this.realizarPeticionHttp(objRequest, this.objUrlServiciosCredito.actualizacion).subscribe((data: any) => {
                /*console.log(data);*/
                if (data.codE === 0) {
                    this.notifications.success("Exito !!!",data.msgE);
                    this.consultarConfiguracionPorProducto(this.formularioBusqueda.value);
                } else {
                    this.notifications.info("Aviso !!!",data.msgE);
                }
                this.esconderModalValidaciones();
                super.loading(false);
            });
        }
    }

    public consultarConfiguracionPorProducto(_formBusqueda: any): void {
    	if(super.isValid(_formBusqueda) && super.isValid(_formBusqueda.producto)) {

    		super.loading(true);
    		let objRequest: object = {idProducto: parseInt(_formBusqueda.producto,0),idInstitucion: this.institucionActual.idInstitucion};
    		/*console.log(objRequest);*/
    		this.realizarPeticionHttp(objRequest, this.objUrlServiciosCredito.consultaInst).subscribe((data: any) => {
		        /*console.log(data);*/
		        if (data.codE === 0) {
		        	if(data.jsonResultado !== null) {
	                    this.notifications.success("Exito !!!",data.msgE);
	                    this.informacionCredito = data.jsonResultado.listCreditoInst;
	                    this.listaValidaciones = data.jsonResultado.listValidacionCredito2;
	                    this.catalogoValidaciones = data.jsonResultado.listValidacionCredito3;
	                    this.numeroCreditosActivos = this.informacionCredito[0].numCreditoActivos;
	                    this.mostrarTablaDetalle = true;
	                } else {
	                    this.notifications.info("Aviso !!!","La respuesta fue correcta, pero vacia !!!");
	                }
		        } else {
		            this.notifications.info("Aviso !!!",data.msgE);
		        }
		        super.loading(false);
		    });

    	}
    }

    private consultarConfigCreditoInstitucion(): void {

    	super.loading(true);
    	let objRequest: object = {idInstitucion: this.institucionActual.idInstitucion};
    	
    	this.realizarPeticionHttp(objRequest, this.objUrlServiciosCredito.consultaConfig).subscribe((data: any) => {
	        /*console.log(data);*/
	        if (data.codE === 0) {
	        	if(data.jsonResultado !== null && data.jsonResultado.length > 0) {
                    this.notifications.success("Exito !!!",data.msgE);
                    this.depurarContenidoDuplicado(data.jsonResultado);                   	
                } else {
                    this.notifications.info("Aviso !!!","La respuesta fue correcta, pero vacia !!!");
                }
	        } else {
	            this.notifications.info("Aviso !!!",data.msgE);
	        }
	        super.loading(false);
	    });
    }

    public crearConfigCreditoInstitucion(_formCredito: any): void {
    	if(super.isValid(_formCredito) && super.isValid(_formCredito.validacion) && super.isValid(_formCredito.estatus)) {

    		super.loading(true);
    		let objRequest: object = {
    			idInstitucion: this.institucionActual.idInstitucion,
    			idProducto: parseInt(this.formularioBusqueda.controls['producto'].value,0),
    			idValidacion: parseInt(_formCredito.validacion,0),
    			status: parseInt(_formCredito.estatus,0),
    			usuario: super.isKeyUser()
    		};
    		/*console.log(objRequest);*/
    		this.realizarPeticionHttp(objRequest, this.objUrlServiciosCredito.alta).subscribe((data: any) => {
		        /*console.log(data);*/
		        if (data.codE === 0) {
	            	this.notifications.success("Exito !!!",data.msgE);
	            	this.consultarConfiguracionPorProducto(this.formularioBusqueda.value);
		        } else {
		            this.notifications.info("Aviso !!!",data.msgE);
		        }
		        this.esconderModalAlta();
		        super.loading(false);
		    });
    	}
    }

    public actualizarConfigCreditoInstitucion(_formCredito: any): void {
    	if(super.isValid(_formCredito)) {

            let edadMin: number = parseInt(_formCredito.edadMin,0);
            let edadMax: number = parseInt(_formCredito.edadMax,0);

            let dispMin: number = parseInt(_formCredito.dispPromediar,0);
            let dispMax: number = parseInt(_formCredito.dispPromediarMax,0);

            if(super.isValid(edadMin) && super.isValid(edadMax)) {
                if(this.rangosValidate.validarRangosMinimoMaximo(edadMin,edadMax)) {  
                    if(super.isValid(dispMin) && super.isValid(dispMax)) {
                        if(this.rangosValidate.validarRangosMinimoMaximo(dispMin,dispMax)) {

                            super.loading(true);
                            let objRequest: object = {
                                idInstitucion: this.institucionActual.idInstitucion,
                                idProducto: parseInt(this.formularioBusqueda.controls['producto'].value,0),
                                numCreditoActivos:null,
                                condicionCredito:null,
                                factorSeguro:null,
                                salarioEmp:null,
                                configTasas:null,
                                plazoCreditoSalario:null,
                                plazoCreditofico:null,
                                arraigoLaboral: parseInt(_formCredito.arraigo,0),
                                edadMin: edadMin,
                                edadMinMeses: parseInt(_formCredito.edadMinMeses,0),
                                edadMax: edadMax,
                                edadMaxMeses: parseInt(_formCredito.edadMaxMeses,0),
                                sinHistorial: _formCredito.sinHistorial,
                                dispPromediar: dispMin,
                                dispPromediarMAx: dispMax,
                                tipoCalSal: parseInt(_formCredito.tipoCalSal,0),
                                idEsquemaCred: parseInt(_formCredito.esquemaCred,0)
                            };

                            /*console.log(objRequest);*/
                            this.realizarPeticionHttp(objRequest, this.objUrlServiciosCredito.actualizacion).subscribe((data: any) => {
                                /*console.log(data);*/
                                if (data.codE === 0) {
                                    this.notifications.success("Exito !!!",data.msgE);
                                    this.consultarConfiguracionPorProducto(this.formularioBusqueda.value);
                                } else {
                                    this.notifications.info("Aviso !!!",data.msgE);
                                }
                                this.esconderModalAct();
                                super.loading(false);
                            });

                        } else {

                            let validacionMinimo: boolean = !this.rangosValidate.esMinimoValido();
                            let validacionMaximo: boolean = !this.rangosValidate.esMaximoValido();
                            
                            if(validacionMinimo){
                                this.formularioActualizaCred.controls['dispPromediar'].setErrors({incorrect: validacionMinimo});
                            }

                            if(validacionMaximo) {
                                this.formularioActualizaCred.controls['dispPromediarMax'].setErrors({incorrect: validacionMaximo});
                            }
                            
                            this.notifications.info("Rango invalido","El rango de dispersiones debe ser mayor a cero, ademas de coherente en su valor minimo y maximo.");
                        }
                    }
                } else {

                    let validacionMinimo: boolean = !this.rangosValidate.esMinimoValido();
                    let validacionMaximo: boolean = !this.rangosValidate.esMaximoValido();
                    
                    if(validacionMinimo){
                        this.formularioActualizaCred.controls['edadMin'].setErrors({incorrect: validacionMinimo});
                    }

                    if(validacionMaximo) {
                        this.formularioActualizaCred.controls['edadMax'].setErrors({incorrect: validacionMaximo});
                    }
                   
                    this.notifications.info("Rango invalido","El rango de edades debe ser mayor a cero, ademas de coherente en su valor minimo y maximo.");
                }
            }
    	}
    }

    private depurarContenidoDuplicado(_data: any[]) {

        let found, x, y;
        let oldArray: any;
        let newArray: any;

        //Se ietra sobre el arreglo que contiene la informacion
        for (x = 0; x < _data.length; x++) {
            found = false;
            oldArray = _data[x];
            // Por cada valor del arreglo original se itera el contenido del arreglo nuevo
            for (y = 0; y < this.listaProductos.length; y++) {

                newArray = this.listaProductos[y];

                // Si el valor de la posicion obtenida en el arreglo original es igual a la del arreglo nuevo se marca una bandera
                if (oldArray.idProducto === newArray.idProducto) {
                    found = true;
                    break;
                }
            }    
            // Si los valores no son iguales se agrega al nuevo arreglo
            if (!found) {
                this.listaProductos.push({idProducto: oldArray.idProducto,descripcionProducto: oldArray.fcDescripcion});
            }
        }
    }

    private realizarPeticionHttp = (_requestJson: any, _requestUrl: string): Observable<Object> => {

        let observableRequest: any = Observable.create(observer => {

            this.service.post(_requestJson, _requestUrl, 3).subscribe(
                (data: any) => {
                    let response = JSON.parse(JSON.stringify(data));
                    observer.next(response);
                    observer.complete();
                },
                error => { observer.next(null); observer.complete(); },
                () => { observer.next(null); observer.complete(); }
            );
        });
        return observableRequest;
    }
}
