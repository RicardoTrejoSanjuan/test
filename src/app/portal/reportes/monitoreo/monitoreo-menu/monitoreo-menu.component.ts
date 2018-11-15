/*
 * @version 1.0 (21-11-2017)
 * @author lfgonzalezr
 * @description Monitoreo de instituciones
 * @contributors Front-end team
 */

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClassGenerica } from '../../../../classGeneric/config';
/* importacion de clases de manejo */
import {
    HandlerMenus
} from '../monitoreo';

@Component({
    selector: 'monitoreo-menu',
    templateUrl: 'monitoreo-menu.component.html',
    styleUrls: ['../../../css-menu/menu.component.css']
})

export class MonitoreoMenu extends ClassGenerica {
    public children: Array<object> = [];
    constructor(private router: Router) {
        super();
        console.log('MonitoreoMenu');
        let menus: any = this.datapermisos().child;
        let handlerMenus: HandlerMenus = new HandlerMenus();
        let arrayMenus: any = handlerMenus.getMenus(menus, '/reportes/monitoreo');
        this.children = arrayMenus.arrayMenus;
    }
    /* regresar al menu anterior*/
    public Regresar() {
        this.router.navigate(['./reportes']);
    }
}
