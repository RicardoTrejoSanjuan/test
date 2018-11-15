/*
 * @version 1.0 (21-11-2017)
 * @author lfgonzalezr
 * @description Monitoreo de instituciones
 * @contributors Front-end team
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../../../validator/validation.service';
import { ClassGenerica } from '../../../../classGeneric/config';
import { Notifications } from '../../../../classGeneric/notifications';
import { Service } from '../../../../service/service';
//Variables de manejo
import {
    ObjHandlerMonitoreoConfiguracion,
    ObjHandlerModal
} from '../monitoreo';

@Component({
    selector: 'monitoreo-configuracion',
    templateUrl: 'monitoreo-configuracion.component.html',
    styleUrls: ['../monitoreo.component.css']
})

export class MonitoreoConfiguracion extends ClassGenerica {
    public objHandler: ObjHandlerMonitoreoConfiguracion = new ObjHandlerMonitoreoConfiguracion();
    public handlerModal: ObjHandlerModal = new ObjHandlerModal('init');
    public FormFlujos: FormControl = new FormControl();
    public formulario: FormGroup;
    public idFlujo: number = null;
    public EtapasAsignadas: Array<object> = [];
    public ArrayAllCatalogos: Array<object> = [];
    public ArrayCatalogosFlujos: any = null;
    public ArrayCatalogosAreas: Array<object> = [];
    public ArrayCatalogosEtapas: Array<object> = [];
    public ArrayCatalogosResponsables: Array<object> = [];
    public OnlyRequest: boolean = true;

    constructor(private router: Router, private _serv: Service, private _notif: Notifications) {
        super();
        this.CargarFormulario('init');
        this.ConsultarFlujos();
        this.ConsultarCatalogos('AREAS');
    }

    private CargarFormulario(_type: string, _data?: any): void {
        switch (_type.toUpperCase()) {
            case 'ALTA':
                this.handlerModal = new ObjHandlerModal('alta');
                this.formulario = new FormGroup({
                    'idArea': new FormControl(null, Validators.required),
                    'idEtapa': new FormControl(null, Validators.required),
                    'idResponsable': new FormControl(null, Validators.required),
                    'diasDuracion': new FormControl(null, [Validators.required]),
                    'orden': new FormControl(null, [Validators.required])
                });
                break;
            case 'EDITAR':
                this.handlerModal = new ObjHandlerModal('editar');
                this.formulario = new FormGroup({
                    'idArea': new FormControl(String(_data.idArea), Validators.required),
                    'idEtapa': new FormControl(String(_data.idEtapa), Validators.required),
                    'idResponsable': new FormControl(String(_data.idResponsable), Validators.required),
                    'diasDuracion': new FormControl(_data.diasDuracionEtapa, [Validators.required]),
                    'orden': new FormControl(_data.orden, [Validators.required]),
                    'consecutivo': new FormControl(String(_data.consecutivo))
                });
                break;
            default:
                this.formulario = new FormGroup({});
                break;
        }
    }
    private ConsultarFlujos(): void {
        super.loading(true);
        this._serv.post({ idFlujo: null }, '/api/traking/flujo/consulta', 3).subscribe((data: any) => {
            super.loading(false);
            try {
                if (data.codE === 0) {
                    if (data.jsonResultado.length > 0) {
                        this.ArrayAllCatalogos = data.jsonResultado;
                        this.ArrayCatalogosFlujos = this.FormFlujos.valueChanges
                            .startWith('')
                            .map(name => this.Filter(name));
                    } else {
                        this._notif.info('No se cuenta con flujos registrados');
                    }
                }
            } catch (e) {
                console.log(JSON.stringify(data));
            }
        });
    }
    private ConsultarEtapas(_item: any): void {
        if (this.OnlyRequest) {
            this.OnlyRequest = false;
            super.loading(true);
            this.idFlujo = _item.idFlujo;
            let path: string = '/api/traking/cflujo/consulta';
            let jsonSend: object = { "idFlujo": _item.idFlujo };
            this._serv.post(jsonSend, path, 3).subscribe((data: any) => {
                super.loading(false);
                this.OnlyRequest = true;
                try {
                    if (data.codE === 0) {
                        if (data.jsonResultado.length > 0) {
                            this.objHandler.setTabVisible('conRegistros');
                            this.EtapasAsignadas = data.jsonResultado;
                        } else {
                            this.objHandler.setTabVisible('sinRegistros');
                        }
                    }
                } catch (e) {
                    console.log(JSON.stringify(data));
                }
            });
        }
    }
    private ConsultarCatalogos(_catalogo: string): void {
        switch (_catalogo.toUpperCase()) {
            case 'AREAS':
                super.loading(true);
                this._serv.post({ idArea: null }, '/api/traking/area/consulta', 3).subscribe((data: any) => {
                    try {
                        if (data.codE === 0) {
                            this.ArrayCatalogosAreas = data.jsonResultado;
                            this.ConsultarCatalogos('ETAPAS');
                        }
                    } catch (e) {
                        super.loading(false);
                        console.log(JSON.stringify(data));
                    }
                });
            case 'ETAPAS':
                this._serv.post({ idEtapa: null }, '/api/traking/etapa/consulta', 3).subscribe((data: any) => {
                    try {
                        if (data.codE === 0) {
                            this.ArrayCatalogosEtapas = data.jsonResultado;
                            this.ConsultarCatalogos('RESPONSABLES');
                        }
                    } catch (e) {
                        super.loading(false);
                        console.log(JSON.stringify(data));
                    }
                });
            case 'RESPONSABLES':
                this._serv.post({ idResponsable: null, idArea: null }, '/api/traking/resp/consulta', 3).subscribe((data: any) => {
                    super.loading(false);
                    try {
                        if (data.codE === 0) {
                            this.ArrayCatalogosResponsables = data.jsonResultado;
                        }
                    } catch (e) {
                        console.log(JSON.stringify(data));
                    }
                });
        }
    }
    private Alta(_item: any): void {
        let jsonSend: any = {
            "idFlujo": this.idFlujo,
            "idArea": _item.idArea,
            "idEtapa": _item.idEtapa,
            "diasDuracionEtapa": _item.diasDuracion,
            "idResponsable": _item.idResponsable,
            "orden": _item.orden,
            "usuario": super.isKeyUser()
        };
        super.loading(true);
        this._serv.post(jsonSend, '/api/traking/cflujo/alta', 3).subscribe((data: any) => {
            super.loading(false);
            try {
                if (data.codE === 0) {
                    this.ConsultarEtapas({ idFlujo: jsonSend.idFlujo });
                }
            } catch (e) {
                console.log(JSON.stringify(data));
            }
        });
    }
    private Actualizar(_item: any): void {
        let jsonSend: any = {
            "idFlujo": this.idFlujo,
            "idArea": _item.idArea,
            "idEtapa": _item.idEtapa,
            "diasDuracionEtapa": _item.diasDuracion,
            "idResponsable": _item.idResponsable,
            "status": 1,
            "orden": _item.orden,
            "idConsecutivo": _item.consecutivo,
            "usuario": super.isKeyUser()
        };
        super.loading(true);
        this.CloseForm();
        this._serv.post(jsonSend, '/api/traking/cflujo/actualiza', 3).subscribe((data: any) => {
            super.loading(false);
            try {
                if (data.codE === 0) {
                    this.ConsultarEtapas({ idFlujo: jsonSend.idFlujo });
                }
            } catch (e) {
                console.log(JSON.stringify(data));
            }
        });
    }
    private Delete(_item: any): void {
        super.loading(true);
        this.CloseForm();
        let jsonSend: any = {
            "idFlujo": this.idFlujo,
            "idConsecutivo": _item.consecutivo,
            "usuario": super.isKeyUser()
        };
        this._serv.post(jsonSend, '/api/traking/cflujo/elimina', 3).subscribe((data: any) => {
            super.loading(false);
            try {
                if (data.codE === 0) {
                    this.ConsultarEtapas({ idFlujo: jsonSend.idFlujo });
                }
            } catch (e) {
                console.log(JSON.stringify(data));
            }
        });
    }
    private ValidarItem(_data: any): void {
        if (this.isAvailable(_data)) {
            this.formulario.controls['orden'].setValue(null);
            this.handlerModal.setMsgE(true, 'El orden seleccionado ya existe');
        } else {
            this.CloseForm();
            this.Alta(_data);
        }
    }
    public ClearInput(): void {
        this.FormFlujos.reset();
        this.EtapasAsignadas = [];
        this.objHandler.setTabVisible('init');
    }
    private isAvailable(_item: any): boolean {
        let exist: boolean = false;
        this.EtapasAsignadas.forEach((item: any) => {
            if (item.orden === _item.orden) {
                exist = true;
            }
        });
        return exist;
    }
    private onClick(): void {
        this.handlerModal.setMsgE(false);
    }
    private Filter(_str: string): any {
        if (super.isValid(_str) && typeof (_str) === 'string') {
            return this.ArrayAllCatalogos.filter((_item: any) => {
                let regexp: any = new RegExp(_str, "gi");
                if (_item.descripcion.match(regexp) !== null) {
                    return _item;
                }
            });
        }
        return this.ArrayAllCatalogos;
    }
    public CloseForm(): void {
        this.handlerModal = new ObjHandlerModal('init');
    }
    /* regresar al menu anterior*/
    public Regresar(): void {
        this.router.navigate(['./reportes/monitoreo']);
    }
}
