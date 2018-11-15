import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../../../validator/validation.service';
import { ClassGenerica } from '../../../../classGeneric/config';
import { Service } from '../../../../service/service';
import { PeriodicidadValidate, EdadValidate, ProductoValidate,RangoValidate } from '../instituciones';

import {Notifications} from '../../../../classGeneric/notifications';

@Component({
    selector: 'mantenimiento-instituciones-seguro',
    templateUrl: 'seguro.component.html',
    styleUrls: ['../instituciones.component.css']
})

export class MantenimientoInstitucionesSeguro extends ClassGenerica {

    public menuLateral: Array<Object>;

    public formulario: any;
    public formularioBusqueda: any;
    public formularioCopiar: any;

    public instituciones: any[] = [];

    public plazosScoreDestino: any[] = [];
    public plazosScoreOrigen: any[] = [];

    public enabledCopyConf: boolean = false;
    public modal: boolean = false;
    public enableFormConfig: boolean = false;
    public createItem: boolean = true;

    public periodicidadValidate: PeriodicidadValidate = new PeriodicidadValidate();
    public edadValidate: EdadValidate = new EdadValidate();
    public rangosValidate: RangoValidate = new RangoValidate();
    public productoValidate: ProductoValidate = new ProductoValidate();

    public institucion: any;

    public edades: any[] = [];

