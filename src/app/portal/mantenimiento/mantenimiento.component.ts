import { Component, OnInit } from '@angular/core';
import { Service } from '../../service/service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ClassGenerica } from '../../classGeneric/config';
@Component({
    selector: 'mantenimiento',
    templateUrl: 'templates/mantenimiento.component.html',
    styleUrls: ['../css-menu/menu.component.css']
})

export class MantenimientoComponent extends ClassGenerica {
    public children: Object[];
    constructor(private service: Service, private router: Router){
        super();
        this.children = [];
         this.SetMenusVisibles();
    }

    private SetMenusVisibles(): void {
        let _dataPermisos: any = this.datapermisos().child;
        console.log(this.datapermisos().child);
        for (let item of _dataPermisos) {
             if (item.url === '/mantenimientos') {{}
                 this.children = item.child;
            }
        }
        console.log();
    }
    public Regresar(){
        this.router.navigate(['./dashboard']);
    }

}
