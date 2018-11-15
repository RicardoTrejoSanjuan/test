import { Component, OnInit } from '@angular/core';
import { Service } from '../../service/service';
import { Router } from '@angular/router';
import { ClassGenerica } from '../../classGeneric/config';
@Component({
    selector: 'mantenimiento',
    templateUrl: 'templates/mantenimiento.component.html',
    styleUrls: ['../css-menu/menu.component.css']
})

export class DepositoMenuComponent extends ClassGenerica {
    public children: Object[];
    constructor(private service: Service, private router: Router){
        super();
        this.children = [];
         this.SetMenusVisibles();
    }

    private SetMenusVisibles(): void {
        super.saveData(null,'depositos');
        
        let _dataPermisos: any = this.datapermisos().child;
        for (let item of _dataPermisos) {
             if (item.url === '/depositos-referenciado') {
                 this.children = item.child;
            }
        }
    }
    public Regresar(){
        this.router.navigate(['./dashboard']);
    }

}
