/*
 * @version 1.0 (09/10/2018)
 * @author rtrejo
 * @description Muestra los Tabs disponibles al usuario;
 * @contributors Front-end team
 */

import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Tab } from '../../models/tab';

@Component({
    selector: 'tab',
    templateUrl: 'tab.component.html',
    styleUrls: ['../../../mesa-control2.component.css']
})
export class Tabs {

    @Input() listTabs: Array<Tab> = [];
    @Input() _currentlyTab: Tab;
    @Output() setCurrentlyTab = new EventEmitter();

    constructor() { }

    ngOnChanges(changes: SimpleChanges) {
        this.updateStatus(this._currentlyTab.id);
    }

    private changeTab(_tab: Tab): void {
        let oldTab: Tab = this.getTab();
        if (oldTab.id != _tab.id) {
            this.updateStatus(_tab.id);
            _tab.status = true;
            this.setCurrentlyTab.emit(_tab)
        }
    }

    //Recupera TAB actualmente visualizando
    private getTab(): Tab {
        return this.listTabs.find(tab => tab.status === true);
    }

    private updateStatus(id: number): void {
        this.listTabs.map((tab: Tab) => {
            tab.status = tab.id === id ? true : false;
        });
    }
}