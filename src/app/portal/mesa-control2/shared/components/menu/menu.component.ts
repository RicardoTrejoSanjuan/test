
import { Component} from '@angular/core';
import { Permission } from './../../models/permission';
import { ClassGenerica } from './../../../../../classGeneric/config';
import { Notifications } from '../../../../../classGeneric/notifications';
import { Service } from '../../../../../service/service';
import { MenuController, UserPermissions } from './menuController';
import { Menu } from '../../models/menu';

@Component({
    selector: 'mesa-control-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['../../../../css-menu/menu.component.css']
})
export class MesaControlDosMenu extends ClassGenerica{
    private userPermissions = new UserPermissions();
    public listMenu: Array<Menu>;
    private permission: Permission;
    private menuController: MenuController;

    constructor(private service: Service, private notifications?: Notifications) {
        super();
        this.menuController = new MenuController(service);
        this.ConsultaPermisos();
    }

    //Consulta de permisos de mesa de control
    private async ConsultaPermisos() {
        super.loading(true); 
        let response = await this.menuController.getPermissions();
        super.loading(false); 
        if (response.codE === 0) {
            if (super.isValid(response.jsonResultado)) {
                this.permission = this.userPermissions.setPermissions(response.jsonResultado);
                this.ShowMenuAvailable();
            } else {
                this.notifications.alert('Mesa Control', 'No se ha obtenido una respuesta adecuada del servidor');
            }
        } else {
            this.notifications.error('Mesa Control', 'No se ha obtenido una respuesta adecuada del servidor');
        };
    }

    private ShowMenuAvailable(): Menu[] {
        let _menu: Menu;
        _menu = this.menuController.getMenu();
        console.log(_menu)

        // remover
        // _menu.child.push(new Menu(null, "azul-02", "azul-02-active", "azul-02-menu", "Corrección de solicitudes", 10305, 10300, "icon-list-ul", "Corrección", "/mesa-control2/correccion"));
        // end remover
        
        if (_menu.child === null) {
            _menu.child = [];
        }        
        return this.listMenu = this.setMenus(_menu.child);
    }

    //Set de menus para los usuarios
    private setMenus(_children: Menu[]): Menu[] {
        return _children.filter((_child: any) => {
            if (_child.url === '/mesa-control2/captacion' && (this.permission.Analista || this.permission.Consulta)) {
                return _child;
            } else if (_child.url === '/mesa-control2/credito' && this.permission.Credito) {
                return _child;
            } else if (_child.url === '/mesa-control2/reportes' && this.permission.Reportes) {
                return _child;
            } else if (_child.url === '/mesa-control2/AsesorCentral' && this.permission.Asesor) {
                return _child;
            } else if (_child.url === 'coloque-aqui-la-url-mantenimientos' && (this.permission.Analista && this.permission.Consulta && this.permission.Credito && this.permission.Reportes)) {
                return _child;
            }
            
        });
    }
}
