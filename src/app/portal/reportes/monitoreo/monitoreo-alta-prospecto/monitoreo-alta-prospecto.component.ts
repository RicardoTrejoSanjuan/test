/*
 * @version 1.0 (21-11-2017)
 * @author lfgonzalezr
 * @description Monitoreo de instituciones
 * @contributors Front-end team
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
//Componentes de Portal
import { ValidationService } from '../../../../validator/validation.service';
import { ClassGenerica } from '../../../../classGeneric/config';
import { Notifications } from '../../../../classGeneric/notifications';
import { Service } from '../../../../service/service';
//Variables de manejo
import {
    ObjHandlerAltaProspecto
} from '../monitoreo';

@Component({
    selector: 'monitoreo-alta-prospecto',
    templateUrl: 'monitoreo-alta-prospecto.component.html',
    styleUrls: ['../monitoreo.component.css']
})

export class MonitoreoAltaProspecto extends ClassGenerica {
    public objHandler: ObjHandlerAltaProspecto = new ObjHandlerAltaProspecto();
    public formulario: FormGroup;
    public arrayFlujos: Array<object> = [];
    public arrayAsesor: Array<object> = [];
    public arrayTipoOperacion: Array<object> = [];

    constructor(private router: Router, private _serv: Service, private _notif: Notifications) {
        super();
        this.Init();
        this.ConsultarCatalogos('FLUJOS');
    }
    private Init(): void {
        this.formulario = new FormGroup({
            'busqueda': new FormControl(null, Validators.required),
            'rfc': new FormControl(null, Validators.required),
            'razonSocial': new FormControl(null, Validators.required),
            'flujo': new FormControl(null, [Validators.required]),
            'asesorVentas': new FormControl(null, [Validators.required])
        });
    }
    public SeleccionarOperacion(_evt: any): void {
        try {
            let op: number = Number(_evt.target.value);
            this.objHandler.setTipoOperacion(op);
            if (op === 2) {
                //Alta de Cuenta
                this.formulario = new FormGroup({
                    'busqueda': new FormControl(null, Validators.required),
                    'rfc': new FormControl(null, Validators.required),
                    'razonSocial': new FormControl(null, Validators.required),
                    'flujo': new FormControl(null, [Validators.required]),
                    'asesorVentas': new FormControl(null, [Validators.required])
                });
            } else if (op === 1) {
                //Alta de Empresa
                this.formulario = new FormGroup({
                    'rfc': new FormControl('', [ValidationService.validarRFCMoral, Validators.minLength(12), Validators.maxLength(12), Validators.required]),
                    'razonSocial': new FormControl('', Validators.required),
                    'flujo': new FormControl(null, [Validators.required]),
                    'asesorVentas': new FormControl(null, [Validators.required])
                });
            } else {
                this.Init();
            }
        } catch (e) {
            this.Init();
        }
    }
    private ConsultarCatalogos(_catalogo: string): void {
        switch (_catalogo.toUpperCase()) {
            case 'FLUJOS':
                super.loading(true);
                this._serv.post({ idFlujo: null }, '/api/traking/flujo/consulta', 3).subscribe((data: any) => {
                    try {
                        if (data.codE === 0) {
                            this.arrayFlujos = data.jsonResultado;
                            this.ConsultarCatalogos('ASESOR');
                        } else {
                            super.loading(false);
                            this._notif.info(data.msgE);
                        }
                    } catch (e) {
                        super.loading(false);
                        console.log(JSON.stringify(data));
                    }
                });
                break;
            case 'ASESOR':
                this._serv.post({ idAsesor: null }, '/api/traking/asesor/consulta', 3).subscribe((data: any) => {
                    try {
                        if (data.codE === 0) {
                            this.arrayAsesor = data.jsonResultado;
                            this.ConsultarCatalogos('TIPOOPERACION');
                        } else {
                            super.loading(false);
                            this._notif.info(data.msgE);
                        }
                    } catch (e) {
                        super.loading(false);
                        console.log(JSON.stringify(data));
                    }
                });
                break;
            case 'TIPOOPERACION':
                this._serv.post({}, '/api/traking/tflujo/consultatflujo', 3).subscribe((data: any) => {
                    super.loading(false);
                    console.log(JSON.stringify(data));
                    try {
                        if (data.codE === 0) {
                            this.arrayTipoOperacion = data.jsonResultado;
                        } else {
                            this._notif.info(data.msgE);
                        }
                    } catch (e) {
                        console.log(JSON.stringify(data));
                    }
                });
                break;
        }
    }
    public Guardar(_data: any): void {
        let jsonSend: any = {
            "rfc": _data.rfc.toUpperCase(),
            "razonSocial": _data.razonSocial.toUpperCase(),
            "idFlujo": _data.flujo,
            "idAsesor": _data.asesorVentas,
            "usuario": super.isKeyUser()
        };
        super.loading(true);
        this._serv.post(jsonSend, '/api/traking/empresa/alta', 3).subscribe((data: any) => {
            super.loading(false);
            try {
                if (data.codE === 0) {
                    this._notif.success(data.msgE);
                    this.Init();
                    setTimeout(() => {
                        this.Regresar();
                    }, 1000);
                } else {
                    this._notif.info(data.msgE);
                }
            } catch (e) {
                console.log(JSON.stringify(data));
            }
        });
    }
    /* regresar al menu anterior*/
    public Regresar(): void {
        this.router.navigate(['./reportes/monitoreo']);
    }
}
