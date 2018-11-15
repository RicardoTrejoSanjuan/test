/*
 * @version 1.0 (21-11-2017)
 * @author lfgonzalezr
 * @description Monitoreo de instituciones
 * @contributors Front-end team
 */

import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClassGenerica } from '../../../../../classGeneric/config';
import { ValidationService } from '../../../../../validator/validation.service';
import { Notifications } from '../../../../../classGeneric/notifications';
import { Service } from '../../../../../service/service';
//Componentes de Portal
import { Ng2Tables } from '../../../../../ng2-tables/ng2-tables.component';
import { ConfigNgTable2, PagesHandler } from '../../../../../ng2-tables/ng2-tables';
import { FilterTable } from '../../../../../pipes/pipes-portal';
/* importacion de clases de manejo */
import {
    HandlerMenus,
    ObjHandlerMonitoreoCatalogos,
    ObjHandlerModal
} from '../../monitoreo';

@Component({
    selector: 'monitoreo-mantenimientos-responsables',
    templateUrl: 'catalogos-responsables.component.html',
    styleUrls: ['../../monitoreo.component.css']
})
export class MonitoreoCatalogosResponsables extends ClassGenerica {
    @ViewChild('tablaresponsables') tablaResponsables: Ng2Tables;
    public objHandler: ObjHandlerMonitoreoCatalogos = new ObjHandlerMonitoreoCatalogos();
    public handlerModal: ObjHandlerModal = new ObjHandlerModal('init');
    public formulario: FormGroup;
    public ph: PagesHandler = new PagesHandler();
    public menuLateral: Object[] = [];
    public Responsables: any = [];
    public ResponsablesGral: any = [];
    public strResponsables: string = '';

