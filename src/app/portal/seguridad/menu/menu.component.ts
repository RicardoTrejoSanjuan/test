import { Component } from '@angular/core';
import { Router, } from '@angular/router';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ValidationService } from '../../../validator/validation.service';

import { ClassGenerica } from '../../../classGeneric/config';

import { Pagination } from '../../../classGeneric/pagination';

import { Notifications } from '../../../classGeneric/notifications';


import { Service } from '../../../service/service';

import { JsonToCsv } from '../../../classGeneric/jsontocsv';

import { PaginationFron } from '../../../classGeneric/paginationFront';

import { Menu } from './menu';

@Component({
    selector: 'grupos',
    templateUrl: 'template/menu.component.html',
    styleUrls: ['template/menu.css'],
})



export class MenuComponent extends ClassGenerica {
    menuLateral: Array<Object>;
    formulario: any;
    boxsearch: any;
    save: boolean;
    editDelete: boolean;
    modalFormulario: boolean;
    modalAlert: boolean;
    generar: boolean;
    pager: any = {};
    pagedItems: Array<Object>;

    filter: Menu = new Menu();
    menuObjec: Menu = new Menu();

    nameColumnaFilter:string;

    showDialogAlert: Boolean = false;
    
    constructor(
        private service: Service,
        private notifications: Notifications,
        private jsonToCsv: JsonToCsv,
        private formBuilder: FormBuilder,
        private paginationfron : PaginationFron
    ) {
        super();
        this.menuNavigation = this.menuNavigation();
        this.menuLateral = this.getMenuLateral(1);
        this.getAll();
        this.generar=false;
        this.boxsearch = this.formBuilder.group({
            'parameter': ['', [Validators.required]],
        });

        this.formulario = this.formBuilder.group({
            'idMenuParent': ['', [Validators.required, ValidationService.validarNumeros]],
            'idMenu': ['', [Validators.required, ValidationService.validarNumeros]],
            'textoMenu': ['', [Validators.required]],
            'descripcion': ['', [Validators.required]],
            'color': ['', [Validators.required]],
            'imagen': ['', [Validators.required]],
            'claseFondo': ['', [Validators.required]],
            'claseIcono': ['', [Validators.required]],
            'url': ['', [Validators.required]],
            'status': ['1', [Validators.required]],
            'idServicio': [null,],
            
        });
    }


