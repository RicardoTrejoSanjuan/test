import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../../../validator/validation.service';
import { ClassGenerica } from '../../../../classGeneric/config';
import { Service } from '../../../../service/service';
import { PeriodicidadValidate, ProductoValidate,RangoValidate } from '../instituciones';

import { Notifications } from '../../../../classGeneric/notifications';
import { PaginationFron } from '../../../../classGeneric/paginationFront';


const RANGOS_SALARIO: number = 1;
const RANGOS_PLAZO: number = 2;

@Component({
    selector: 'mantenimiento-instituciones-riesgo',
    templateUrl: 'riesgo.component.html',
    styleUrls: [
        '../instituciones.component.css',
        '../../../mesa-control/mesa-control.component.css'
    ]
})

export class MantenimientoInstitucionesRiesgo extends ClassGenerica {
    
    public menuLateral: Array<Object>;

    public formularioBusqueda: any;
    public formularioCopiar: any;
    public formularioCopiarSalario: any;
    public formularioPlazoScore: any;
    public formularioSalarioScore: any;

    public institucionCurrent: any;
    public institucionesConfig: any[] = [];
    public institucionesConfigSalario: any[] = [];

    public rangosValidate: RangoValidate = new RangoValidate();
    public productoValidate: ProductoValidate = new ProductoValidate();
    public periodicidadValidate: PeriodicidadValidate = new PeriodicidadValidate();
    
    public mostrarBotonAlta: boolean = false;
    public mostrarFormularioScore: boolean = false;
    public mostrarFormularioSalario: boolean = false;
    public mostrarCopiaConfig: boolean = false;
    public mostrarCopiaConfigSalario: boolean = false;
    public mostrarFormularioEliminar: boolean = false;

    public crearPlazo: boolean = false;
    public crearSalarios: boolean = false;

    public salariosInstitucion: any[] = [];
    public scoreInstitucion: any[] = [];

    public paginadorSalarios: any = {};
    public paginadorScores: any = {};

    public objetoEliminar: any = {};
    public rutaEliminar: string = "";

    public scores: any[] = [];
    public salarios: any[] = [];

    public salariosRegistrados: any[] = [];
    public plazosRegistrados: any[] = [];

