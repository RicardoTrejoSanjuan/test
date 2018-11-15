import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClassGenerica } from '../../../classGeneric/config';
import { Notifications } from '../../../classGeneric/notifications';
import { Service } from '../../../service/service';

@Component({
    selector: 'mesa-control-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['../../css-menu/menu.component.css']
})
export class MantenimientosInternosMenu extends ClassGenerica {

    public children: Object[];
    constructor(private router: Router) {
        super();
        this.children = [];
        this.SetMenusVisibles();
    }

    private SetMenusVisibles(): void {
        let _dataPermisos: any = this.datapermisos().child;
        console.log(_dataPermisos);
        for (let item of _dataPermisos) {
            if (item.url === '/mantenimientos-internos') {
                this.children = item.child;
            }
        }
    }


    public Regresar(){
        this.router.navigate(['./dashboard']);
    }
}
