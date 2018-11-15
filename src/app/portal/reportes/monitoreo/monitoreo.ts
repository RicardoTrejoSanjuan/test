export class ObjHandlerMonitoreoSeguimiento {
    public tabVisible: number = 0;
    constructor() { }
    public setTabVisible(_val: string): void {
        if (_val === 'sinRegistros') {
            this.tabVisible = 2;
        } else if (_val === 'conRegistros') {
            this.tabVisible = 1;
        } else {
            this.tabVisible = 0;
        }
    }
}
export class ObjHandlerMonitoreoCatalogos {
    public tabVisible: number = 0;
    constructor() { }
    public setTabVisible(_val: string): void {
        if (_val === 'sinRegistros') {
            this.tabVisible = 2;
        } else if (_val === 'conRegistros') {
            this.tabVisible = 1;
        } else {
            this.tabVisible = 0;
        }
    }
    public getTabVisible(): boolean {
        if (this.tabVisible === 1) {
            return true;
        }
        return false;
    }
}
export class ObjHandlerMonitoreoConfiguracion {
    public tabVisible: number = 0;
    constructor() { }
    public setTabVisible(_val: string): void {
        if (_val === 'sinRegistros') {
            this.tabVisible = 2;
        } else if (_val === 'conRegistros') {
            this.tabVisible = 1;
        } else {
            this.tabVisible = 0;
        }
    }
}
export class ObjHandlerModal {
    public visible: boolean = false;
    public nuevo: boolean = false;
    public editar: boolean = false;
    public eliminar: boolean = false;
    public msgE: boolean = false;
    public msgEValue: string = '';
    constructor(private _tipo: string) {
        this.nuevo = false;
        this.editar = false;
        this.eliminar = false;
        switch (_tipo.toUpperCase()) {
            case 'ALTA':
                this.visible = true;
                this.nuevo = true;
                break;
            case 'EDITAR':
                this.visible = true;
                this.editar = true;
                break;
            default:
                break;
        }
    }
    public setMsgE(_val: boolean, _str?: string): void {
        this.msgE = _val;
        this.msgEValue = _val ? _str : '';
    }
}
export class ObjHandlerAltaProspecto {
    public tipoCuenta: boolean = false;
    public tipoEmpresa: boolean = false;
    public enabled: boolean = false;
    constructor() { }
    public setTipoOperacion(_val: number): void {
        this.tipoCuenta = false;
        this.tipoEmpresa = false;
        this.enabled = true;
        if (_val === 2) {
            this.tipoCuenta = true;
        } else if (_val === 1) {
            this.tipoEmpresa = true;
        } else {
            this.enabled = false;
        }
    }
}
export class HandlerMenus {
    constructor() { }
    public getMenus(_array: Array<any>, _url: string): ClassMenu {
        let Menus: ClassMenu = new ClassMenu(false, []);
        try {
            for (let i = 0; i < _array.length; i++) {
                if (_array[i].url === _url) {
                    Menus = new ClassMenu(true, _array[i].child);
                    break;
                } else if (_array[i].child !== null) {
                    let Menus_: ClassMenu = this.getMenus(_array[i].child, _url);
                    if (Menus_.getValid()) {
                        Menus = new ClassMenu(true, Menus_.getArraysMenus());
                        break;
                    }
                }
            }
            return Menus;
        }
        catch (e) { }
    }
}
export class ClassMenu {
    constructor(private valid: boolean, private arrayMenus: Array<object>) { }
    public getValid() {
        return this.valid;
    }
    public getArraysMenus() {
        return this.arrayMenus;
    }
}
