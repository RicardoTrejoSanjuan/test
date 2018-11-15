import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClassGenerica } from '../../../../../classGeneric/config';
import { Service } from '../../../../../service/service';
import { ValidationModule } from '../../../../../validator/validation.module';
import { ValidationService } from '../../../../../validator/validation.service';
import { Notifications } from '../../../../../classGeneric/notifications';
import * as moment from 'moment';
import { PaginationFron } from '../../../../../classGeneric/paginationFront';

@Component({
    selector: 'dispersiones',
    templateUrl: 'dispersiones.component.html',
    styleUrls: [
        '../../../mantenimiento-instituciones/instituciones.component.css',
        '../../../../mesa-control/mesa-control.component.css']
})

export class DispersionesComponent extends ClassGenerica implements OnInit {

    menuLateral: Array<Object>;
    dispersiones: any;
    formulario: FormGroup;
    modalFormulario: boolean;
    empleado: any;
    institucion: any;
    cuentas: any;
    maxFecha: any;
    pager: any = {};
    pagedItems: any[];
    range: any;
    minFecha:any;
    constructor(private service: Service, private router: Router, private notifications: Notifications, private formBiulder: FormBuilder, private paginationfron: PaginationFron) {
        super();
        var fecha = moment();
        this.maxFecha = new Date(fecha.format("YYYY-MM-DD"));
        console.log(this.maxFecha);
        this.maxFecha.setDate(this.maxFecha.getDate()+2);
        console.log(this.maxFecha);
        this.empleado = super.getAttr('cliente');
        this.institucion = super.getAttr('institucion');
        this.menuNavigation = this.menuNavigation();
        this.menuLateral = this.getMenuLateral(1);
        this.modalFormulario = false;
        this.formulario = this.formBiulder.group({
            'cuentaDis': ['', [Validators.required]],
            'importeDis': ['', [Validators.required]],
            'fecha': ['', [Validators.required]],
            'referenciaDis': ['', [Validators.required]]
        });
        this.range="";
    }

    ngOnInit() {
        this.consultarDispersiones();
        this.consultarCuenta();
    }

    guardarDispersion() {
        if (this.formulario.valid) {
            let importe=this.formulario.controls['importeDis'].value;
            /*if (importe.indexOf(".")!== -1) {
                let decimal = importe.split(".");
                importe=importe.replace(".", "");
                if(decimal[1].length===1){
                    importe=importe+"0";
                }
            } else {
                importe=importe+"00";
            }*/
            super.loading(true);
            var fecha = moment(this.formulario.controls['fecha'].value).format("DD-MM-YYYY");
            var fechaEnviar: any;
            let objRequest: any = {
                idInstitucion: this.institucion.idInst,
                idPais: this.institucion.idPais,
                cuentaCargo: this.formulario.controls['cuentaDis'].value,
                empleado: this.empleado.idEmpleado,
                fechaAplicacion: fecha,
                importe: importe,
                leyenda: this.formulario.controls['referenciaDis'].value
            };
            console.log(objRequest);
            let urlRequest: any = "/mantenimiento/dispersiones/dispersion/inserta";

            this.service.post(objRequest, urlRequest, 3).subscribe(
                data => {

                    let object = JSON.parse(JSON.stringify(data));

                    if (object.codE === 0) {

                        let objResponse: any = object.jsonResultado;

                        if (objResponse !== null && objResponse.length > 0) {

                            console.log(object);
                            
                            //this.asignarDatosHogar(objResponse[0]);
                            //this.notifications.success("Exito !!!",object.msgE);
                        } else {
                            this.consultarDispersiones();
                            this.notifications.info("Aviso !!!", object.msgE);
                            console.log(object);
                        }

                    } else {
                        this.notifications.info("Aviso !!!", object.msgE);
                        console.log(object);
                    }
                    this.formulario = this.formBiulder.group({
                        'cuentaDis': ['', [Validators.required]],
                        'importeDis': ['', [Validators.required]],
                        'fecha': ['', [Validators.required]],
                        'referenciaDis': ['', [Validators.required]]
                    });
                },
                error => {
                    this.notifications.error("Error !!!", error);
                },
                () => super.loading(false)
            );

        }
        this.closeForm();
        
        this.consultarDispersiones();

    }

    private Regresar() {
        this.router.navigate(['./dashboard']);
    }

