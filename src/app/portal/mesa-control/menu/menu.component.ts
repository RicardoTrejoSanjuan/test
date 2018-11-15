/*
 * @version 1.0 (01-06-2017)
 * @author lfgonzalezr
 * @description Muestra los menus a los que tienen acceso los usuarios logeados
 * @contributors Front-end team
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClassGenerica } from '../../../classGeneric/config';
import { MESA_CONTROL } from '../constants-url';
import { Notifications } from '../../../classGeneric/notifications';
import { Service } from '../../../service/service';
import { MenuMesaControl, PermisosUsuarios } from './menu-mesa-control';

@Component({
    selector: 'mesa-control-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['../../css-menu/menu.component.css']
})
export class MesaControlMenu extends ClassGenerica {
    private menus: MenuMesaControl = new MenuMesaControl();
    public children: Object[] = [];

    constructor(private service: Service, private router: Router, private notifications: Notifications) {
        super();
        this.ConsultaPermisos();
    }
    //Consulta de permisos de mesa de control
    private ConsultaPermisos(): void {
        super.loading(true);
        this.service.post(new PermisosUsuarios(super.isKeyUser()), MESA_CONTROL.permisosUser, 3).subscribe((data: any) => {
            super.loading(false);
            let response = JSON.parse(JSON.stringify(data));
            if (response.codE === 0) {
                if (super.isValid(response.jsonResultado)) {
                    this.menus.setPermisos(response.jsonResultado);
                    this.SetMenusVisibles();
                } else {
                    this.notifications.alert('Mesa Control', 'No se ha obtenido una respuesta adecuada del servidor');
                }
            } else {
                this.notifications.error('Mesa Control', 'No se ha obtenido una respuesta adecuada del servidor');
            }
        });
    }
    //Sete de menus para los usuarios
    private SetMenusVisibles(): void {
        let _dataPermisos: any = this.datapermisos().child;
        for (let item of _dataPermisos) {
            if (item.url === '/mesa-control') {
                this.menus.setMenus(item.child);
                this.children = this.menus.getMenus();
            }
        }
    }
    public Regresar() {
        this.router.navigate(['./dashboard']);
    }
}