    constructor(private router: Router, private _serv: Service, private _notif: Notifications) {
        super();
        let menus: any = this.datapermisos().child;
        let handlerMenus: HandlerMenus = new HandlerMenus();
        let arrayMenus: any = handlerMenus.getMenus(menus, '/reportes/monitoreo/mantenimientos');
        this.menuLateral = arrayMenus.arrayMenus;
        this.Consultar();
        this.CargarFormulario('init');
    }
    public PressSearch(_evt: any): void {
        try {
            let _str: string = _evt.target.value;
            this.Responsables = new FilterTable().transform(this.ResponsablesGral, _str);
            this.tablaResponsables.SetTabla(new ConfigNgTable2(this.Responsables.length, 10));
        } catch (_exp) { }
    }
    public ClearInput(): void {
        this.strResponsables = '';
        this.Responsables = new FilterTable().transform(this.ResponsablesGral, '');
        this.tablaResponsables.SetTabla(new ConfigNgTable2(this.Responsables.length, 10));
    }
    public NuevoRegistro(): void {
        this.handlerModal = new ObjHandlerModal('alta');
        this.CargarFormulario('alta');
    }
    private EditarRegistro(_item: any): void {
        console.log(_item);
        this.handlerModal = new ObjHandlerModal('editar');
        this.CargarFormulario('editar', _item);
    }
    private CargarFormulario(_type: string, _data?: any): void {
        switch (_type.toUpperCase()) {
            case 'ALTA':
                this.formulario = new FormGroup({
                    'nombre': new FormControl(null, Validators.required),
                    'apPaterno': new FormControl(null, Validators.required),
                    'apMaterno': new FormControl(null, Validators.required),
                    'extension': new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
                    'mail': new FormControl('', [ValidationService.emailValidator, Validators.required]),
                    'usuarioCreacion': new FormControl({ value: super.getFullName(), disabled: true }, Validators.required)
                });
                break;
            case 'EDITAR':
                this.formulario = new FormGroup({
                    'idResponsable': new FormControl(_data.idResponsable, Validators.required),
                    'nombre': new FormControl(_data.nombre, Validators.required),
                    'apPaterno': new FormControl(_data.apPaterno, Validators.required),
                    'apMaterno': new FormControl(_data.apMaterno, Validators.required),
                    'extension': new FormControl(_data.extension, Validators.required),
                    'mail': new FormControl(_data.email, [ValidationService.emailValidator, Validators.required]),
                    'status': new FormControl(String(_data.status), Validators.required),
                    'usuarioCreacion': new FormControl({ value: super.getFullName(), disabled: true }, Validators.required)
                });
                break;
            default:
                this.formulario = new FormGroup({});
                break;
        }
    }
    // CRUD DE CATALOGOS DE TAREAS
    private Consultar(): void {
        super.loading(true);
        this._serv.post({ idResponsable: null, idArea: null }, '/api/traking/resp/consulta', 3).subscribe((data: any) => {
            console.log(data);
            super.loading(false);
            try {
                if (data.codE === 0) {
                    if (data.jsonResultado.length > 0) {
                        this.objHandler.setTabVisible('conRegistros');
                        this.ResponsablesGral = data.jsonResultado;
                        this.Responsables = new FilterTable().transform(this.ResponsablesGral, '');
                        setTimeout(() => {
                            this.tablaResponsables.SetTabla(new ConfigNgTable2(this.Responsables.length, 10));
                        }, 0);
                    } else {
                        this.objHandler.setTabVisible('sinRegistros');
                    }
                } else {
                    this.objHandler.setTabVisible('sinRegistros');
                    this._notif.info(data.msgE);
                }
            } catch (e) {
                console.log('No se recibio una respuesta adecuada del servidor');
            }
        });
    }
    private Alta(_data: any): void {
        console.log(_data);
        this.CloseForm();
        let jsonSend: object = {
            nombre: super.strUpperCase(_data.nombre),
            apPaterno: super.strUpperCase(_data.apPaterno),
            apMaterno: super.strUpperCase(_data.apMaterno),
            extension: _data.extension,
            mail: _data.mail,
            usuarioCreacion: super.isKeyUser()
        };
        super.loading(true);
        this._serv.post(jsonSend, '/api/traking/resp/alta', 3).subscribe((data: any) => {
            super.loading(false);
            console.log(JSON.stringify(data));
            try {
                if (data.codE === 0) {
                    this._notif.success(data.msgE);
                    this.Consultar();
                } else {
                    this._notif.info(data.msgE);
                }
            } catch (e) {
                console.log('No se recibio una respuesta adecuada del servidor');
            }
        });
    }
    private Actualizar(_data: any): void {
        console.log(_data);
        this.CloseForm();
        let jsonSend: object = {
            idResponsable: _data.idResponsable,
            nombre: super.strUpperCase(_data.nombre),
            apPaterno: super.strUpperCase(_data.apPaterno),
            apMaterno: super.strUpperCase(_data.apMaterno),
            extension: _data.extension,
            mail: _data.mail,
            status: _data.status,
            usuarioModif: super.isKeyUser()
        };
        super.loading(true);
        this._serv.post(jsonSend, '/api/traking/resp/actualizacion', 3).subscribe((data: any) => {
            super.loading(false);
            console.log(JSON.stringify(data));
            try {
                if (data.codE === 0) {
                    this._notif.success(data.msgE);
                    this.Consultar();
                } else {
                    this._notif.info(data.msgE);
                }
            } catch (e) {
                console.log('No se recibio una respuesta adecuada del servidor');
            }
        });
    }
    private Delete(_data: any): void {
        console.log(_data);
        this.CloseForm();
        let jsonSend: object = {
            idResponsable: _data.idResponsable,
            usuarioModif: super.isKeyUser()
        };
        super.loading(true);
        this._serv.post(jsonSend, '/api/traking/resp/delete', 3).subscribe((data: any) => {
            super.loading(false);
            console.log(JSON.stringify(data));
            try {
                if (data.codE === 0) {
                    this._notif.success(data.msgE);
                    this.Consultar();
                } else {
                    this._notif.info(data.msgE);
                }
            } catch (e) {
                console.log('No se recibio una respuesta adecuada del servidor');
            }
        });
    }
    public CloseForm(): void {
        this.handlerModal = new ObjHandlerModal('init');
    }
    //Ordenamiento de la tabla por numeros
    private SortTableByNumber(_item: any): void {
        this.Responsables.sort(function(a: any, b: any) {
            return a[_item] - b[_item];
        });
    }
    //Ordenamiento de la tabla por string
    private SortTableByString(_item: any): void {
        this.Responsables.sort(function(a: any, b: any) {
            return (a[_item] > b[_item]) ? 1 : ((b[_item] > a[_item]) ? -1 : 0);
        });
    }
    //Actualiza la tabla de las instituciones
    private ActualizarTabla(_config: any): void {
        this.ph = _config;
    }
    //Regresar al menu anterior
    public Regresar(): void {
        this.router.navigate(['./reportes/monitoreo']);
    }
}
