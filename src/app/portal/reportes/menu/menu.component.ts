import { Component } from '@angular/core';
import { Router } from '@angular/router';


import * as moment from 'moment';

import { ClassGenerica } from '../../../classGeneric/config';

@Component({
    selector: 'reportes-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['../../css-menu/menu.component.css']
})
export class ReportesMenu extends ClassGenerica {

    child: Array<Object>;
    public children: Object[];

    constructor(private router: Router) {
        super();
        this.children = [];
        this.SetMenusVisibles();
    }

    private SetMenusVisibles(): void {
        let _dataPermisos: any = this.datapermisos().child;
        console.log(this.datapermisos().child);
        for (let item of _dataPermisos) {
             if (item.url === '/reportes') {
                 this.children = item.child;
            }
        }
        console.log();
    }
    public Regresar() {
        this.router.navigate(['./dashboard']);
    }
}
