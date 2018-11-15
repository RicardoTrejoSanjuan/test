import { Component, OnInit } from '@angular/core';
import { Service } from '../../service/service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ClassGenerica } from '../../classGeneric/config';
import {ValidationModule} from '../../validator/validation.module';
import {ValidationService} from '../../validator/validation.service';
import { Notifications} from '../../classGeneric/notifications';
@Component({
    selector: 'infinite',
    templateUrl: 'templates/infinite-datos.component.html',
    styleUrls: ['templates/infinite.component.css']
})

export class InfiniteDatosComponent extends ClassGenerica {
    arrCuentas: any[];
    path: string;
    dataService: Object;
    arrayServicios: Object[];
    tipoTarjeta: String;
    datosForm: any;
    dataModal:any;
    showDialog : boolean;
    showDialogError:boolean;
    nombreCuenta: String;
    msj:String;
    showTable:boolean;
    constructor(private service: Service, private router: Router, private formBuilder: FormBuilder,  private notifications: Notifications) {
        super();
        console.log("entro al constructor");
        console.log(super.getObjectDos());
        this.showDialogError=false;
        this.deletegetObject(false);
        this.tipoTarjeta="";
        this.menuNavigation = this.menuNavigation();
        this.showTable=false;
        this.datosForm = this.formBuilder.group({
            'tarjeta': ['', Validators.required],
            'cuenta': ['', Validators.required],
            
        });
        if(super.getObjectDos()!==null){
            this.arrayServicios=super.getObjectDos().arrayServicios;
            this.nombreCuenta=super.getObjectDos().cuenta;
            this.tipoTarjeta=super.getObjectDos().tipoTarjeta;
            this.showTable=true;
        }else{
            this.arrayServicios=null;
        }
    }


    buscar(nombreCuenta, tipoTarjeta) {
        if (nombreCuenta !== "" && nombreCuenta!==undefined) {
            super.loading(true);
            if(tipoTarjeta===""){
                tipoTarjeta=null;
            }
            this.dataService = {
                "tipoTarjeta": tipoTarjeta,
                "nombreCuenta": nombreCuenta
            };
            console.log("datos que se envian");
            console.log(this.dataService);
            this.path = '/AsesorBig/api/infinite/consulta/datos';
            this.service.post(this.dataService, this.path, 1).subscribe(
                data => {
                    let object = JSON.parse(JSON.stringify(data));
                    if (object.codE === 0) {
                        if(object.jsonResultado.length>0){
                            this.arrayServicios = object.jsonResultado;
                            let objStorage={
                                arrayServicios:this.arrayServicios,
                                tipoTarjeta:this.tipoTarjeta,
                                cuenta:nombreCuenta
                            };
                            this.showTable=true;
                            sessionStorage.setItem("getObjectDos", super.encryptAESLocal(objStorage)); 
                        }else{  
                            this.showTable=false;
                            this.deletegetObject2(false);
                            this.notifications.error("Aviso", "No se encontraron datos relacionados");
                        }
                    } else {
                        this.notifications.error(object.codE+" "+object.msgE);
                        console.log(object);
                    }
                },
                error => {
                    console.log("error callback");
                },
                () => super.loading(false)
            );
        }else{
            this.notifications.error("Ingrese el nombre, cuenta o número de tarjeta");
        }

    }

    Movimientos(params) {
        console.log("funcion movimientos");
        console.log(params);
        sessionStorage.setItem('getObject',super.encryptAESLocal(params));
        this.router.navigate(['./infinite/movimientos']);
    }



    Saldo(params) {
        console.log("datos que se reciben");
        console.log(params);
        super.loading(true);
        this.dataService={
              "numeroTarjeta": params.finoplasticoasignado
        };
        this.path = '/AsesorBig/api/infinite/consulta/saldo';
        this.service.post(this.dataService, this.path, 1).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                if (object.codE === 0) {
                    let aux= object.jsonResultado;
                    if(params.fc_NOMBRE_EMPLEADO!==null){
                        aux.nombre=params.fc_NOMBRE_EMPLEADO+" ";
                    }
                    if(params.fc_APELLIDO_PAT_EMPLEADO!==null){
                        aux.nombre+=params.fc_APELLIDO_PAT_EMPLEADO+" ";
                    }
                    if(params.fc_APELLIDO_MAT_EMPLEADO!==null){
                        aux.nombre+=params.fc_APELLIDO_MAT_EMPLEADO;
                    }
                    // aux.nombre=params.fc_NOMBRE_EMPLEADO+" "+params.fc_APELLIDO_PAT_EMPLEADO+" "+params.fc_APELLIDO_MAT_EMPLEADO;
                    aux.cu=params.fi_FOLIO_CU;
                    aux.cuenta=params.fc_NUMERO_CUENTA;
                    this.dataModal=aux;
                     this.showDialog = true;
                    console.log(this.dataModal);
                } else {
                    this.notifications.error(object.msgE);
                }
            },
            error => {
                this.notifications.error("Error en el callback");
                console.log("error callback");
            },
            () => super.loading(false)
        );
    }
}


