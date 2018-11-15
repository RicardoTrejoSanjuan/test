import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
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
    selector: 'monitoreo-mantenimientos-asesor',
    templateUrl: 'catalogos-tipo-flujo.component.html',
    styleUrls: ['../../monitoreo.component.css']
})
export class MonitoreoCatalogosFlujo extends ClassGenerica {
    @ViewChild('tablaetapas') tablaEtapas: Ng2Tables;
    public objHandler: ObjHandlerMonitoreoCatalogos = new ObjHandlerMonitoreoCatalogos();
    public handlerModal: ObjHandlerModal = new ObjHandlerModal('init');
    public formulario: FormGroup;
    public ph: PagesHandler = new PagesHandler();
    public menuLateral: Object[] = [];
    public Etapas: any = [];
    public FlujoGral: any = [];
    public strEtapas: string = '';

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
            this.Etapas = new FilterTable().transform(this.FlujoGral, _str);
            this.tablaEtapas.SetTabla(new ConfigNgTable2(this.Etapas.length, 10));
        } catch (e) { }
    }
    public ClearInput(): void {
        this.strEtapas = '';
        this.Etapas = new FilterTable().transform(this.FlujoGral, '');
        if (this.objHandler.getTabVisible()) {
            this.tablaEtapas.SetTabla(new ConfigNgTable2(this.Etapas.length, 10));
        }
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
                    'descripcion': new FormControl(null, Validators.required),
                    'usuario': new FormControl({ value: super.getFullName(), disabled: true }, Validators.required)
                });
                break;
            case 'EDITAR':
                this.formulario = new FormGroup({
                    'idTipoFlujo': new FormControl(_data.idTipoFlujo, Validators.required),
                    'usuario': new FormControl(super.getFullName(), Validators.required),
                    'descripcion': new FormControl(_data.descripcion, Validators.required),
                    'status': new FormControl(String(_data.status), Validators.required)
                });
                this.formulario.controls['status'].setValue(_data.status);
                break;
            default:
                this.formulario = new FormGroup({});
                break;
        }
    }
    // CRUD DE CATALOGOS DE ETAPAS
    private Consultar(): void {
        super.loading(true);
        this._serv.post({ idTipoFlujo: null }, '/api/traking/tipoflujo/consulta', 3).subscribe((data: any) => {
            super.loading(false);
            try {
                if (data.codE === 0) {
                    console.log(data);
                    if (data.jsonResultado.length > 0) {
                        this.objHandler.setTabVisible('conRegistros');
                        this.FlujoGral = data.jsonResultado;
                        this.Etapas = new FilterTable().transform(this.FlujoGral, '');
                        setTimeout(() => {
                            this.tablaEtapas.SetTabla(new ConfigNgTable2(this.Etapas.length, 10));
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
            descripcionTipoFlujo: _data.descripcion,
            usuarioCreacion: super.isKeyUser()
        };
        super.loading(true);
        this._serv.post(jsonSend, '/api/traking/tipoflujo/alta', 3).subscribe((data: any) => {
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
        console.log(this.formulario.controls['status'].value);
        this.CloseForm();
        let jsonSend: object = {
            idTipoFlujo: _data.idTipoFlujo,
            descripcionTipoFlujo: _data.descripcion,
            status: _data.status,
            usuarioModif: super.isKeyUser()
        };
        super.loading(true);
        console.log(jsonSend);
        this._serv.post(jsonSend, '/api/traking/tipoflujo/actualizacion', 3).subscribe((data: any) => {
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
            idTipoFlujo: _data.idTipoFlujo,
            usuarioModif: super.isKeyUser()
        };
        super.loading(true);
        this._serv.post(jsonSend, '/api/traking/tipoflujo/delete', 3).subscribe((data: any) => {
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
        this.Etapas.sort(function(a: any, b: any) {
            return a[_item] - b[_item];
        });
    }
    //Ordenamiento de la tabla por string
    private SortTableByString(_item: any): void {
        this.Etapas.sort(function(a: any, b: any) {
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
