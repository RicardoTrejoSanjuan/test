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
    selector: 'monitoreo-mantenimientos-enlace',
    templateUrl: 'catalogos-enlace.component.html',
    styleUrls: ['../../monitoreo.component.css']
})
export class MonitoreoCatalogosEnlace extends ClassGenerica {
    @ViewChild('tablaenlaces') tablaEnlaces: Ng2Tables;
    public objHandler: ObjHandlerMonitoreoCatalogos = new ObjHandlerMonitoreoCatalogos();
    public handlerModal: ObjHandlerModal = new ObjHandlerModal('init');
    public formulario: FormGroup;
    public ph: PagesHandler = new PagesHandler();
    public menuLateral: Object[] = [];
    public ArrayTipoFlujo: Array<object> = [];
    public Enlaces: any = [];
    public EnlacesGral: any = [];
    public strEnlaces: string = '';

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
            this.Enlaces = new FilterTable().transform(this.EnlacesGral, _str);
            this.tablaEnlaces.SetTabla(new ConfigNgTable2(this.Enlaces.length, 10));
        } catch (e) { }
    }
    public ClearInput(): void {
        this.strEnlaces = '';
        this.Enlaces = new FilterTable().transform(this.EnlacesGral, '');
        this.tablaEnlaces.SetTabla(new ConfigNgTable2(this.Enlaces.length, 10));
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
                    'descripcionFlujo': new FormControl(null, Validators.required),
                    'tipoFlujo': new FormControl(null, Validators.required),
                    'usuario': new FormControl({ value: super.getFullName(), disabled: true }, Validators.required)
                });
                break;
            case 'EDITAR':
                this.formulario = new FormGroup({
                    'idFlujo': new FormControl(_data.idFlujo, Validators.required),
                    'usuario': new FormControl(super.getFullName(), Validators.required),
                    'descripcionFlujo': new FormControl(_data.descripcion, Validators.required),
                    'tipoFlujo': new FormControl(String(_data.idTipoFlujo), Validators.required),
                    'status': new FormControl(String(_data.status), Validators.required)
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
        this._serv.post({ "idFlujo": null }, '/api/traking/flujo/consulta', 3).subscribe((data: any) => {
            super.loading(false);
            console.log(JSON.stringify(data));
            try {
                if (data.codE === 0) {
                    if (data.jsonResultado.length > 0) {
                        this.objHandler.setTabVisible('conRegistros');
                        this.EnlacesGral = data.jsonResultado;
                        this.Enlaces = new FilterTable().transform(this.EnlacesGral, '');
                        setTimeout(() => {
                            this.tablaEnlaces.SetTabla(new ConfigNgTable2(this.Enlaces.length, 10));
                        }, 0);
                        this.ConsultarFlujos();
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
    private ConsultarFlujos(): void {
        super.loading(true);
        this._serv.post({ "idTipoFlujo": null }, '/api/traking/tipoflujo/consulta', 3).subscribe((data: any) => {
            super.loading(false);
            try {
                if (data.codE === 0) {
                    console.log(data);
                    this.ArrayTipoFlujo = data.jsonResultado;
                } else {
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
            "descripcionFlujo": _data.descripcionFlujo,
            "tipoFlujo": _data.tipoFlujo,
            "usuario": super.isKeyUser()
        };
        super.loading(true);
        this._serv.post(jsonSend, '/api/traking/flujo/alta', 3).subscribe((data: any) => {
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
            "idFlujo": _data.idFlujo,
            "descripcionFlujo": _data.descripcionFlujo,
            "status": _data.status,
            "tipoFlujo": _data.tipoFlujo,
            "usuario": super.isKeyUser()
        };
        super.loading(true);
        this._serv.post(jsonSend, '/api/traking/flujo/actualiza', 3).subscribe((data: any) => {
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
            "idFlujo": _data.idFlujo,
            "usuario": super.isKeyUser()
        };
        super.loading(true);
        this._serv.post(jsonSend, '/api/traking/flujo/elimina', 3).subscribe((data: any) => {
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
        this.Enlaces.sort(function(a: any, b: any) {
            return a[_item] - b[_item];
        });
    }
    //Ordenamiento de la tabla por string
    private SortTableByString(_item: any): void {
        this.Enlaces.sort(function(a: any, b: any) {
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
