import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClassGenerica } from '../../../../../classGeneric/config';
import { Service } from '../../../../../service/service';
import { ValidationModule } from '../../../../../validator/validation.module';
import { ValidationService } from '../../../../../validator/validation.service';
import { Notifications } from '../../../../../classGeneric/notifications';

import * as moment from 'moment';


@Component({
    selector: 'datos-basicos',
    templateUrl: 'datos-basicos.component.html',
    styleUrls: ['../../templates/mantenimiento.component.css']
})

export class DatosBasicosComponent extends ClassGenerica implements OnInit {

    menuLateral: Array<Object>;

    formulario: FormGroup;

    maxFechaNacimiento: any;
    minFechaNacimiento: any;

    maxFechaVigencia: any;
    minFechaVigencia: any;

    entidadValida: Boolean;

    empleado: any;
    /*folioEmp: any;*/
    listaPaisesNac: any;
    listaEntidadesNac: any;
    listaCatNacionalidad: any;
    listaCatCompaniaTelefonica: any;
    datosDocumentos: any;
    listaDocumento: any;
    tipoDocumentos: any;
    bandFolio: boolean;
    bandDoc: boolean;

    constructor(private service: Service, private router: Router, private notifications: Notifications, private formBuilder: FormBuilder) {
        super();
        this.bandDoc = true;

        this.entidadValida = true;

        this.menuNavigation = this.menuNavigation();
        this.menuLateral = this.getMenuLateral(1);

        var fecha = moment().subtract(18, 'years');

        this.maxFechaNacimiento = fecha.format("YYYY-MM-DD");
        this.minFechaNacimiento = moment(new Date(1920, 0, 1)).format("YYYY-MM-DD");

        this.maxFechaVigencia = fecha.format("YYYY-MM-DD");
        this.minFechaVigencia = moment(new Date(1920, 0, 1)).format("YYYY-MM-DD");

        this.listaPaisesNac = [];
        this.listaEntidadesNac = [];

        this.empleado = super.getAttr('cliente');
        this.formulario = this.formBuilder.group({
            'numEmpleado': ['', [Validators.required]],
            'nombre': ['', [Validators.required]],
            'apPaterno': [''],
            'apMaterno': [''],
            'fechaNac': ['', [Validators.required]],
            'paisNac': ['', [Validators.required]],
            'entidadNac': [''],
            'nacionalidad': ['', [Validators.required]],
            'folioID': [null, Validators.compose([Validators.minLength(4), Validators.maxLength(20)])],
            'documento': [null],
            'tipoDocumento': [null],
            'fechaVigencia': [null],
            'curp': ['', Validators.compose([Validators.required, Validators.minLength(17), ValidationService.validarCURP])],
            'rfc': ['', Validators.compose([Validators.required, Validators.minLength(12), ValidationService.validarRFC])],
            'email': [''],
            'telefono': [''],
            'companiaTel': [null],
        });
        this.bandFolio = false;
    }

    ngOnInit() {
        this.consultarPaisNacimiento();
        this.consultarDatosBasicos();
        this.consultarCatalogos();
        this.consultarDocumento();
    }

    consultarCatalogos() {

        let objRequest: any = {};
        let urlRequest: any = "/mantenimiento/catalogos/datos-basicos/consulta";

        this.service.post(objRequest, urlRequest, 3).subscribe(
            data => {

                let object = JSON.parse(JSON.stringify(data));

                console.log(object);

                if (object.codE === 0) {

                    let objResponse: any = object.jsonResultado;

                    if (objResponse !== null) {
                        console.log(objResponse);
                        this.listaCatNacionalidad = objResponse.datosNacionalidad;
                        this.listaCatCompaniaTelefonica = objResponse.datosCompaniaTelefonica;
                        /*this.notifications.success("Exito !!!",object.msgE);*/
                    } else {
                        this.notifications.info("Aviso !!!", "La respuesta fue correcta, pero vacia !!!");
                    }

                } else {
                    this.notifications.info("Aviso !!!", object.msgE);
                }
            },
            error => {
                this.notifications.error("Error !!!", error);
            }
        );
    }

