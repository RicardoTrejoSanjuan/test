/*
 * @version 1.0 (09/10/2018)
 * @author rtrejo
 * @description Muestra las solicitudes que se encuentras en mesa de control (Pendientes por revision, Devueltas, Rechazadas y Liberadas)
 * @contributors Front-end team
 */

import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Search, Column } from '../../models/search';
import { Page } from './../../models/page';
import * as _ from 'underscore';
import { Tab } from '../../models/tab';
import { Pagination } from './../../../../../classGeneric/pagination';
import { CatalogosMC } from './../../constants/constants-mesa-control';

@Component({
    selector: 'workQueue',
    templateUrl: 'workqueue.component.html',
    styleUrls: ['../../../mesa-control2.component.css']
})
export class WorkQueue extends Pagination {

    @Input() _resultRequest: any;
    @Input() _flagSeaarch: boolean;
    @Input() _search: string;
    @Input() _currentlyTab: Tab;
    @Input() _columns: Column;

    @Output() setPageParent = new EventEmitter();
    @Output() setSearchParent = new EventEmitter();
    @Output() getRecordParent = new EventEmitter();

    public search: Search = new Search();
    public listData: any;
    public pageDetail: Page;
    public page: number;
    public currentlytab: Tab;
    public initialized=false;

    constructor(private catalogos: CatalogosMC) {
        super();
        this.page = 1;
    }

    ngOnInit(): void {
        this.search.text = this._search;
        this.workQueueDetail();
        this.currentlytab = this._currentlyTab;
        this.initialized = true;
    }

    ngOnChanges(changes: SimpleChanges) {
        if(this.initialized){
            this.updateTab(this.currentlytab, this._currentlyTab);
            this.workQueueDetail();
            this.currentlytab = this._currentlyTab;
        }
    }

    private workQueueDetail() {
        this.pageDetail = this.getPager(this._resultRequest.total, this.page, this._resultRequest.rango);
        this.addItemToArray(this.pageDetail, this._resultRequest.consulta, this._resultRequest.rango, this._resultRequest.total);
        this.listData = _.where(this.objectArrayPaginate, { page: this.pageDetail.currentPage });
    }

    // Obtener color de iconos
    private catColores(_idBloq: Number): String {
        return this.catalogos.getColorExpediente(this._currentlyTab.id, _idBloq);
    }

    // Paginado de registros para mostrar en la bandeja
    private setPage(event, page: number, rango?: number, total?: number): void {
        let _page = new Page();
        _page.currentPage = page;
        _page.rango = rango;
        _page.total = total;

        if (_page.currentPage < 1 || _page.currentPage > this.pageDetail.totalPages) {
            return;
        }

        let countPages = _.where(this.objectArrayPaginate, { page: _page.currentPage });
        if (countPages.length === 0) {
            _page.nextPage = this.pageToVisited(_page.currentPage);
            this.page = _page.currentPage;
            this.setPageParent.emit(_page);
        } else {
            this.pageDetail = this.getPager(_page.total, _page.currentPage, _page.rango);
            this.listData = _.where(this.objectArrayPaginate, { page: _page.currentPage });
        }
    }

    private getRecord(_record: any): void {
        this.getRecordParent.emit(_record);
    }

    // Consulta y recarga de las solicitudes de las bandejas de mesa de control
    private eventSearch(): void {
        if (this.search.text.length > 3) {
            this.setSearchParent.emit(this.search);
            this.page = 1;
        } else {
            if (this.search.previousSearch != undefined && this.search.previousSearch.length > 3) {
                let _search = new Search();
                _search.text = null
                this.setSearchParent.emit(_search);
                this.page = 1;
            }
        } this.search.previousSearch = this.search.text;
    }

    // Borrar y limpiar busqueda
    private cleanSearch(): void {
        this.search = new Search();
        this.setSearchParent.emit(this.search);
    }

    // Actualiza la info si hay tabs
    private updateTab (lastTab: Tab, newTabTab): void {
        if (lastTab.id == newTabTab.id) {
            return;
        } else {
            this.search = new Search();
            this.page = 1;
        }
    }
}