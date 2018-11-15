import { Component, AfterViewInit, ViewChild } from '@angular/core';

import * as moment from 'moment';

import { Router } from '@angular/router';

import { Service } from '../../../service/service';

import { ClassGenerica } from '../../../classGeneric/config';

import { Notifications } from '../../../classGeneric/notifications';

import { PaginationFron } from '../../../classGeneric/paginationFront';

import { ValidationService } from '../../../validator/validation.service';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Ng2Tables } from '../../../ng2-tables/ng2-tables.component';

import { ConfigNgTable2, PagesHandler } from '../../../ng2-tables/ng2-tables';

import { FilterTable } from '../../../pipes/pipes-portal';


@Component({
    selector: 'usuarios-crud',
    templateUrl: 'usuarios-crud.component.html',
    styleUrls: ['usuarios-crud.component.css']
})

export class UsuariosComponent extends ClassGenerica implements AfterViewInit {

    @ViewChild('tablausuarios') tablaUsuarios: Ng2Tables;
    public ph: PagesHandler = new PagesHandler();
    public strBusqueda: string = '';
    menuLateral: Array<Object>;

    showDialogAlert: Boolean = false;

    urlRequestGeneral: String;
    objRequestGeneral: Object;

    pager: any = {};
    pagedItems: Array<Object>;

    listaUsuarios: Array<Object>;
    public Usuarios: Array<Object>;

    saveItem: Boolean;
    editItem: Boolean;
    displayModal: Boolean;

    formulario: any;

    fechaActual: any;

    constructor(private service: Service, private router: Router, private notifications: Notifications, private formBuilder: FormBuilder, private pagination: PaginationFron) {
        super();
        this.menuLateral = this.getMenuLateral(1);
        this.menuNavigation = this.menuNavigation();

        this.saveItem = false;
        this.editItem = false;
        this.displayModal = false;

        this.fechaActual = moment().subtract(1, 'day').format("YYYY-MM-DD");


        this.objRequestGeneral = {
            idUsuario: null,
            nombre: null,
            paterno: null,
            materno: null,
            fechaAlta: null,
            status: null
        };

        this.formulario = this.formBuilder.group({
            'idUsuario': ['', [Validators.required, ValidationService.validarNumeros]],
            'nombre': ['', [Validators.required]],
            'paterno': ['', [Validators.required]],
            'materno': ['', [Validators.required]],
            'status': ['', [Validators.required]],
            'fechaAlta': ['']
        });

        this.obtenerListaUsuarios();

    }

    ngAfterViewInit() {
        // this.obtenerListaUsuarios();
    }

    private lanzarPeticionHttpGeneral(request: any, url: String): void {

        super.loading(true);
        this.displayModal = false;

        console.log("Cuerpo peticion -> ", request);

        this.service.post(request, url, 1).subscribe(
            data => {

                let object = JSON.parse(JSON.stringify(data));

                if (object.codE === 0) {
                    this.obtenerListaUsuarios();
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

    private obtenerListaUsuarios(): void {
        super.loading(true);

        this.urlRequestGeneral = "/AsesorBig/api/portal/seguridad/usuarios/consulta";

        let _requestGeneral: any = this.objRequestGeneral;
        _requestGeneral.idUsuario = null;

        this.service.post(_requestGeneral, this.urlRequestGeneral, 1).subscribe(
            successResponse => {

                let response = JSON.parse(JSON.stringify(successResponse));

                if (response.codE === 0 && response.jsonResultado != null) {
                    console.log(response);
                    this.listaUsuarios = response.jsonResultado;
                    this.FiltrarUsuarios('');
                } else {
                    this.notifications.info("Aviso !!!", response.msgE);
                }
            },
            failureResponse => {
                this.notifications.error("Error !!!", failureResponse);
            },
            () => super.loading(false)
        );
    }

    public FiltrarUsuarios(_str: string): void {
        this.Usuarios = new FilterTable().transform(this.listaUsuarios, _str);
        this.tablaUsuarios.SetTabla(new ConfigNgTable2(this.Usuarios.length, 10));
    }

    public ActualizarTabla(_config: any): void {
        this.ph = _config;
    }

    public mostrarFormularioModal(): void {

        this.displayModal = true;
        this.saveItem = true;
        this.editItem = false;

        this.formulario.controls['idUsuario'].setValue('');
        this.formulario.controls['nombre'].setValue('');
        this.formulario.controls['paterno'].setValue('');
        this.formulario.controls['materno'].setValue('');
        this.formulario.controls['status'].setValue('');
        this.formulario.controls['fechaAlta'].setValue(this.fechaActual);
    }

    public mostrarDetalleModal(usuario: any): void {

        this.displayModal = true;
        this.saveItem = false;
        this.editItem = true;

        this.formulario.controls['idUsuario'].setValue(String(usuario.idUsuario));
        this.formulario.controls['nombre'].setValue(String(usuario.nombre));
        this.formulario.controls['paterno'].setValue(String(usuario.paterno));
        this.formulario.controls['materno'].setValue(String(usuario.materno));
        this.formulario.controls['status'].setValue(String(usuario.status));
        this.formulario.controls['fechaAlta'].setValue(this.fechaActual);
    }

    public saveForm(): void {

        if (this.formulario.valid) {
            this.urlRequestGeneral = this.saveItem ? "/AsesorBig/api/portal/seguridad/usuarios/alta" : "/AsesorBig/api/portal/seguridad/usuarios/actualiza";
            this.lanzarPeticionHttpGeneral(this.formulario.value, this.urlRequestGeneral);
        }
    }

    public deleteForm(): void {

        let objectReq: any = this.objRequestGeneral;
        this.urlRequestGeneral = "/AsesorBig/api/portal/seguridad/usuarios/baja";
        objectReq.idUsuario = String(this.formulario.controls['idUsuario'].value);
        this.lanzarPeticionHttpGeneral(objectReq, this.urlRequestGeneral);
    }

    setPage(page: number, rango?: number, total?: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagination.getPager(total, page, rango);
        this.pagedItems = this.pagination.getPagerdata([], page);
    }
}