    consultarDatosBasicos() {

        super.loading(true);

        let objRequest: any = { idEmpleado: this.empleado.idEmpleado };
        let urlRequest: any = "/mantenimiento/datosbasicos/consulta";

        this.service.post(objRequest, urlRequest, 3).subscribe(
            data => {

                let object = JSON.parse(JSON.stringify(data));

                console.log(object);

                if (object.codE === 0) {

                    let objResponse: any = object.jsonResultado;
                    if (objResponse !== null && objResponse !== "undefined") {
                        /*this.folioEmp = objResponse[0].folio;*/

                        this.asignarDatosBasicos(objResponse);
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

    consultarPaisNacimiento() {

        super.loading(true);

        let objRequest: any = {};
        let urlRequest: any = "/mantenimiento/catalogos/pais/consulta/nacimiento";

        this.service.post(objRequest, urlRequest, 3).subscribe(
            data => {

                let object = JSON.parse(JSON.stringify(data));

                if (object.codE === 0) {

                    let objResponse: any = object.jsonResultado;

                    if (objResponse !== null && objResponse.length > 0) {

                        this.listaPaisesNac = objResponse;
                        console.log(object);
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

    consultarEntidadNacimiento() {

        let paisNacimiento: any = this.formulario.controls['paisNac'].value;

        console.log("id pais -> ", paisNacimiento);

        if (paisNacimiento === "1" || paisNacimiento === 1) {

            super.loading(true);

            this.entidadValida = true;

            this.formulario.controls['nacionalidad'].setValue(1);

            let objRequest: any = { idPais: paisNacimiento };
            let urlRequest: any = "/mantenimiento/catalogos/estado/consulta/nacimiento";

            this.service.post(objRequest, urlRequest, 3).subscribe(
                data => {

                    let object = JSON.parse(JSON.stringify(data));

                    if (object.codE === 0) {

                        let objResponse: any = object.jsonResultado;

                        if (objResponse !== null && objResponse.length > 0) {

                            this.listaEntidadesNac = objResponse;
                            console.log(object);
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
        } else {
            this.entidadValida = false;
            this.formulario.controls['nacionalidad'].setValue("");
        }
    }

    asignarDatosBasicos(obj: any) {
        let datosEmpleado = obj.listDatosBasicos[0];
        /*if(datosEmpleado.idStatus===802 || datosEmpleado.idStatus===6){
            this.formulario.disable();
        }*/
        this.empleado = obj.listDatosBasicos[0];
        super.saveData(this.empleado, 'cliente');
        this.datosDocumentos = obj.listaInfoDoc;
        let datosDoc = obj.listaInfoDoc[0];
        if (datosEmpleado !== null && datosEmpleado !== undefined) {
            console.log(datosEmpleado);
            this.formulario.controls['numEmpleado'].setValue(datosEmpleado.numEmpleado);
            this.formulario.controls['nombre'].setValue(datosEmpleado.nombreEmpleado);
            if (datosEmpleado.apPaternoEmp === null) {
                this.formulario.controls['apPaterno'].setValue("");
            } else {
                this.formulario.controls['apPaterno'].setValue(datosEmpleado.apPaternoEmp);
            }
            if (datosEmpleado.apMaternoEmp === null) {
                this.formulario.controls['apMaterno'].setValue("");
            } else {
                this.formulario.controls['apMaterno'].setValue(datosEmpleado.apMaternoEmp);
            }
            this.formulario.controls['paisNac'].setValue(datosEmpleado.idPaisNaciEmp);
            this.consultarEntidadNacimiento();
            console.log(this.entidadValida);
            if (this.entidadValida) {
                this.formulario.controls['entidadNac'].setValue(datosEmpleado.idEstadoNaciEmp);
            }

            this.formulario.controls['nacionalidad'].setValue(datosEmpleado.idNacionalidad);

            var fecha = moment(datosEmpleado.fechaNaci, "DD-MM-YYYY").format("YYYY-MM-DD");
            console.log(fecha);

            this.formulario.controls['fechaNac'].setValue(fecha);
            if (datosEmpleado.telefono === " ") {
                this.formulario.controls['telefono'].setValue("");
            } else {
                this.formulario.controls['telefono'].setValue(datosEmpleado.telefono);
            }

            this.formulario.controls['companiaTel'].setValue(datosEmpleado.idCompaniaTel);

            this.formulario.controls['curp'].setValue(datosEmpleado.curpEmpleado);
            this.formulario.controls['rfc'].setValue(datosEmpleado.rfcEmpleado);
        }
    }

    guardarDatosBasicos() {
        let estadoNacimiento = "";
        let vigencia = null;
        let companiaTel = null;
        let idCompaniaTel = null;
        let numeroTel = " ";
        let apMaterno = "";
        let apPaterno = "";
        if (this.formulario.valid) {
            super.loading(true);
            if (this.formulario.controls['entidadNac'].value === "") {
                estadoNacimiento = null;
            } else {
                estadoNacimiento = this.formulario.controls['entidadNac'].value;
            }
            if (this.formulario.controls['fechaVigencia'].value !== null) {
                if (new Date(this.formulario.controls['fechaVigencia'].value) < new Date(this.minFechaVigencia)) {
                    this.formulario.controls['fechaVigencia'].setValue(null);
                    this.notifications.info("Aviso !!!", "Ingrese una fecha de vigencia valida");
                    super.loading(false);
                    return;
                }
                vigencia = moment(this.formulario.controls['fechaVigencia'].value).format('DD-MM-YYYY');
            }
            if (String(this.formulario.controls['companiaTel'].value) !== "0") {
                console.log(this.formulario.controls['companiaTel'].value);
                idCompaniaTel = this.formulario.controls['companiaTel'].value;
            }
            if (this.formulario.controls['telefono'].value !== "") {
                numeroTel = this.formulario.controls['telefono'].value;
            }
            if (this.formulario.controls['apPaterno'].value !== "") {
                apPaterno = this.formulario.controls['apPaterno'].value;
            }
            if (this.formulario.controls['apMaterno'].value !== "") {
                apMaterno = this.formulario.controls['apMaterno'].value;
            }
            if (new Date(this.formulario.controls['fechaNac'].value) < new Date(this.minFechaNacimiento) || new Date(this.formulario.controls['fechaNac'].value) > new Date(this.maxFechaNacimiento)) {
                this.formulario.controls['fechaNac'].setValue(null);
                this.notifications.info("Aviso !!!", "Ingrese una fecha de nacimiento valida");
                super.loading(false);
                return;
            }
            let objRequest: any = {
                idEmpleado: this.empleado.idEmpleado,
                numeroEmpleado: this.formulario.controls['numEmpleado'].value,
                nombre: this.formulario.controls['nombre'].value,
                apellidoPaterno: apPaterno,
                apellidoMaterno: apMaterno,
                fechaNacimiento: moment(this.formulario.controls['fechaNac'].value).format('DD-MM-YYYY'),
                paisNacimiento: this.formulario.controls['paisNac'].value,
                estadoNacimiento: estadoNacimiento,
                nacionalidad: this.formulario.controls['nacionalidad'].value,
                curp: this.formulario.controls['curp'].value,
                rfc: this.formulario.controls['rfc'].value,
                correoElectronico: this.formulario.controls['email'].value,
                celular: numeroTel,
                companiaCelular: idCompaniaTel,
                folioId: this.formulario.controls['folioID'].value,
                idDocumento: this.formulario.controls['tipoDocumento'].value,
                IdTipoDoc: this.formulario.controls['documento'].value,
                vigencia: vigencia
            };

            console.log(objRequest);
            this.empleado.apMaternoEmp = objRequest.apellidoMaterno;
            this.empleado.apPaternoEmp = objRequest.apellidoPaterno;
            this.empleado.nombreEmpleado = objRequest.nombre;
            super.saveData(this.empleado, 'cliente');
            let urlRequest: any = "/mantenimiento/empleado/datosbasicos/actualiza";

            this.service.post(objRequest, urlRequest, 3).subscribe(
                data => {

                    let object = JSON.parse(JSON.stringify(data));
                    console.log(object);
                    if (object.codE === 0) {
                        this.notifications.success("Exito !!!", object.msgE);
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
    consultarDocumento() {
        super.loading(true);

        let objRequest: any = { idDocumento: null };
        let urlRequest: any = "/mantenimiento/catalogos/documentos/consulta";
        this.service.post(objRequest, urlRequest, 3).subscribe(
            data => {

                let object = JSON.parse(JSON.stringify(data));

                if (object.codE === 0) {

                    let objResponse: any = object.jsonResultado;
                    if (objResponse !== null && objResponse.length > 0) {
                        this.listaDocumento = objResponse.Documentos;
                    } else {
                        this.listaDocumento = objResponse.Documentos;
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
    documentos() {
        var id = this.formulario.controls['tipoDocumento'].value;
        console.log(id, "aqui");
        this.formulario.controls['folioID'].setValue(null);
        this.formulario.controls['fechaVigencia'].setValue(null);
        this.formulario.controls['documento'].setValue(null);
        this.tipoDocumentos = [];
        if (id !== "2") {
            this.bandFolio = true;
            this.bandDoc = true;
            if (id === "0") {
                this.bandDoc = false;
                this.bandFolio = false;
                this.formulario.controls['documento'].setValue(null);
            }
        } else {
            this.bandFolio = false;
        }
        this.datosDocumentos.forEach(element => {
            console.log(element.idDocumento);
            if (String(element.idDocumento) === id) {
                this.tipoDocumentos.push(element);
            }
        });
        console.log(this.tipoDocumentos);
        if (this.tipoDocumentos.length === 0 && id !== "0") {
            this.notifications.info("Aviso !!! No contiene datos");
        }
    }
    asignarDatosDocumentos() {

        var id = this.formulario.controls['documento'].value;
        console.log(id);
        this.tipoDocumentos.forEach(element => {
            console.log(element.idTipoDoc);
            if (String(element.idTipoDoc) === id) {
                console.log(element);
                if (id !== "2") {
                    this.formulario.controls['folioID'].setValue(element.folio);
                }
                if (element.vigencia != null) {
                    var fechaVigencia = moment(element.vigencia, '"MMM Do YY"').format("YYYY-MM-DD");
                    console.log(fechaVigencia);
                    this.formulario.controls['fechaVigencia'].setValue(fechaVigencia);
                }
            }
        });
    }

}
