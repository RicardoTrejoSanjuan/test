import { Component, OnInit } from '@angular/core';
import { Service } from '../../../service/service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ClassGenerica } from '../../../classGeneric/config';
import {ValidationModule} from '../../../validator/validation.module';
import {ValidationService} from '../../../validator/validation.service';
import { Notifications} from '../../../classGeneric/notifications';
import { Pagination } from '../../../classGeneric/pagination';
import { PaginationFron } from '../../../classGeneric/paginationFront';
@Component({
    selector: 'roles',
    templateUrl: 'template/roles.component.html',
    styleUrls: ['template/roles.css']
})

export class RolesComponent extends ClassGenerica {
    menuLateral: Array<Object>;
    getObjecAll: Array<Object>;
    formulario: any;
    save: boolean;
    editDelete: boolean;
    modalFormulario: boolean;
    modalAlert: boolean;
    grupo:number;
    roles:any;

    pager: any = {};
    pagedItems: Array<Object>;

    showDialogAlert: Boolean = false;

    constructor(
        private service: Service,
        private notifications: Notifications,
        private formBuilder: FormBuilder,
        private paginationfron : PaginationFron,
    ) {
        super();
        this.menuNavigation = this.menuNavigation();
        this.menuLateral = this.getMenuLateral(1);
        this.getAll();
        this.grupo=0;
        this.formulario = this.formBuilder.group({
            'idGrupo': ['', [Validators.required]],
            'descripcion': ['', [Validators.required]],
            'status': ['1', [Validators.required]],
            'idRol': ['',[Validators.required]]
        });

    }

    public buscar(){
        super.loading(true);
        let path = '/AsesorBig/api/portal/seguridad/roles/consulta';
        let object: any = {
            "idGrupo": this.grupo,
            "idRol":null
        };
        this.service.post(object, path, 1).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                if (object.codE === 0) {
                    this.roles=object.jsonResultado;
                }
            },
            error => {
                super.loading(false);
                this.notifications.error('Error de servicio');
            },
            () => super.loading(false)
        );
    }

    setPage(page: number, rango?: number, total?: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.paginationfron.getPager(total, page, rango);
        this.pagedItems = this.paginationfron.getPagerdata([],page);
    }

    private getAll(): void {
        super.loading(true);
        let path = '/AsesorBig/api/portal/seguridad/grupos/consulta';
        let object: any = {
            "idGrupo": null
        };
        this.service.post(object, path, 1).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                if (object.codE === 0) {
                    this.getObjecAll = object.jsonResultado;
                    this.pager = this.paginationfron.getPager(object.jsonResultado.length, 1, 50);
                    this.pagedItems = this.paginationfron.getPagerdata(object.jsonResultado);
                }
            },
            error => {
                super.loading(false);
                this.notifications.error('Error de servicio');
            },
            () => super.loading(false)
        );
    }

    public openForm(): void {
        this.modalFormulario = true;
        this.save = true; this.editDelete = false;
        this.formulario.controls['idGrupo'].setValue('');
        this.formulario.controls['descripcion'].setValue('');
        this.formulario.controls['status'].setValue('1');
        this.formulario.controls['idRol'].setValue('');
    }

    public detalle(obj): void {
        console.log(obj);
        this.modalFormulario = true;
        this.save = false; this.editDelete = true;
        this.formulario.controls['idGrupo'].setValue(obj.idGrupo);
        this.formulario.controls['descripcion'].setValue(String(obj.descripcion));
        this.formulario.controls['status'].setValue(String(obj.status));
        this.formulario.controls['idRol'].setValue(obj.idRol);

    }



    public saveEditForm(): void {
        if (this.formulario.valid) {
            super.loading(true);
            this.modalFormulario = false;
            let path: string;
            if (this.save === true) {
                path = '/AsesorBig/api/portal/seguridad/roles/alta';
            } else {
                path = '/AsesorBig/api/portal/seguridad/roles/actualiza';
            }
            console.log(this.formulario.value);
            this.service.post(this.formulario.value, path, 1).subscribe(
                data => {
                    let object = JSON.parse(JSON.stringify(data));
                    if (object.codE === 0) {
                        this.getAll();
                        this.notifications.success(object.msgE);
                    }
                },
                error => {
                    super.loading(false);
                    this.notifications.error('Error de servicio');
                }
            );
        }
    }

    public delete(): void {
        super.loading(true);
        let object: any = {
            "idGrupo": String(this.formulario.controls['idGrupo'].value),
            "idRol": String(this.formulario.controls['idRol'].value)
        };
        this.modalFormulario = false;
        let path: string = '/AsesorBig/api/portal/seguridad/roles/baja';
        console.log(object);
        this.service.post(object, path, 1).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                if (object.codE === 0) {
                    this.getAll();
                    this.notifications.success(object.msgE);
                }
            },
            error => {
                super.loading(false);
                this.notifications.error('Error de servicio');
            }
        );
    }



}