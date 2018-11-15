import { Component, OnInit } from '@angular/core';
import { Service } from '../../service/service';
import { Router, RouterLink } from '@angular/router';
import { ClassGenerica } from '../../classGeneric/config';
@Component({
    selector: 'centralizacion-cuentas',
    templateUrl: './centralizacion-cuentas.component.html',
    styleUrls: ['../css-menu/menu.component.css']
})

export class CentralizacionCuentasComponent extends ClassGenerica {
    public children: Object[];
    constructor(private service: Service, private router: Router){
        super();
        this.children = [];
         this.SetMenusVisibles(); 
         super.saveData("",'institucionCent');
    }

    private SetMenusVisibles(): void {
        let _dataPermisos: any = this.datapermisos().child;
        console.log(this.datapermisos().child);
        for (let item of _dataPermisos) {
             if (item.url === '/centralizacion-cuentas') {
                 this.children = item.child;
            }
        }
        console.log();
    }
    public Regresar(){
        this.router.navigate(['./dashboard']);
    }

}
