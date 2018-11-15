import { Component, AfterViewInit, ViewChild } from '@angular/core';
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
    selector: 'permisos-roles',
    templateUrl: 'permisos-roles.component.html',
    styleUrls: ['permisos-roles.component.css']
})

export class PermisosRolesComponent extends ClassGenerica implements AfterViewInit {
    @ViewChild('tablausuarios') tablaUsuarios: Ng2Tables;
    public ph: PagesHandler = new PagesHandler();
    public strBusqueda: string = '';
    public Usuarios: Array<Object>;
    menuLateral: Array<Object>;

    urlRequestGeneral: String;
    objRequestGeneral: Object;

    saveItem: Boolean;
    editItem: Boolean;
    displayModal: Boolean;

    formulario: any;

    pager: any = {};
    pagedItems: Array<Object>;

    listaGrupos: any;
    listaRoles: any;
    listaUsuarios: any;
    requestGeneric: any;

    grupoSelected: any;
    rolSelected: any;

    showDialogAlert: Boolean = false;

    listaUsuariosPermisos: Array<Object>;

    constructor(private service: Service, private router: Router, private notifications: Notifications, private formBuilder: FormBuilder, private pagination: PaginationFron) {
        super();
        this.menuLateral = this.getMenuLateral(1);
        this.menuNavigation = this.menuNavigation();

        this.saveItem = false;
        this.editItem = false;
        this.displayModal = false;

        this.listaGrupos = null;
        this.listaRoles = null;
        this.listaUsuarios = null;
        this.requestGeneric = null;

        this.grupoSelected = null;
        this.rolSelected = null;

        this.formulario = this.formBuilder.group({
            'idGrupo': ['', [Validators.required]],
            'idRol': ['', [Validators.required]],
            'idUsuario': ['', [Validators.required]],
            'status': ['']
        });
        this.obtenerListaUsuariosPermisos();
    }

    ngAfterViewInit() {
        // this.obtenerListaUsuariosPermisos();
    }

    private obtenerListaGrupos(): void {

        let urlService: String = "/AsesorBig/api/portal/seguridad/grupos/consulta";

        let objService: any = { idGrupo: null };

        this.service.post(objService, urlService, 1).subscribe(
            data => {

                let object = JSON.parse(JSON.stringify(data));

                if (object.codE === 0 && object.jsonResultado !== null) {
                    this.listaGrupos = object.jsonResultado;
                } else {
                    this.notifications.info("Aviso !!!", object.msgE);
                }
            },
            error => {
                this.notifications.error("Error !!!", error);
            }
        );
    }

    public obtenerListaRoles(): void {

        let idGrupoSelected: any = String(this.formulario.controls['idGrupo'].value);

        let urlService: String = "/AsesorBig/api/portal/seguridad/roles/consulta";

        let objService: any = { idGrupo: (idGrupoSelected !== "") ? idGrupoSelected : null, idRol: null };

        this.service.post(objService, urlService, 1).subscribe(
            data => {

                let object = JSON.parse(JSON.stringify(data));

                if (object.codE === 0 && object.jsonResultado !== null) {

                    if (!this.editItem) {
                        this.formulario.controls['idRol'].enable();
                    }

                    this.listaRoles = object.jsonResultado;
                } else {
                    this.notifications.info("Aviso !!!", object.msgE);
                }
            },
            error => {
                this.notifications.error("Error !!!", error);
            }
        );
    }

    public obtenerListaUsuarios(): void {

        let urlService: String = "/AsesorBig/api/portal/seguridad/usuarios/consulta";

        let objService: any = { idUsuario: null };

        this.service.post(objService, urlService, 1).subscribe(
            data => {

                let object = JSON.parse(JSON.stringify(data));

                if (object.codE === 0 && object.jsonResultado !== null) {
                    if (!this.editItem) {
                        this.formulario.controls['idUsuario'].enable();
                    }

                    this.listaUsuarios = object.jsonResultado;
                } else {
                    this.notifications.info("Aviso !!!", object.msgE);
                }
            },
            error => {
                this.notifications.error("Error !!!", error);
            }
        );
    }

	/*private obtenerListaCatalogos(request: any, url: String): void {

		this.service.post(request, url, 1).subscribe(
            data => {

                let object = JSON.parse(JSON.stringify(data));

                if (object.codE === 0 && object.jsonResultado !== null) {
                    this.requestGeneric = object.jsonResultado;
                }else {
					this.notifications.info("Aviso !!!",object.msgE);
				}
            },
            error => {
                this.notifications.error("Error !!!",error);
            }
        );
	}*/

