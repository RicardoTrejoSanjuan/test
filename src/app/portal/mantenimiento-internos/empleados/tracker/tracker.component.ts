import { Component } from '@angular/core';
import { Router, } from '@angular/router';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ValidationService } from '../../../../validator/validation.service';

import { ClassGenerica } from '../../../../classGeneric/config';

import { Pagination } from '../../../../classGeneric/pagination';

import { Notifications } from '../../../../classGeneric/notifications';


import { Service } from '../../../../service/service';

import { JsonToCsv } from '../../../../classGeneric/jsontocsv';


import { PaginationFron } from '../../../../classGeneric/paginationFront';

@Component({
    selector: 'grupos',
    templateUrl: 'template/tracker.component.html',
    styleUrls: ['template/tracker.css'],
})



export class TrackerComponent extends ClassGenerica {
    menuLateral: Array<Object>;
    getObjecAll: Array<Object>;
    formulario: any;
    save: boolean;
    editDelete: boolean;
    modalFormulario: boolean;
    modalAlert: boolean;

    input: any;
    radio: any = 'empleado';

    public menuActivos = {
        menuTracker:true,
        empleados:false,
        modulos:false,
        campos:false,
    };

    private children:Array<Object> = [  
        {  
           "textoMenu":"Tracker por Empleado",
           "claseFondo":"cafe-01-ico",
           "claseIcono":"cafe-01-active",
           "data":"empleados",
           "imagen":"bloqueo.png",
        },
        {  
         "textoMenu":"Catálogo de Módulo",
         "claseFondo":"cafe-01-ico",
         "claseIcono":"cafe-01-active",
         "data":"modulos",
         "imagen":"bloqueo.png",
      },
      {  
         "textoMenu":"Catálogo de Campos",
         "claseFondo":"cafe-01-ico",
         "claseIcono":"cafe-01-active",
         "data":"campos",
         "imagen":"bloqueo.png",
      },
    ];

    pager: any = {};
    pagedItems: Array<Object>;
    constructor(
        private service: Service,
        private notifications: Notifications,
        private jsonToCsv: JsonToCsv,
        private formBuilder: FormBuilder,
        private paginationfron : PaginationFron,
    ) {
        super();
        this.menuNavigation = this.menuNavigation();
        this.menuLateral = this.getMenuLateral();
        this.getAll();

        this.formulario = this.formBuilder.group({
            'idGrupo': ['', [Validators.required, ValidationService.validarNumeros]],
            'descripcion': ['', [Validators.required]],
            'status': ['1', [Validators.required]],
        });

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
    }
    public detalle(obj): void {
        this.modalFormulario = true;
        this.save = false; this.editDelete = true;
        this.formulario.controls['idGrupo'].setValue(String(obj.idGrupo));
        this.formulario.controls['descripcion'].setValue(String(obj.descripcion));
        this.formulario.controls['status'].setValue(String(obj.status));
    }



    public saveEditForm(): void {
        if (this.formulario.valid) {
            super.loading(true);
            this.modalFormulario = false;
            let path: string;
            if (this.save === true) {
                path = '/AsesorBig/api/portal/seguridad/grupos/alta';
            } else {
                path = '/AsesorBig/api/portal/seguridad/grupos/actualiza';
            }
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
            "idGrupo": String(this.formulario.controls['idGrupo'].value)
        };
        this.modalFormulario = false;
        let path: string = '/AsesorBig/api/portal/seguridad/grupos/baja';
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


    private windows(data): void{
        this.menuActivos.menuTracker = false;
        this.menuActivos.empleados = false;
        this.menuActivos.modulos = false;
        this.menuActivos.campos = false;
        if(data === 'empleados'){
            this.menuActivos.empleados = true;
        }else if(data === 'modulos'){
            this.menuActivos.modulos = true;
        }else if(data === 'campos'){
            this.menuActivos.campos = true;
        }

    }

    private buscar(data): void{
        console.log(data);
        console.log(this.radio);
        console.log("buscamos");
    }



    



}


