/*
 * @version 1.0 (09/10/2018)
 * @author rtrejo
 * @description Muestra las solicitudes que se encuentras en mesa de control (Pendientes por revision, Devueltas, Rechazadas y Liberadas)
 * @contributors Front-end team
 */

/* IMPORTACION GENERAL */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Pagination } from '../../../../classGeneric/pagination';
import { RevisionSolicitudService } from '../revisionSolicitud.service';
import * as _ from 'underscore';
import { BandejaController } from './bandejasController';
import { Tab } from '../../shared/models/tab';
import { Parameter, Page } from '../../shared/models/page';
import { Notifications } from '../../../../classGeneric/notifications';
import { Employee } from '../../shared/models/employee';
import { Search, Column } from '../../shared/models/search';

@Component({
    selector: 'mesa-control-bandejas',
    templateUrl: 'bandejas.component.html',
    styleUrls: ['../../mesa-control2.component.css']
})

export class MesaControlDosBandejas extends Pagination {

    private currentlytab: Tab = new Tab();
    public tabs: Tab[];
    public parameterSolicitud: Parameter = new Parameter();
    public listEmployee: Employee[];
    public resultRequest: any;
    public pageDetail: Page;
    public textSearch: string;
    public columns: Column[];

    constructor(private router: Router, private revisionService: RevisionSolicitudService, private notifications?: Notifications, private controller?: BandejaController) {
        super();

        this.tabs = this.currentlytab.getTabsBandeja();
        this.columns = this.controller.getColumnsTable();
        this.currentlytab = this.tabs.find(tab => tab.id == 0);

        //Carga de la primera bandeja de solicitudes
        let _lastRequest: any = super.getAttr('lastRequest');
        if (_lastRequest !== null) {
            this.loadLastRequest(_lastRequest);
        } else {
            this.parameterSolicitud = this.parameterSolicitud.setParameter({ idrol: 101, pagina: 1, busqueda: null, estado: 0, ordenpor: null, orden: null, _tab: 0 });
            this.loadTableRequest(1);
        }
    }

    // Metodo para obtener la informacion de la vista
    private async loadTableRequest(page: number) {
        let _parameterSolicitud = JSON.parse(JSON.stringify(this.parameterSolicitud));
        _parameterSolicitud.pagina = page;

        super.loading(true);
        this.resultRequest = await this.controller.getRequest(_parameterSolicitud);
        super.loading(false);
        this.resultRequest = JSON.parse(JSON.stringify(this.resultRequest));

        this.resultRequest.consulta = this.currentlytab.id == 0 ? this.controller.cleanJsonEmployee(this.resultRequest.consulta) : this.resultRequest.consulta;
        let list: Employee[] = this.controller.fieldImage(this.resultRequest.consulta);
        this.resultRequest.consulta = list;
    }

    // Metodo para cambiar de pagina
    private setPage(_page: Page): void {
        this.parameterSolicitud.pagina = _page.currentPage;
        this.loadTableRequest(_page.nextPage);
    }

    // Metodo para buscar
    private setSearch(_search: Search): void {
        this.parameterSolicitud.busqueda = _search.text;
        this.parameterSolicitud.pagina = 1;

        this.loadTableRequest(1);
    }

    // Metodo para abrir el expediente
    private async getRecord(_employee: Employee) {
        let status: Number = this.currentlytab.id;
        if (status === 0) {
            super.loading(true);
            let resultAvailable = await this.controller.getAvailable({ idSolicitud: _employee.folio });
            super.loading(false);
            if (resultAvailable != 0) {
                _employee.analista = resultAvailable.analist == 0 ? true : false;
                super.saveData(_employee, "Usuario");
                this.redirectPath();
            }
        } else {
            _employee.analista = true;
            super.saveData(_employee, "Usuario");
            
            this.redirectPath()
        }
    }

    private redirectPath(): void {
        this.parameterSolicitud.origen = 'CAPTACION'
        super.saveData(this.parameterSolicitud, 'lastRequest');
        if ([0, 5, 3, 4, 5].indexOf(this.currentlytab.id) != -1) {
            this.router.navigate(['./mesa-control2/captacion/solicitud']);
        } else if ([21, 22, 23].indexOf(this.currentlytab.id) != -1) {
            this.router.navigate(['./mesa-control2/captacion/solicitud/documento']);
        }
    }

    // Metodo para la carga de la ultima consulta
    private loadLastRequest(_lastRequest: Parameter): void {
        this.parameterSolicitud = _lastRequest;
        this.textSearch = this.parameterSolicitud.busqueda;
        this.currentlytab = this.tabs.find(tab => tab.id == this.parameterSolicitud.estado);
        this.loadTableRequest(1);
        this.cleanStaroge()
    }

    //Metodo para cambio de Tab
    private changeTab(_tab: Tab): void {
        this.currentlytab = _tab;
        this.revisionService.setEsBandejaEspecial(_tab.id === 0 ? true : false);
        this.parameterSolicitud.busqueda = null;
        this.textSearch = null;
        this.parameterSolicitud.pagina = 1;
        this.parameterSolicitud.estado = this.currentlytab.id;
        this.loadTableRequest(1);
    }

    private cleanStaroge(): void {
        super.saveData(null, 'Usuario');
        super.saveData(null, 'lastRequest');
    }
}