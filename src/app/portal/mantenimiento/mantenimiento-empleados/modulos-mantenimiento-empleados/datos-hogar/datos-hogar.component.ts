import { Component, OnInit } from '@angular/core';
import { Service } from '../../../../../service/service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ClassGenerica } from '../../../../../classGeneric/config';
import {ValidationModule} from '../../../../../validator/validation.module';
import {ValidationService} from '../../../../../validator/validation.service';
import { Notifications} from '../../../../../classGeneric/notifications';
import { DirectivesModule } from '../../../../../directives/directive.module';
import { Pipe, PipeTransform } from '@angular/core';
@Component({
    selector: 'mantenimiento',
    templateUrl: 'datos-hogar.component.html',
    styleUrls: ['../../templates/mantenimiento.component.css']
})

export class DatosHogarComponent extends ClassGenerica implements OnInit {
    private childrenEmpleados: Object[];
    menuLateral: Array<Object>;
    paises: any;
    pais: any;
    estados: any;
    estado: any;
    municipios:any;
    municipio: any;
    colonias: any;
    viviendas:any;
    formulario: FormGroup;
    empleado:any;
    codigo: boolean;
    codigoPostal: any;
    datosEntrantes: any;
    band:boolean;
    constructor( private router: Router,private notifications: Notifications,private service: Service,private formBuilder: FormBuilder){
        super();
        this.pais="1";
        this.menuLateral = this.getMenuLateral(1);
        this.menuNavigation = this.menuNavigation();
        console.log(this.menuLateral);
        this.paises=[{idPais:1, nombre:"MEXICO"}];
        this.empleado=super.getAttr('cliente');
        this.consultarVienda();
        this.consultarDatosHogar();
        this.band=true;
        this.formulario = this.formBuilder.group({
            'codigoPostal': ['',Validators.compose([Validators.required,ValidationService.validarNumeros,Validators.minLength(5)])],
            'pais': ['',[Validators.required]],
            'estado': ['',[Validators.required]],
            'delmun': ['',[Validators.required]],
            'colonia': ['',[Validators.required]],
            'calle': ['',[Validators.required]],
            'numExt': ['',[Validators.required]],
            'numInt': [null],
            'tipoVivienda': ['',[Validators.required]],
        });
        this.codigo=false;
        
        
    }

    ngOnInit() {
        console.log(this.empleado);
        
    }

