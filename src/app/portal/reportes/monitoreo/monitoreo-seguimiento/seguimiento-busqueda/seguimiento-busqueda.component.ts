/*
 * @version 1.0 (21-11-2017)
 * @author lfgonzalezr
 * @description Monitoreo de instituciones
 * @contributors Front-end team
 */
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
//Componentes de Portal
import { Ng2Tables } from '../../../../../ng2-tables/ng2-tables.component';
import { ConfigNgTable2, PagesHandler } from '../../../../../ng2-tables/ng2-tables';
import { FilterTable } from '../../../../../pipes/pipes-portal';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ClassGenerica } from '../../../../../classGeneric/config';
import { Notifications } from '../../../../../classGeneric/notifications';
import { Service } from '../../../../../service/service';
//Variables de manejo
import {
    ObjHandlerMonitoreoSeguimiento
} from '../../monitoreo';

@Component({
    selector: 'monitoreo-seguimiento',
    templateUrl: 'seguimiento-busqueda.component.html',
    styleUrls: ['../../monitoreo.component.css']
})

export class MonitoreoSeguimientoBusqueda extends ClassGenerica {
    @ViewChild('tablainstituciones') tablaInstituciones: Ng2Tables;
    public objHandler: ObjHandlerMonitoreoSeguimiento = new ObjHandlerMonitoreoSeguimiento();
    private ph: PagesHandler = new PagesHandler();
    private Registros: any = [];
    private RegistrosGral: any = [];
    private strRegistros: string = '';
    public strInstitucion: any;

    constructor(private router: Router, private _serv: Service, private _notif: Notifications) {
        super();
        this.Consultar();
    }

    public PressSearch(_evt: any): void {
        try {
            let _str: string = _evt.target.value;
            this.Registros = new FilterTable().transform(this.RegistrosGral, _str);
            this.tablaInstituciones.SetTabla(new ConfigNgTable2(this.Registros.length, 10));
        } catch (e) { }
    }
    public ClearInput(): void {
        this.strRegistros = '';
        this.objHandler.setTabVisible('init');
    }
    private Consultar(): void {
        super.loading(true);
        this._serv.post({ idAsesor: null }, '/api/traking/empresa/consultaEmpresaFlujos', 3).subscribe((data: any) => {
            super.loading(false);
            try {
                if (data.codE === 0) {
                    if (data.jsonResultado.length > 0) {
                        this.objHandler.setTabVisible('conRegistros');
                        this.RegistrosGral = data.jsonResultado;
                        this.Registros = new FilterTable().transform(this.RegistrosGral, '');
                        setTimeout(() => {
                            this.tablaInstituciones.SetTabla(new ConfigNgTable2(this.Registros.length, 10));
                        }, 0);
                    } else {
                        this.objHandler.setTabVisible('sinRegistros');
                    }
                } else {
                    this.objHandler.setTabVisible('sinRegistros');
                    this._notif.info(data.msgE);
                }
            } catch (e) {
                console.log(JSON.stringify(data));
            }
        });
    }
    //Ordenamiento de la tabla por numeros
    private SortTableByNumber(_item: any): void {
        this.Registros.sort(function(a: any, b: any) {
            return a[_item] - b[_item];
        });
    }
    //Ordenamiento de la tabla por string
    private SortTableByString(_item: any): void {
        this.Registros.sort(function(a: any, b: any) {
            return (a[_item] > b[_item]) ? 1 : ((b[_item] > a[_item]) ? -1 : 0);
        });
    }
    //Actualiza la tabla de las instituciones
    private ActualizarTabla(_config: any): void {
        this.ph = _config;
    }
    /* regresar al menu anterior*/
    public Regresar(): void {
        this.router.navigate(['./reportes/monitoreo']);
    }
    private Validacion(_item: object): void {
        super.saveData(_item, 'institucion');
        this.router.navigate(['./reportes/monitoreo/seguimiento/validacion']);
    }
}
