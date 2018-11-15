import { Component, Output, EventEmitter } from '@angular/core';
import { Pages, PagesHandler, ConfigNgTable2 } from './ng2-tables';

@Component({
    selector: 'ng2-table',
    templateUrl: 'ng2-tables.component.html',
})
export class Ng2Tables {
    /*Evento para actualizar las paginas visibles de la tabla*/
    @Output() update = new EventEmitter();
    //Declaracion de variables para el manejo de la tabla
    private pagesHandler: any = new PagesHandler();
    private configNgTable2: any = new ConfigNgTable2(0, 10);
    public pages: Pages[] = [];
    private pageActive: any = new Pages('1', 1);
    public ph: any = new PagesHandler();

    constructor() { }

    public SetTabla(_config: any): void {
        this.configNgTable2 = new ConfigNgTable2(_config.total, _config.regPorPage);
        this.pagesHandler.final = Math.ceil(_config.total / _config.regPorPage);
        this.pages = [];
        this.selectPage(new Pages('1', 1));
        setTimeout(() => {
            for (let i = 0; i < this.pagesHandler.final; i++) {
                let page: any = new Pages((i + 1).toString(), i + 1);
                if (i === 0) { page._active = true; }
                this.pages.push(page);
            }
        }, 0);
    }

    private selectPage(_page: any): void {
        this.updateActivate(_page);
        let active: any = _page;
        if (_page._page >= 8) {
            let newPage: any = new Pages((active._page + 1).toString(), active._page + 1);
            this.EventosPrivate(newPage);
        } else {
            let newPage: any = new Pages((active._page - 1).toString(), active._page - 1);
            this.EventosPrivate(newPage);
        }
    }
    private updateActivate(_page: any): void {
        this.pageActive = _page;
        this.pages.filter((_item: any) => {
            _item._active = (_page._page === _item._page) ? true : false;
        });
        let config: any = new PagesHandler();
        config.init = (_page._page - 1) * this.configNgTable2.getRegPorPage();
        config.final = _page._page * this.configNgTable2.getRegPorPage();
        this.update.emit(config);
    }
    private primero(): void {
        let newPage: any = new Pages('1', 1);
        this.updateActivate(newPage);
        this.EventosPrivate(newPage);
    }
    public anterior(): void {
        if (this.pageActive._page - 1 > 0) {
            let active: any = this.pageActive;
            let newPage: any = new Pages((active._page - 1).toString(), active._page - 1);
            this.updateActivate(newPage);
            this.EventosPrivate(newPage);
        }
    }
    public siguiente(): void {
        if (this.pageActive._page + 1 <= this.pagesHandler.final) {
            let active: any = this.pageActive;
            let newPage: any = new Pages((active._page + 1).toString(), active._page + 1);
            this.updateActivate(newPage);
            this.EventosPrivate(newPage);
        }
    }
    private ultimo(): void {
        let newPage: any = new Pages(this.pagesHandler.final.toString(), this.pagesHandler.final);
        this.updateActivate(newPage);
        this.EventosPrivate(newPage);
    }
    private EventosPrivate(page: any): void {
        if (page._page > 8) {
            this.ph.init = page._page - 8;
            this.ph.final = page._page;
        } else {
            this.ph.init = 0;
            this.ph.final = 8;
        }
    }
}