    constructor(private service: Service, private notifications: Notifications,private paginationFront: PaginationFron) {
        super();
        this.menuLateral = this.getMenuLateral(1);
        this.menuNavigation = this.menuNavigation();
        this.institucionCurrent = super.getAttr('institucionMantenimiento');
        this.inicializarFormularios();
        this.consultarProductosInst();        
    }
    private consultarProductosInst(): void {

        let urlRequest: string = "/mantenimiento/factorseguro/periocidadproducto/consulta";
        let objRequest: object = {idPais: this.institucionCurrent.idPais, idInstitucion: this.institucionCurrent.idInstitucion};

        this.realizarPeticionHttp(objRequest, urlRequest).subscribe((data: any) => {
            /*console.log(data);*/
            if (data.codE === 0) {
                if(data.jsonResultado !== null && data.jsonResultado.length > 0) {
                    this.notifications.success("Exito !!!",data.msgE);
                    this.productoValidate.set(data.jsonResultado);
                    this.periodicidadValidate.set(data.jsonResultado);                   
                } else {
                    this.notifications.info("Aviso !!!","La respuesta no arrojó ningún resultado");
                }
            } else {
                this.notifications.info("Aviso !!!",data.msgE);
            }
        });
    }
    public consultarConfigScoreSalario(_form: any): void {
        if(_form !== null) {

            this.paginadorSalarios = {};
            this.paginadorScores = {};

            this.salariosInstitucion = [];
            this.scoreInstitucion = [];

            let urlRequest: string = "/mantenimiento/catalogos/busqueda-score-salario/consulta";
            let objRequest: object = {idInstitucion: this.institucionCurrent.idInstitucion,idProducto: parseInt(_form.producto,0),idPerPag: parseInt(_form.periocidad,0)};
            /*console.log(objRequest);*/
            this.realizarPeticionHttp(objRequest, urlRequest).subscribe((data: any) => {
                /*console.log(data);*/
                if (data.codE === 0) {
                    if(data.jsonResultado !== null) {

                        this.notifications.success("Exito !!!",data.msgE);

                        this.salarios = data.jsonResultado.datosSalario.length > 0 ? data.jsonResultado.datosSalario : [];
                        this.scores = data.jsonResultado.datosScore.length > 0 ? data.jsonResultado.datosScore : [];

                        let lengthSalarios: number = this.salarios.length;
                        let lengthScores: number = this.scores.length;

                        let salarios: any[] = [];
                        let plazos: any[] = [];

                        if(lengthScores > 0) {
                            this.paginadorScores = this.paginationFront.getPager(lengthScores);
                            this.scoreInstitucion = this.paginationFront.getPagerdata(this.scores);

                            for(let plazo of this.scores){
                                if(super.isValid(plazo.scoreMinimo) && super.isValid(plazo.scoreMaximo)) {
                                    let objPlazo: any = {scoreMin: plazo.scoreMinimo,scoreMax: plazo.scoreMaximo};
                                    plazos.push(objPlazo);
                                }
                            }

                            this.plazosRegistrados = plazos;
                        }

                        if(lengthSalarios > 0) {
                            this.paginadorSalarios = this.paginationFront.getPager(lengthSalarios);
                            this.salariosInstitucion = this.paginationFront.getPagerdata(this.salarios);

                            for(let salario of this.salarios){
                                if(super.isValid(salario.sueldoMinimo) && super.isValid(salario.sueldoMaximo)) {
                                    let objSalario: any = {sueldoMin: salario.sueldoMinimo, sueldoMax: salario.sueldoMaximo};
                                    salarios.push(objSalario);
                                }
                            }

                            this.salariosRegistrados = salarios;
                        }

                        this.mostrarBotonAlta = true;

                    } else {
                        this.notifications.info("Aviso !!!","La respuesta no arrojó ningún resultado");
                    }
                } else {
                    this.notifications.info("Aviso !!!",data.msgE);
                }
            });
        }
    }
    private consultarConfigInst(_form: any): void {

        if(_form !== null) {

            let urlRequest: string = "/mantenimiento/catalogos/institucion/consulta";
            let objRequest: object = {idProducto: parseInt(_form.producto,0),idPerPag: parseInt(_form.periocidad,0)};
            /*console.log(objRequest);*/
            this.realizarPeticionHttp(objRequest, urlRequest).subscribe((data: any) => {
                /*console.log(data);*/
                if (data.codE === 0) {
                    if(data.jsonResultado !== null && data.jsonResultado.length > 0) {
                        this.notifications.success("Exito !!!",data.msgE);

                        if(this.mostrarCopiaConfig) {
                            this.institucionesConfig = data.jsonResultado;
                            if(this.institucionesConfig.length > 0) {
                                this.formularioCopiar.controls['institucion'].reset({ value: '', disabled: false });
                            }
                        }else if(this.mostrarCopiaConfigSalario) {
                            this.institucionesConfigSalario = data.jsonResultado;
                            if(this.institucionesConfigSalario.length > 0) {
                                this.formularioCopiarSalario.controls['institucion'].reset({ value: '', disabled: false });
                            }
                        }

                        
                    } else {
                        this.notifications.info("Aviso !!!","La respuesta no arrojó ningún resultado");
                    }
                } else {
                    this.notifications.info("Aviso !!!",data.msgE);
                }
            });
        }
    } 
    private clonarConfigPlazos(_formCopia: any, _formBusqueda: any): void {
        
        if(_formBusqueda !== null && _formCopia !== null) {

            let urlRequest: string = "/mantenimiento/catalogos/copia-configuracion/copiar";
            let objRequest: object = {
                idInstitucionOrigen: parseInt(_formCopia.institucion,0),
                idInstitucionDestino: this.institucionCurrent.idInstitucion,
                idProducto: parseInt(_formBusqueda.producto,0),
                idPerPag: parseInt(_formBusqueda.periocidad,0)
            };
            /*console.log(objRequest);*/
            this.realizarPeticionHttp(objRequest, urlRequest).subscribe((data: any) => {
                /*console.log(data);*/
                if (data.codE === 0) {
                    this.notifications.success("Exito !!!",data.msgE);
                    this.consultarConfigScoreSalario(this.formularioBusqueda.value);
                } else {
                    this.notifications.info("Aviso !!!",data.msgE);
                }
            });
        }

    }
    private eliminarConfigPlazos(_configPlazo: any): void {

        if(super.isValid(_configPlazo)) {

            let urlRequest: string = "/mantenimiento/matrizriesgo/scoreconfig/elimina";
            let objRequest: object = {
                idInstitucion: this.institucionCurrent.idInstitucion,
                idProducto: parseInt(this.formularioBusqueda.controls['producto'].value,0),
                idPerPag: parseInt(this.formularioBusqueda.controls['periocidad'].value,0),
                plazo: parseInt(_configPlazo.plazo ,0),
                scoreMinimo: parseInt(_configPlazo.scoreMinimo ,0),
                scoreMaximo: parseInt(_configPlazo.scoreMaximo ,0),
                tasa: parseInt(_configPlazo.tasa ,0)
            };

            /*console.log(objRequest);*/
            this.realizarPeticionHttp(objRequest, urlRequest).subscribe((data: any) => {
                /*console.log(data);*/
                if (data.codE === 0) {
                    this.notifications.success("Exito !!!",data.msgE);
                    this.consultarConfigScoreSalario(this.formularioBusqueda.value);
                } else {
                    this.notifications.info("Aviso !!!",data.msgE);
                }
            });
        }
    }
    private clonarConfigSalarios(_formCopia: any, _formBusqueda: any): void {
        
        if(_formBusqueda !== null && _formCopia !== null) {

            let urlRequest: string = "/mantenimiento/matrizriesgo/score/altaconfig";
            let objRequest: object = {
                idInstitucion: parseInt(_formCopia.institucion,0),
                inIdInstitucion: this.institucionCurrent.idInstitucion,
                idProducto: parseInt(_formBusqueda.producto,0), 
                idPerPag: parseInt(_formBusqueda.periocidad,0),
                usrCrea: super.isKeyUser()
            };
            /*console.log(objRequest);*/
            this.realizarPeticionHttp(objRequest, urlRequest).subscribe((data: any) => {
                /*console.log(data);*/
                if (data.codE === 0) {
                    this.notifications.success("Exito !!!",data.msgE);
                    this.consultarConfigScoreSalario(this.formularioBusqueda.value);
                } else {
                    this.notifications.info("Aviso !!!",data.msgE);
                }
            });
        }

    }
    private eliminarConfigSalarios(_configSalario: any): void {
        
        if(super.isValid(_configSalario)) {

            let urlRequest: string = "/mantenimiento/matrizriesgo/scoresalario/elimina";
            let objRequest: object = {
                idInstitucion: this.institucionCurrent.idInstitucion,
                idProducto: parseInt(this.formularioBusqueda.controls['producto'].value,0),
                idPerPag: parseInt(this.formularioBusqueda.controls['periocidad'].value,0),
                sueldoMinimo: parseInt(_configSalario.sueldoMinimo,0),
                sueldoMaximo: parseInt(_configSalario.sueldoMaximo,0)
            };

            /*console.log(objRequest);*/
            this.realizarPeticionHttp(objRequest, urlRequest).subscribe((data: any) => {
                /*console.log(data);*/
                if (data.codE === 0) {
                    this.notifications.success("Exito !!!",data.msgE);
                } else {
                    this.notifications.info("Aviso !!!",data.msgE);
                }
            });
        }
    }
    public crearSalario(_form: any): void {
        if(_form !== null){

            let salarioMinimo: number = parseInt(_form.salariomin,0);
            let salarioMaximo: number = parseInt(_form.salariomax,0);
            let puntosMinimos: number = parseInt(_form.scoremin,0);

            if(super.isValid(salarioMinimo) && super.isValid(salarioMaximo)) {
                if(this.rangosValidate.validarRangosMinimoMaximo(salarioMinimo,salarioMaximo)) {

                    if(this.validarRangos(salarioMinimo,RANGOS_SALARIO)) {
                        if(this.validarRangos(salarioMaximo,RANGOS_SALARIO)) {
                            if(this.validarRangosDentro(salarioMinimo,RANGOS_SALARIO)){
                                if(this.validarRangosDentro(salarioMaximo,RANGOS_SALARIO)){
                                    if(this.validarRangosFuera(salarioMinimo,salarioMaximo,RANGOS_SALARIO)){
                                        
                                        let urlRequest: string = "/mantenimiento/matrizriesgo/score/alta";
                                        let objRequest: object = {
                                            idInstitucion: this.institucionCurrent.idInstitucion,
                                            idProducto: parseInt(this.formularioBusqueda.controls['producto'].value,0),
                                            idPerPag: parseInt(this.formularioBusqueda.controls['periocidad'].value,0),
                                            sueldoMinimo: salarioMinimo,
                                            sueldoMaximo: salarioMaximo,
                                            scoreMinimo: puntosMinimos
                                        };
                                        /*console.log(objRequest);*/
                                        this.realizarPeticionHttp(objRequest, urlRequest).subscribe((data: any) => {
                                            /*console.log(data);*/
                                            if (data.codE === 0) {
                                                this.mostrarFormularioSalario = false;
                                                this.notifications.success("Exito !!!",data.msgE);
                                                this.consultarConfigScoreSalario(this.formularioBusqueda.value);
                                            } else {
                                                this.notifications.info("Aviso !!!",data.msgE);
                                            }
                                        });
                                    }else {
                                        this.notifications.info("Aviso !!!","El rango de salario no es valido");
                                    }
                                }else {
                                    this.notifications.info("Aviso !!!","El salario maximo se encuentra dentro de un rango no permitido");
                                }
                            }else {
                                this.notifications.info("Aviso !!!","El salario minimo se encuentra dentro de un rango no permitido");
                            }
                        }else {
                            this.notifications.info("Aviso !!!","El salario maximo ya se encuentra registrado");
                        }
                    } else {
                        this.notifications.info("Aviso !!!","El salario minimo ya se encuentra registrado");
                    }

                } else {

                    let validacionMinimo: boolean = !this.rangosValidate.esMinimoValido();
                    let validacionMaximo: boolean = !this.rangosValidate.esMaximoValido();
                    
                    if(validacionMinimo){
                        this.formularioSalarioScore.controls['salariomin'].setErrors({incorrect: validacionMinimo});
                    }

                    if(validacionMaximo) {
                        this.formularioSalarioScore.controls['salariomax'].setErrors({incorrect: validacionMaximo});
                    }

                    this.notifications.info("Rango invalido","El rango de salarios debe ser mayor a cero, ademas de coherente en su valor minimo y maximo.");
                }    
            }        
        }
    }
    public crearPlazoScore(_form: any): void {
        if(super.isValid(_form)) {

            let plazoScoreMinimo: number = parseInt(_form.scoremin,0);
            let plazoScoreMaximo: number = parseInt(_form.scoremax,0);
            let plazo: number = parseInt(_form.plazo,0);
            let tasa: number = parseFloat(_form.tasa);

            if(super.isValid(plazoScoreMinimo) && super.isValid(plazoScoreMaximo)){
                if(this.rangosValidate.validarRangosMinimoMaximo(plazoScoreMinimo, plazoScoreMaximo)) {

                    if(this.validarRangos(plazoScoreMinimo,RANGOS_PLAZO)) {
                        if(this.validarRangos(plazoScoreMaximo,RANGOS_PLAZO)) {
                            if(this.validarRangosDentro(plazoScoreMinimo,RANGOS_PLAZO)){
                                if(this.validarRangosDentro(plazoScoreMaximo,RANGOS_PLAZO)){
                                    if(this.validarRangosFuera(plazoScoreMinimo,plazoScoreMaximo,RANGOS_PLAZO)){
                                        
                                        let urlRequest: string = "/mantenimiento/matrizriesgo/score/iuplazos";
                                        let objRequest: object = {
                                            idInstitucion: this.institucionCurrent.idInstitucion,
                                            idProducto: parseInt(this.formularioBusqueda.controls['producto'].value,0),
                                            idPerPag: parseInt(this.formularioBusqueda.controls['periocidad'].value,0),
                                            scoreMinimo: plazoScoreMinimo,
                                            scoreMaximo: plazoScoreMaximo,
                                            plazo: plazo,
                                            tasa: tasa,
                                            usrCrea: super.isKeyUser()
                                        };
                                        /*console.log(objRequest);*/
                                        this.realizarPeticionHttp(objRequest, urlRequest).subscribe((data: any) => {
                                            /*console.log(data);*/
                                            if (data.codE === 0) {
                                                this.mostrarFormularioScore = false;
                                                this.notifications.success("Exito !!!",data.msgE);
                                                this.consultarConfigScoreSalario(this.formularioBusqueda.value);
                                            } else {
                                                this.notifications.info("Aviso !!!",data.msgE);
                                            }
                                        });

                                    }else {
                                        this.notifications.info("Aviso !!!","El rango de score no es valido");
                                    }
                                }else {
                                    this.notifications.info("Aviso !!!","El score maximo se encuentra dentro de un rango no permitido");
                                }
                            }else {
                                this.notifications.info("Aviso !!!","El score minimo se encuentra dentro de un rango no permitido");
                            }
                        }else {
                            this.notifications.info("Aviso !!!","El score maximo ya se encuentra registrado");
                        }
                    }else {
                        this.notifications.info("Aviso !!!","El score minimo ya se encuentra registrado");
                    }  

                } else {

                    let validacionMinimo: boolean = !this.rangosValidate.esMinimoValido();
                    let validacionMaximo: boolean = !this.rangosValidate.esMaximoValido();
                    
                    if(validacionMinimo){
                        this.formularioPlazoScore.controls['scoremin'].setErrors({incorrect: validacionMinimo});
                    }

                    if(validacionMaximo) {
                        this.formularioPlazoScore.controls['scoremax'].setErrors({incorrect: validacionMaximo});
                    }

                    this.notifications.info("Rango invalido","El rango de score debe ser mayor a cero, ademas de coherente en su valor minimo y maximo.");
                }
            }                      
        }
    }
    private inicializarFormularios(): void {
        this.formularioPlazoScore = new FormGroup({
            plazo: new FormControl('',[Validators.required]),
            tasa: new FormControl('',[Validators.required]),
            scoremin: new FormControl('',[Validators.required]),
            scoremax: new FormControl('',[Validators.required])
        });
        this.formularioSalarioScore = new FormGroup({
            scoremin: new FormControl('',[Validators.required]),
            salariomin: new FormControl('',[Validators.required]),
            salariomax: new FormControl('',[Validators.required])
        });
        this.formularioBusqueda = new FormGroup({
            producto: new FormControl('', [Validators.required]),
            periocidad: new FormControl('', [Validators.required])
        });
        this.formularioCopiar = new FormGroup({
            institucion: new FormControl('', [Validators.required])
        });
        this.formularioCopiarSalario = new FormGroup({
            institucion: new FormControl('', [Validators.required])
        });
        this.formularioCopiar.controls['institucion'].reset({ value: '', disabled: true });
        this.formularioCopiarSalario.controls['institucion'].reset({ value: '', disabled: true });
    }
    private mostrarFormularioAltaPlazoScore(): void {
        this.mostrarFormularioScore = true;
        this.crearPlazo = true;
        this.limpiarFormularioPlazoScore();
    }
    private mostrarFormularioAltaSalarioScore(): void {
        this.mostrarFormularioSalario = true;
        this.crearSalarios = true;
        this.limpiarFormularioSalarioScore();
    }
    private llenarFormularioPlazoScore(_item: any): void {
        if(super.isValid(_item)){
            this.crearPlazo = false;
            this.limpiarFormularioPlazoScore();
            this.formularioPlazoScore.controls['scoremin'].reset({value: _item.scoreMinimo,disabled: true});    
            this.formularioPlazoScore.controls['scoremax'].reset({value: _item.scoreMaximo,disabled: true});    
            this.formularioPlazoScore.controls['plazo'].reset({value: _item.plazo,disabled: true});    
            this.formularioPlazoScore.controls['tasa'].setValue(_item.tasa);
            this.mostrarFormularioScore = true;    
        }
    }
    private llenarFormularioSalarioScore(_item: any): void {
        if(super.isValid(_item)){
            this.crearSalarios = false;
            this.limpiarFormularioSalarioScore();
            this.formularioSalarioScore.controls['salariomin'].reset({ value: _item.sueldoMinimo, disabled: true });    
            this.formularioSalarioScore.controls['salariomax'].reset({ value: _item.sueldoMaximo, disabled: true });    
            this.formularioSalarioScore.controls['scoremin'].reset({ value: _item.scoreMinimo,disabled: false });
            this.mostrarFormularioSalario = true;    
        }
    }
    private limpiarFormularioPlazoScore(): void {
        this.formularioPlazoScore.controls['scoremin'].reset({ value: "", disabled: false });
        this.formularioPlazoScore.controls['scoremax'].reset({ value: "", disabled: false });
        this.formularioPlazoScore.controls['plazo'].reset({ value: "", disabled: false });
        this.formularioPlazoScore.controls['tasa'].reset({ value: "", disabled: false });
    }
    private limpiarFormularioSalarioScore(): void {
        this.formularioSalarioScore.controls['salariomin'].reset({ value: "", disabled: false });
        this.formularioSalarioScore.controls['salariomax'].reset({ value: "", disabled: false });
        this.formularioSalarioScore.controls['scoremin'].reset({ value: "", disabled: false });
    }
    private asignarValoresEliminar(_item: any, tipo: number): void {
        
        if(super.isValid(_item) && super.isValid(tipo)) {
            this.mostrarFormularioEliminar = true;
            let objEliminar: any = {};
            let urlEliminar: string = "";
            switch (tipo) {
                case 1:
                    urlEliminar = "/mantenimiento/matrizriesgo/scoreconfig/elimina";
                    objEliminar = {
                        idInstitucion: null,
                        idProducto: null,
                        idPerPag: null,
                        plazo: parseInt(_item.plazo,0),
                        scoreMinimo: parseInt(_item.scoreMinimo,0),
                        scoreMaximo: parseInt(_item.scoreMaximo,0),
                        tasa: parseInt(_item.tasa,0)
                    };
                    break;
                case 2:
                    urlEliminar = "/mantenimiento/matrizriesgo/scoresalario/elimina";
                    objEliminar = {
                        idInstitucion: null,
                        idProducto: null,
                        idPerPag: null,
                        sueldoMinimo: parseInt(_item.sueldoMinimo,0),
                        sueldoMaximo: parseInt(_item.sueldoMaximo,0)
                    };    
                    break;    
                default:
                    this.notifications.error("No es posible asignar los valores a eliminar");
                    break;
            }

            this.objetoEliminar = objEliminar;
            this.rutaEliminar = urlEliminar;
        }
    }
    public eliminarElemento(): void {

        if(super.isValid(this.objetoEliminar)){

            this.objetoEliminar.idInstitucion = this.institucionCurrent.idInstitucion;
            this.objetoEliminar.idProducto = parseInt(this.formularioBusqueda.controls['producto'].value,0);
            this.objetoEliminar.idPerPag = parseInt(this.formularioBusqueda.controls['periocidad'].value,0);
            /*console.log(this.objetoEliminar);*/
            this.realizarPeticionHttp(this.objetoEliminar, this.rutaEliminar).subscribe((data: any) => {
                /*console.log(data);*/
                if (data.codE === 0) {
                    this.mostrarFormularioEliminar = false;
                    this.notifications.success("Exito !!!",data.msgE);
                    this.consultarConfigScoreSalario(this.formularioBusqueda.value);
                } else {
                    this.notifications.info("Aviso !!!",data.msgE);
                }
            });
        }
        
    }
    private habilitarSeccionCopiar(): void {

        this.mostrarCopiaConfig = !this.mostrarCopiaConfig;

        if(this.mostrarCopiaConfig) {
            /*console.log("check");*/
            this.consultarConfigInst(this.formularioBusqueda.value);
        }

        if (!this.mostrarCopiaConfig) {
            /*console.log("reset");*/
            this.institucionesConfig = [];
            this.formularioCopiar.controls['institucion'].reset({ value: "", disabled: true }); 
        }
    }
    private habilitarSeccionCopiarSalario(): void {

        this.mostrarCopiaConfigSalario = !this.mostrarCopiaConfigSalario;

        if(this.mostrarCopiaConfigSalario) {
            /*console.log("check");*/
            this.consultarConfigInst(this.formularioBusqueda.value);
        }

        if (!this.mostrarCopiaConfigSalario) {
            /*console.log("reset");*/
            this.institucionesConfigSalario = [];
            this.formularioCopiarSalario.controls['institucion'].reset({ value: "", disabled: true }); 
        }
    }
/*    private depurarContenidoDuplicado(_data: any[]): any[] {

        let found, x, y;
        let oldArray: any[] = [];
        let newArray: any[] = [];

        let data: any[] = [];

        //Se ietra sobre el arreglo que contiene la informacion
        for (x = 0; x < _data.length; x++) {
            
            found = false;
            oldArray[x] = _data[x];
  
            // Por cada valor del arreglo original se itera el contenido del arreglo nuevo
            for (y = 0; y < data.length; y++) {
                
                newArray[y] = data[y];

                // Si el valor de la posicion obtenida en el arreglo original es igual a la del arreglo nuevo se marca una bandera
                if (oldArray[x] === newArray[y]) {
                    found = true;
                    break;
                }
            }

            // Si los valores no son iguales se agrega al nuevo arreglo
            if (!found) {
                data.push(oldArray[x]);
            }
        }

        return data;
    }*/
     // Se valida si un rango(numero) esta entre los rangos que obtiene la consulta, retorna false en caso de que se encuentre una coincidencia
    private validarRangos(_rango: number,_tipoRango: number): boolean {

        let esCreacion: boolean = (_tipoRango === 1) ? this.crearSalarios : this.crearPlazo;
        let listaRangos: any = (_tipoRango === 1) ? this.salariosRegistrados : this.plazosRegistrados ;

        for (var m in listaRangos) {
            if (super.isValid(m)) {

                let rangoMinimo: any = (_tipoRango === 1) ? listaRangos[m].sueldoMin : listaRangos[m].scoreMin;
                let rangoMaximo: any = (_tipoRango === 1) ? listaRangos[m].sueldoMax : listaRangos[m].scoreMax;

                if (_rango === rangoMinimo || _rango === rangoMaximo) {
                    if(esCreacion){
                        return false;
                    }
                }
            }
        }
        return true;
    }
    // se valida si un rango(numero) se encuentra en una posicion dentro del minimo y maximo dados, retorna false en caso de que este dentro de ese rango
    private validarRangosDentro(_rango: number, _tipoRango: number): boolean {

        let esCreacion: boolean = (_tipoRango === 1) ? this.crearSalarios : this.crearPlazo;
        let listaRangos: any = (_tipoRango === 1) ? this.salariosRegistrados : this.plazosRegistrados ;

        for (var m in listaRangos) {
            if (super.isValid(m)) {

                let rangoMinimo: any = (_tipoRango === 1) ? listaRangos[m].sueldoMin : listaRangos[m].scoreMin;
                let rangoMaximo: any = (_tipoRango === 1) ? listaRangos[m].sueldoMax : listaRangos[m].scoreMax;

                if (_rango >= rangoMinimo && _rango <= rangoMaximo) {
                    if(esCreacion){
                        return false;
                    }
                }
            }
        }
        return true;
    }
    // Se valida si un rango(numero) se encuentra fuera del minimo y maximo dados, retorna false en caso de que este fuera de ese rango
    private validarRangosFuera(_rangoA: number, _rangoB: number, _tipoRango: number): boolean {

        let esCreacion: boolean = (_tipoRango === 1) ? this.crearSalarios : this.crearPlazo;
        let listaRangos: any = (_tipoRango === 1) ? this.salariosRegistrados : this.plazosRegistrados ;

        for (var m in listaRangos) {
            if (super.isValid(m)) {

                let rangoMinimo: any = (_tipoRango === 1) ? listaRangos[m].sueldoMin : listaRangos[m].scoreMin;
                let rangoMaximo: any = (_tipoRango === 1) ? listaRangos[m].sueldoMax : listaRangos[m].scoreMax;

                if (_rangoA <= rangoMinimo && _rangoB >= rangoMaximo) {
                    if(esCreacion){
                        return false;
                    }
                }
            }
        }
        return true;
    }
    private setPageFirstPaginator(page: number, rango?: number, total?: number): void {
        if (page < 1 || page > this.paginadorScores.totalPages) {
            return;
        }
        this.paginadorScores = this.paginationFront.getPager(total, page, rango);
        this.scoreInstitucion = this.paginationFront.getPagerdata(this.scores,page);
    }
    private setPageSecondPaginator(page: number, rango?: number, total?: number): void {
        if (page < 1 || page > this.paginadorSalarios.totalPages) {
            return;
        }
        this.paginadorSalarios = this.paginationFront.getPager(total, page, rango);
        this.salariosInstitucion = this.paginationFront.getPagerdata(this.salarios,page);
    }
    /* Consumo de servicios */
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
