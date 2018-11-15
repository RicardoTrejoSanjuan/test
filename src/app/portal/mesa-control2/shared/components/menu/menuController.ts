import { MESA_CONTROL } from './../../constants/constants-url';
import { ServiceMCService } from './../../services/serviceMC.service';
import { Permission } from './../../models/permission';
import { Menu } from './../../models/menu';
import { ClassGenerica } from './../../../../../classGeneric/config';
import { Service } from '../../../../../service/service';

export class MenuController extends ClassGenerica {

    private menu = new Menu();

    constructor(private service?: Service, private serviceMC?: ServiceMCService){
        super();
        this.serviceMC = new ServiceMCService(service);
    };

    public getPermissions(): any {
        return this.serviceMC.callPost(new UserPermissions(super.isKeyUser()), MESA_CONTROL.permisosUser, 3).then(result => {
            return result;
        });
    }

    public getMenu(): Menu {
        let _menu = this.datapermisos().child;
        return this.setMenu(_menu);
    }

    private setMenu(listMenu: any): Menu {
        let _menu:Menu;
        let menuOpt = listMenu.filter((menuElement) => { return menuElement.url === '/mesa-control2' });
        if (menuOpt.length > 0) {
            _menu = new Menu(
                menuOpt[0].child,
                menuOpt[0].claseFondo,
                menuOpt[0].claseIcono,
                menuOpt[0].color,
                menuOpt[0].descripcion,
                menuOpt[0].idMenu,
                menuOpt[0].idMenuParent,
                menuOpt[0].imagen,
                menuOpt[0].textoMenu,
                menuOpt[0].url
            );
        }
        return _menu;
    }
}

export class UserPermissions {

    constructor(private idAnalista?: string) { }

    public setPermissions(_permission: any): Permission {
        let permissionObj = new Permission();
        _permission.filter((element) => {
            switch (element.rol) {
                case '1':
                    permissionObj.Consulta = true;
                    break;
                case '2':
                    permissionObj.Analista = true;
                    break;
                case '3':
                    permissionObj.Reportes = true;
                    break;
                case '4':
                    permissionObj.Credito = true;
                    break;
                case '5':
                    permissionObj.Asesor = true;
                    break;    
                default:
                    break;
            }
        })

        return permissionObj;
    }
}