    private getAll(): void {
        super.loading(true);
        let path = '/AsesorBig/api/portal/seguridad/mantenimientoMenu/consulta';
        let object: any = {
            "idMenu": null
        };
        this.service.post(object, path, 1).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                if (object.codE === 0) {
                    if (this.generar) {
                        this.jsonToCsv.generateToExcel(object.jsonResultado,'reportes');
                        this.generar=false;
                    }else{
                        this.pager = this.paginationfron.getPager(object.jsonResultado.length, 1, 50);
                        this.pagedItems = this.paginationfron.getPagerdata(object.jsonResultado);
                        this.boxsearch.controls['parameter'].setValue('');
                    }
                    
                    
                }
            },
            error => {
                super.loading(false);
                this.notifications.error('Error de servicio');
            },
            () => super.loading(false)
        );
    }

    reporte(){
        this.generar=true;
        this.getAll();
        
    }

    public setCol(data):void{
        this.nameColumnaFilter = data;
        if(this.boxsearch.value.parameter !== ''){
            this.search();
        }
    }

    public search():void{
        if(this.nameColumnaFilter !== undefined){
            let arrayTable = this.paginationfron.arrayPaginate;
            if(this.boxsearch.valid){
                    let columnas: string[] = [];
                    for (var key in this.paginationfron.arrayPaginate[0]) {
                        if (this.paginationfron.arrayPaginate[0].hasOwnProperty(key)) {
                            columnas.push(key);
                        }
                    }
                    for (let add of columnas) {
                        var obj = {};
                        if (add === this.nameColumnaFilter) {
                            obj[add] = this.boxsearch.value.parameter;
                            this.pagedItems = this.datass(arrayTable, obj);
                        }
                    }
                    }else{
                        this.pagedItems = arrayTable;
                    }
        }
    }

    private datass(items, object):any{
        if (!items || !object) {
            return items;
        }
        return items.filter((item) => this.applyFilter(item, object,object));
    }

    applyFilter(arrayObject, object,objectrespaldo): boolean {
        for (let field in object) {
            if (object[field]) {
                if(arrayObject[field] !== null){
                    if (arrayObject[field].toString().toLowerCase().indexOf(object[field].toLowerCase()) === -1) {
                        return false;
                    }
                }else{
                    return false;
                }
            }
        }
        return true;
      }

    setPage(page: number, rango?: number, total?: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.paginationfron.getPager(total, page, rango);
        this.pagedItems = this.paginationfron.getPagerdata([],page);
    }

    public openForm(): void {
        this.modalFormulario = true;
        this.save = true; this.editDelete = false;
        this.formulario.controls['idMenuParent'].setValue('');
        this.formulario.controls['idMenu'].setValue('');
        this.formulario.controls['textoMenu'].setValue('');
        this.formulario.controls['descripcion'].setValue('');
        this.formulario.controls['color'].setValue('');
        this.formulario.controls['imagen'].setValue('');
        this.formulario.controls['claseFondo'].setValue('');
        this.formulario.controls['claseIcono'].setValue('');
        this.formulario.controls['url'].setValue('');
        this.formulario.controls['status'].setValue('1');

    }

    public detalle(obj): void {
        this.modalFormulario = true;
        this.save = false; this.editDelete = true;
        this.formulario.controls['idMenuParent'].setValue(String(obj.idMenuParent));
        this.formulario.controls['idMenu'].setValue(String(obj.idMenu));
        this.formulario.controls['textoMenu'].setValue(String(obj.textoMenu));

        this.formulario.controls['descripcion'].setValue(String(obj.descripcion));
        this.formulario.controls['color'].setValue(String(obj.color));
        this.formulario.controls['imagen'].setValue(String(obj.imagen));

        this.formulario.controls['claseFondo'].setValue(String(obj.claseFondo));
        this.formulario.controls['claseIcono'].setValue(String(obj.claseIcono));
        this.formulario.controls['url'].setValue(String(obj.url));
        this.formulario.controls['status'].setValue(String(obj.status));
    }

    public duplicar(obj): void {
        this.modalFormulario = true;
        this.save = true; this.editDelete = false;
        this.formulario.controls['idMenuParent'].setValue(String(obj.idMenuParent));
        this.formulario.controls['idMenu'].setValue(String(obj.idMenu));
        this.formulario.controls['textoMenu'].setValue(String(obj.textoMenu));

        this.formulario.controls['descripcion'].setValue(String(obj.descripcion));
        this.formulario.controls['color'].setValue(String(obj.color));
        this.formulario.controls['imagen'].setValue(String(obj.imagen));

        this.formulario.controls['claseFondo'].setValue(String(obj.claseFondo));
        this.formulario.controls['claseIcono'].setValue(String(obj.claseIcono));
        this.formulario.controls['url'].setValue(String(obj.url));
        this.formulario.controls['status'].setValue(String(obj.status));
    }



    public saveEditForm(): void {
        if (this.formulario.valid) {
            super.loading(true);
            this.modalFormulario = false;
            let path: string;
            if (this.save === true) {
                path = '/AsesorBig/api/portal/seguridad/mantenimientoMenu/alta';
            } else {
                path = '/AsesorBig/api/portal/seguridad/mantenimientoMenu/actualiza';
            }
            this.service.post(this.formulario.value, path, 1).subscribe(
                data => {
                    let object = JSON.parse(JSON.stringify(data));
                    if (object.codE === 0) {
                        this.getAll();
                        this.notifications.success(object.msgE);
                    }else{
                        super.loading(false);
                        this.notifications.error(object.msgE);
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
            "idMenu": String(this.formulario.controls['idMenu'].value)
        };
        this.modalFormulario = false;
        let path: string = '/AsesorBig/api/portal/seguridad/mantenimientoMenu/baja';
        this.service.post(object, path, 1).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                if (object.codE === 0) {
                    this.getAll();
                    this.notifications.success(object.msgE);
                }else{
                    super.loading(false);
                    this.notifications.error(object.msgE);
                }
            },
            error => {
                super.loading(false);
                this.notifications.error('Error de servicio');
            }
        );
    }



}