    openForm() {
        this.formulario = this.formBiulder.group({
            'cuentaDis': ['', [Validators.required]],
            'importeDis': ['', [Validators.required]],
            'fecha': ['', [Validators.required]],
            'referenciaDis': ['', [Validators.required]]
        });
        this.modalFormulario = true;
    }
    closeForm() {
        this.range="";
        this.modalFormulario = false;
    }
    
    consultarDispersiones() {

        super.loading(true);

        let objRequest: any = {
            idInstitucion: this.institucion.idInst,
            empleado: this.empleado.idEmpleado
        };
        let urlRequest: any = "/mantenimiento/dispersiones/dispersion/consulta";

        this.service.post(objRequest, urlRequest, 3).subscribe(
            data => {

                let object = JSON.parse(JSON.stringify(data));

                if (object.codE === 0) {

                    let objResponse: any = object.jsonResultado;

                    if (objResponse !== null && objResponse.length > 0) {

                        console.log(object);
                        this.pager = this.paginationfron.getPager(object.jsonResultado.length, 1, 50);
                        this.pagedItems = this.paginationfron.getPagerdata(object.jsonResultado);
                        this.dispersiones = object.jsonResultado;
                        //this.asignarDatosHogar(objResponse[0]);
                        //this.notifications.success("Exito !!!",object.msgE);
                    } else {
                        this.notifications.info("Aviso !!!", "La respuesta fue correcta, pero vacia !!!");
                    }

                } else {
                    this.notifications.info("Aviso !!!", object.msgE);
                }
            },
            error => {
                this.notifications.error("Error !!!", error);
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
    consultarCuenta() {
        super.loading(true);

        let objRequest: any = {
            idInstitucion: this.institucion.idInst,
            idPais: this.institucion.idPais
        };
        let urlRequest: any = "/mantenimiento/dispersiones/cuenta/consulta";

        this.service.post(objRequest, urlRequest, 3).subscribe(
            data => {

                let object = JSON.parse(JSON.stringify(data));

                if (object.codE === 0) {

                    let objResponse: any = object.jsonResultado;

                    if (objResponse !== null && objResponse.length > 0) {

                        console.log(object);
                        this.cuentas = object.jsonResultado;
                        //this.asignarDatosHogar(objResponse[0]);
                        //this.notifications.success("Exito !!!",object.msgE);
                    } else {
                        this.notifications.info("Aviso !!!", "La respuesta fue correcta, pero vacia !!!");
                    }

                } else {
                    this.notifications.info("Aviso !!!", object.msgE);
                }
            },
            error => {
                this.notifications.error("Error !!!", error);
            },
            () => super.loading(false)
        );

    }
    decimal(event){
        let tecla = (document.all) ? event.keyCode : event.which;
        let patron = /[0-9]/;
        console.log(tecla);
        if( tecla === 8 || tecla === 46 ) {
            this.range=this.range.substr(0,this.range.length-1);
            if (this.range===0) {
                console.log("tecla");
                this.range="";
            }
        }else{
            if ((patron.test(String.fromCharCode(tecla))) || (tecla >= 96 && tecla <= 105) ) {
                this.range=this.range+event.target.value.substr(event.target.value.length-1);
            }
        }
        console.log(this.range);
        let decimal=this.range*.01;
        let decimal2=decimal.toFixed(2);
        this.formulario.controls['importeDis'].setValue(decimal2);
    }
    dispersionEliminar(disp){
        console.log(disp);
        super.loading(true);
        
        let objRequest: any = {
            seqDispersion: disp.seqDispersion,
            idDispersion: disp.idDispersion
        };
        let urlRequest: any = "/mantenimiento/dispersiones/elimina";

        this.service.post(objRequest, urlRequest, 3).subscribe(
            data => {

                let object = JSON.parse(JSON.stringify(data));

                if (object.codE === 0) {

                    let objResponse: any = object.jsonResultado;

                    if (objResponse !== null && objResponse.length > 0) {
                        this.consultarDispersiones();
                    } else {
                        this.notifications.info("Aviso !!!", object.msgE);
                        this.consultarDispersiones();
                    }

                } else {
                    this.notifications.info("Aviso !!!", object.msgE);
                }
            },
            error => {
                this.notifications.error("Error !!!", error);
            },
            () => super.loading(false)
        );
    }

}