    constructor(private service: Service, private formBuilder: FormBuilder, private notifications: Notifications) {
        super();
        this.menuLateral = this.getMenuLateral(1);
        this.menuNavigation = this.menuNavigation();

        this.institucion = super.getAttr('institucionMantenimiento');

        this.SetFormularios();
        this.ConnsultarProductosInst();
    }
    /* Set de los formularios de busqueda */
    private SetFormularios(): void {
        this.formulario = new FormGroup({
            cuota: new FormControl('', [Validators.required]),
            comision: new FormControl('', [Validators.required]),
            edadMin: new FormControl('', [Validators.required]),
            edadMax: new FormControl('', [Validators.required])
        });
        this.formularioBusqueda = new FormGroup({
            producto: new FormControl('', [Validators.required]),
            periocidad: new FormControl('', [Validators.required])
        });
        this.formularioCopiar = new FormGroup({
            institucion: new FormControl('', [Validators.required])
        });

        this.formularioCopiar.controls['institucion'].reset({ value: "", disabled: true });
    }
    /* funcion encargada de obtener los datos del formulario y enviarlos al servicio de alta */
    public actualizarConfig(_item: any): void {

        if(_item !== null) {

            let edadMin: number = parseInt(_item.edadMin,0);
            let edadMax: number = parseInt(_item.edadMax,0);

            if(super.isValid(edadMin) && super.isValid(edadMax)) {
                if(this.rangosValidate.validarRangosMinimoMaximo(edadMin,edadMax)) {

                    this.modal = !this.modal;
                    super.loading(true);
                    let urlService: string = "/mantenimiento/factorseguro/actualiza";
                    let params: object = {
                        idPais: parseInt(this.institucion.idPais,0),
                        idInstitucion: parseInt(this.institucion.idInstitucion,0),
                        idProducto: parseInt(this.formularioBusqueda.controls['producto'].value,0),
                        idPeriodicidad: parseInt(this.formularioBusqueda.controls['periocidad'].value,0),
                        cuota: parseFloat(_item.cuota),
                        comision: parseFloat(_item.comision),
                        edadMinima: edadMin,
                        edadMaxima: edadMax
                    };
                    /*console.log(params);*/
                    this.getData(params,urlService).subscribe((data: any) => {
                        /*console.log(data);*/
                        if (data.codE === 0) {
                           this.notifications.success("Exito !!!",data.msgE);
                           this.ConsultarConfiguracion(this.formularioBusqueda.value);
                        } else {
                            this.notifications.info("Aviso !!!",data.msgE);
                        }
                        super.loading(false);
                    });

                } else {

                    let validacionMinimo: boolean = !this.rangosValidate.esMinimoValido();
                    let validacionMaximo: boolean = !this.rangosValidate.esMaximoValido();
                    
                    if(validacionMinimo){
                        this.formulario.controls['edadMin'].setErrors({incorrect: validacionMinimo});
                    }

                    if(validacionMaximo) {
                        this.formulario.controls['edadMax'].setErrors({incorrect: validacionMaximo});
                    }
                   
                    this.notifications.info("Rango invalido","El rango de edades debe ser mayor a cero, ademas de coherente en su valor minimo y maximo.");
                }
            }
        }
    }
    /* Carga la información de los productos de la institucion */
    private ConnsultarProductosInst(): void {
        super.loading(true);
        this.getData({ idPais: this.institucion.idPais, idInstitucion: this.institucion.idInstitucion }, '/mantenimiento/factorseguro/periocidadproducto/consulta').subscribe((data: any) => {
            /*console.log(data);*/
            if (data.codE === 0) {
                if(data.jsonResultado !== null && data.jsonResultado.length > 0) {
                    this.notifications.success("Exito !!!",data.msgE);
                    this.productoValidate.set(data.jsonResultado);
                    this.periodicidadValidate.set(data.jsonResultado);                   
                } else {
                    this.notifications.info("Aviso !!!","La respuesta fue correcta, pero vacia !!!");
                }
            } else {
                this.notifications.info("Aviso !!!",data.msgE);
            }
            super.loading(false);
        });
    }
    /* Consulta de instituciones que presenten la misma configuracion*/
    private ConsultarInstitucionConf() {
        let params: object = {
            idProducto: this.formularioBusqueda.controls['producto'].value, 
            idPeridocidadPago: this.formularioBusqueda.controls['periocidad'].value
        };
        // Consulta de instituciones con los mismos datos de factor seguro
        this.getData(params, '/mantenimiento/factorseguro/instfactor/consulta').subscribe((data: any) => {
            /*console.log(data);*/
            if (data.codE === 0) {
                if(data.jsonResultado !== null && data.jsonResultado.length > 0) {
                    this.notifications.success("Exito !!!",data.msgE);
                    this.instituciones = data.jsonResultado;
                } else {
                    this.notifications.info("Aviso !!!","La respuesta fue correcta, pero vacia !!!");
                }
                
            } else {
                this.notifications.info("Aviso !!!",data.msgE);
            }
        });
    }
    /* Consulta de configuracion por producto y periodicidad */
    public ConsultarConfiguracion(_item: any): void {
        this.plazosScoreDestino = [];
        if (super.isValid(_item.producto) && super.isValid(_item.periocidad)) {

            let params: object = {
                idPais: this.institucion.idPais,
                idInstitucion: this.institucion.idInstitucion,
                idProducto: parseInt(_item.producto,0),
                idPeridocidadPago: parseInt(_item.periocidad,0)
            };

            super.loading(true);
            this.enableFormConfig = true;
            /*console.log(params);*/
            this.getData(params, '/mantenimiento/factorseguro/plazoscore/consulta').subscribe((data: any) => {
                /*console.log(data);*/
                if (data.codE === 0) {
                    if(data.jsonResultado !== null && data.jsonResultado.length > 0) {
                        this.notifications.success("Exito !!!",data.msgE);
                        this.plazosScoreDestino = data.jsonResultado;
                        this.edadValidate.set(data.jsonResultado);
                        this.edades = this.edadValidate.getMin();
                    } else {
                        this.notifications.info("Aviso !!!","La respuesta fue correcta, pero vacia !!!");
                    }
                } else {
                    this.notifications.info("Aviso !!!",data.msgE);
                }
            });

            super.loading(false);
        }
    }
    /* Consulta de configuracion por empresa */
    private ConsultaConfInstitucion(_src1: any, _src2: any): void {
        if (super.isValid(_src1.institucion) && super.isValid(_src2.producto) && super.isValid(_src2.periocidad)) {
            
            let idPaisInstCopy: number = null;

            for(let inst of this.instituciones) {
                if(inst.idInstitucion === parseInt(_src1.institucion,0)){
                    idPaisInstCopy = inst.idPais;
                }
            }

            let params: object = {
                idPaisOrigen: idPaisInstCopy,
                idInstitucionOrigen: parseInt(_src1.institucion,0),
                idPaisDestino: this.institucion.idPais,
                idInstitucionDestino: this.institucion.idInstitucion,
                idProducto: parseInt(_src2.producto,0),
                idPeriodicidad: parseInt(_src2.periocidad,0)
            };

            super.loading(true);
            /*console.log(params);*/
            this.getData(params, '/mantenimiento/factorseguro/clona').subscribe((data: any) => {
                /*console.log(data);*/
                if (data.codE === 0) {
                    this.notifications.success("Exito !!!",data.msgE);
                    this.plazosScoreOrigen = data.jsonResultado;
                    this.ConsultarConfiguracion(this.formularioBusqueda.value);
                } else {
                    this.notifications.info("Aviso !!!",data.msgE);
                }
            });

            super.loading(false);
        }
    }
    private llenarDatosFormulario(item: any): void {
        /*console.log(item);*/
        this.createItem = false;
        this.limpiarFormularioConfig();
        this.edades = this.edadValidate.getAll();
        this.formulario.controls['cuota'].setValue(item.cuota);
        this.formulario.controls['comision'].setValue(item.comision);
        this.formulario.controls['edadMin'].reset({value: item.edadMax, disabled: true});
        this.formulario.controls['edadMax'].reset({value: item.edadMin, disabled: true});
        this.modal = !this.modal;
    }
    /* Funcion que abre la ventana modal con el formulario previamente reseteado */
    private mostrarFormularioConfig(): void {
        this.edades = this.edadValidate.getMin();
        this.limpiarFormularioConfig();
        this.modal = !this.modal;
        this.createItem = true;
    }
    /* Funcion que resetea el formulario de alta de configuracion */
    private limpiarFormularioConfig(): void {
        this.formulario.controls['cuota'].reset({value: "",disabled: false});
        this.formulario.controls['comision'].reset({value: "",disabled: false});
        this.formulario.controls['edadMin'].reset({value: "",disabled: false});
        this.formulario.controls['edadMax'].reset({value: "",disabled: false});
    }
    /* Funcionamiento de la vista */
    private EnabledCopy(): void {
        this.enabledCopyConf = !this.enabledCopyConf;
        if(this.enabledCopyConf) {
            /*console.log("check");*/
            this.ConsultarInstitucionConf();
            this.formularioCopiar.controls['institucion'].reset({ value: "", disabled: false });
        }
        if (!this.enabledCopyConf) {
            /*console.log("reset");*/ 
            this.formularioCopiar.controls['institucion'].reset({ value: "", disabled: true });
        }
    }
    /* Consumo de servicios */
    private getData = (_params: any, _url: string): Observable<Object> => {
        let observable: any = Observable.create(observer => {
            this.service.post(_params, _url, 3).subscribe(
                (data: any) => {
                    let response = JSON.parse(JSON.stringify(data));
                    observer.next(response);
                    observer.complete();
                },
                error => { observer.next(null); observer.complete(); },
                () => { observer.next(null); observer.complete(); }
            );
        });
        return observable;
    }
}