    consultarDatosHogar() {

        super.loading(true);

        let objRequest: any = {idEmpleado: this.empleado.idEmpleado};
        let urlRequest: any = "/mantenimiento/datoshogar/consulta";
        
        this.service.post(objRequest, urlRequest, 3).subscribe(
            data => {

                let object = JSON.parse(JSON.stringify(data));

                if (object.codE === 0) {

                    let objResponse: any = object.jsonResultado;
                    
                    if(objResponse !== null && objResponse.length > 0) {

                        console.log(object);
                        this.datosEntrantes=objResponse[0];
                        this.formulario.controls['codigoPostal'].setValue(this.datosEntrantes.codPostal);
                        this.consultarCP();
                        
                        //this.notifications.success("Exito !!!",object.msgE);
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
    asignarDatosHogar() {
        var obj=this.datosEntrantes;

        if(obj !== null) {
            console.log(obj,"entra");
            this.formulario.controls['codigoPostal'].setValue(obj.codPostal);
            this.formulario.controls['pais'].setValue(obj.idPais);
            this.formulario.controls['estado'].setValue(obj.idEstado);
            this.formulario.controls['colonia'].setValue(obj.colonia);
            this.formulario.controls['calle'].setValue(obj.calle);
            this.formulario.controls['delmun'].setValue(obj.idMunicipio);
            this.formulario.controls['numExt'].setValue(obj.numExt);
            this.formulario.controls['numInt'].setValue(obj.numInt);
            this.formulario.controls['tipoVivienda'].setValue(obj.idTipoVivienda);
        }

        this.datosEntrantes=null;

        if (this.formulario.controls['pais'].value!=='') {
            this.consultarEstado();
        }
    }

    guardarDatosHogar() {
        if(this.formulario.valid) {
            this.municipios.forEach(element => {
                if (element.poblacionID===String(this.formulario.controls['delmun'].value)) {
                    this.municipios=[element];
                }
            });
            let _numInt="S/N";
            if (this.formulario.controls['numInt'].value!=="" && this.formulario.controls['numInt'].value!==null ) {
                console.log(this.formulario.controls['numInt'].value);
                _numInt=this.formulario.controls['numInt'].value;
            }
            super.loading(true);
            console.log(this.estados);
            var request={   idEmpleado: this.empleado.idEmpleado,
                            codigoPostal: this.formulario.controls['codigoPostal'].value,
                            pais: "MEXICO",
                            idPais: this.formulario.controls['pais'].value,
                            estado: this.estados[0].descEdo,
                            idEstado: this.formulario.controls['estado'].value,
                            municipio: this.municipios[0].descPoblacion,
                            idMunicipio: this.formulario.controls['delmun'].value,
                            colonia: this.formulario.controls['colonia'].value,
                            calle: this.formulario.controls['calle'].value,
                            numeroExterior: this.formulario.controls['numExt'].value,
                            numeroInterior: _numInt,
                            idTipoCasa: this.formulario.controls['tipoVivienda'].value
                        };
                        console.log(request);
            let urlRequest: any = "/mantenimiento/empleado/datoshogar/actualiza";
        
            this.service.post(request, urlRequest, 3).subscribe(
                data => {

                    let object = JSON.parse(JSON.stringify(data));

                    if (object.codE === 0) {

                        let objResponse: any = object.jsonResultado;
                        
                        if(objResponse !== null && objResponse.length > 0) {

                            console.log(object);
                            //this.notifications.success("Exito !!!",object.msgE);
                        } else {
                            console.log(object,"Hogar");
                            this.notifications.info("Aviso !!!",object.msgE);
                        }
                        
                    }else {
                        this.notifications.info("Aviso !!!",object.msgE);
                        console.log(object.msgE);
                    }
                },
                error => {
                    this.notifications.error("Error !!!",error);
                },
                () => super.loading(false)
            );            
        }
    }

    consultarVienda(){
        super.loading(true);

        let objRequest: any = {};
        let urlRequest: any = "/mantenimiento/catalogos/tipo-vivienda/consulta";
        
        this.service.post(objRequest, urlRequest, 3).subscribe(
            data => {

                let object = JSON.parse(JSON.stringify(data));

                if (object.codE === 0) {

                    let objResponse: any = object.jsonResultado;
                    
                    if(objResponse !== null && objResponse.length > 0) {

                        console.log(object,"vivienda");
                        this.viviendas=objResponse;
                    } else {
                        console.log(object);
                        this.notifications.info("Aviso !!!",object.msgE);
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
    
    consultarCP(){
        if (this.formulario.controls['codigoPostal'].value.length < 5) {
            this.band=true;
            console.log("entra");
        }
        console.log(this.formulario.controls['codigoPostal'].value);
        
        if (this.formulario.controls['codigoPostal'].value.length > 4 && this.band===true) {
            super.loading(true);
            this.band=false;
            let objRequest: any = { cp: this.formulario.controls['codigoPostal'].value };
            let urlRequest: any = "/direccion/codigopostal/consulta";
            //console.log(this.band);
            this.service.post(objRequest, urlRequest, 3).subscribe(
                data => {

                    let object = JSON.parse(JSON.stringify(data));
                    console.log(object);
                    if (object.codE === 0) {

                        let objResponse: any = object.jsonResultado;
                        
                        if(objResponse !== null && objResponse.length > 0) {
                            this.codigoPostal=objResponse;
                            this.asignarDatosHogar();
                        } else {
                            console.log(object);
                            this.formulario = this.formBuilder.group({
                            'codigoPostal': ['',Validators.compose([Validators.required,ValidationService.validarNumeros,Validators.minLength(5)])],
                            'pais': ['',[Validators.required]],
                            'estado': ['',[Validators.required]],
                            'delmun': ['',[Validators.required]],
                            'colonia': ['',[Validators.required]],
                            'calle': ['',[Validators.required]],
                            'numExt': ['',[Validators.required]],
                            'numInt': ['',[Validators.required]],
                            'tipoVivienda': ['',[Validators.required]],
                        });
                            this.notifications.info("Aviso !!!",object.msgE);
                        }
                        
                    }else {
                        console.log(object);
                        this.formulario = this.formBuilder.group({
                            'codigoPostal': ['',Validators.compose([Validators.required,ValidationService.validarNumeros,Validators.minLength(5)])],
                            'pais': ['',[Validators.required]],
                            'estado': ['',[Validators.required]],
                            'delmun': ['',[Validators.required]],
                            'colonia': ['',[Validators.required]],
                            'calle': ['',[Validators.required]],
                            'numExt': ['',[Validators.required]],
                            'numInt': ['',[Validators.required]],
                            'tipoVivienda': ['',[Validators.required]],
                        });
                        this.notifications.info("Aviso !!!",object.msgE);
                    }
                },
                error => {
                    this.notifications.error("Error !!!",error);
                },
                () => super.loading(false)
            );
        }
    }
    consultarEstado(){
        var estados=this.codigoPostal.filter( myObj => String(myObj.paisID) === "1");
        console.log("Estados 1: ",estados);
        this.estados=this.arregloEstadosUnico(estados);
        console.log("Estados 2: ",this.estados);
        if(this.formulario.controls['estado'].value !== ''){
            this.estados.forEach(element => {
                if (String(element.edoID) === String(this.formulario.controls['estado'].value)) {
                    this.estados=[element];
                }
            });
            this.consultarMunicipio();
        }
    }
    consultarMunicipio(){
        var municipios=this.codigoPostal.filter( myObj => String(myObj.edoID) === String(this.formulario.controls['estado'].value));
        console.log("Municipios 1: ",municipios);
        this.municipios=this.arregloMunicipiosUnico(municipios);
        console.log("Municipios 2: ",this.municipios);
        this.consultarColonia(true);
    }
    consultarColonia(val){
        if (!val) {
            this.formulario.controls['colonia'].setValue("");
        }
        this.colonias=this.codigoPostal.filter( myObj => String(myObj.descColonia).indexOf(this.formulario.controls['colonia'].value) !== -1);
        console.log("Colonias: ",this.colonias);
        
    }
    arregloEstadosUnico(origArr) {
        var newArr = [],
            origLen = origArr.length,
            found, x, y;
        for (x = 0; x < origLen; x++) {
            found = undefined;
            for (y = 0; y < newArr.length; y++) {
                if (origArr[x].edoID === newArr[y].edoID) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                newArr.push(origArr[x]);
            }
        }
        return newArr;
    }
    arregloMunicipiosUnico(origArr) {
        var newArr = [],
            origLen = origArr.length,
            found, x, y;
        for (x = 0; x < origLen; x++) {
            found = undefined;
            for (y = 0; y < newArr.length; y++) {
                if (origArr[x].poblacionID === newArr[y].poblacionID) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                newArr.push(origArr[x]);
            }
        }
        return newArr;
    }
    
}