    private obtenerListaUsuariosPermisos(): void {

        super.loading(true);

        this.urlRequestGeneral = "/AsesorBig/api/portal/seguridad/permisos/consulta";

        this.objRequestGeneral = {
            idGrupo: null,
            idRol: null,
            idUsuario: null
        };

        this.service.post(this.objRequestGeneral, this.urlRequestGeneral, 1).subscribe(
            successRes => {
                let responseObj = JSON.parse(JSON.stringify(successRes));
                if (responseObj.codE === 0 && responseObj.jsonResultado !== null) {

                    //this.tablaUsuarios.SetTabla(new ConfigNgTable2(responseObj.jsonResultado.length, 10));
                    this.listaUsuariosPermisos = responseObj.jsonResultado;
                    this.FiltrarUsuarios('');
                    //this.pager = this.pagination.getPager(responseObj.jsonResultado.length, 1, 50);
                    //this.pagedItems = this.pagination.getPagerdata(responseObj.jsonResultado);
                } else {
                    this.notifications.info("Aviso !!!", responseObj.msgE);
                }
            },
            failureRes => {
                this.notifications.error("Error !!!", failureRes);
            },
            () => super.loading(false)
        );
    }

    public FiltrarUsuarios(_str: string): void {
        this.Usuarios = new FilterTable().transform(this.listaUsuariosPermisos, _str);
        this.tablaUsuarios.SetTabla(new ConfigNgTable2(this.Usuarios.length, 10));
    }

    public ActualizarTabla(_config: any): void {
        this.ph = _config;
    }

    private lanzarPeticionHttpGeneral(request: any, url: String): void {

        super.loading(true);
        this.displayModal = false;

        this.service.post(request, url, 1).subscribe(
            data => {

                let object = JSON.parse(JSON.stringify(data));

                if (object.codE === 0) {
                    this.obtenerListaUsuariosPermisos();
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

    public mostrarFormularioModal(): void {

        this.displayModal = true;
        this.saveItem = true;
        this.editItem = false;

        this.formulario.controls['idGrupo'].setValue('');
        this.formulario.controls['idRol'].setValue('');
        this.formulario.controls['idUsuario'].setValue('');
        this.formulario.controls['status'].setValue('');

        this.obtenerListaGrupos();
        this.formulario.controls['idGrupo'].enable();
        this.formulario.controls['idRol'].disable();
        this.formulario.controls['idUsuario'].disable();
    }

    public mostrarDetalleModal(usuario: any): void {

        this.displayModal = true;
        this.saveItem = false;
        this.editItem = true;

        this.obtenerListaUsuarios();
        this.obtenerListaGrupos();
        this.obtenerListaRoles();

        this.grupoSelected = usuario.idGrupo;
        this.rolSelected = usuario.idRol;

        this.formulario.controls['idGrupo'].setValue(String(usuario.idGrupo));
        this.formulario.controls['idRol'].setValue(String(usuario.idRol));
        this.formulario.controls['idUsuario'].setValue(String(usuario.usuario));
        this.formulario.controls['status'].setValue(String(usuario.status));

        this.formulario.controls['idGrupo'].disable();
        this.formulario.controls['idRol'].disable();
        this.formulario.controls['idUsuario'].disable();
    }

    public saveForm(): void {

        if (this.formulario.valid) {

            this.formulario.controls['idGrupo'].enable();
            this.formulario.controls['idRol'].enable();
            this.formulario.controls['idUsuario'].enable();
            this.urlRequestGeneral = this.saveItem ? "/AsesorBig/api/portal/seguridad/permisos/alta" : "/AsesorBig/api/portal/seguridad/permisos/actualiza";

            this.lanzarPeticionHttpGeneral(this.formulario.value, this.urlRequestGeneral);
        }
    }

    public deleteForm(): void {

        this.urlRequestGeneral = "/AsesorBig/api/portal/seguridad/permisos/baja";

        this.formulario.controls['idGrupo'].enable();
        this.formulario.controls['idRol'].enable();
        this.formulario.controls['idUsuario'].enable();

        this.objRequestGeneral = {
            idGrupo: String(this.formulario.controls['idGrupo'].value),
            idRol: String(this.formulario.controls['idRol'].value),
            idUsuario: String(this.formulario.controls['idUsuario'].value)
        };

        this.lanzarPeticionHttpGeneral(this.objRequestGeneral, this.urlRequestGeneral);
    }

    setPage(page: number, rango?: number, total?: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagination.getPager(total, page, rango);
        this.pagedItems = this.pagination.getPagerdata([], page);
    }

}
