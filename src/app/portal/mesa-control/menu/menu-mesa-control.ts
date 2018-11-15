
export class MenuMesaControl {
    private arr: any;
    private analista: boolean;
    private consulta: boolean;
    private credito: boolean;
    private reportes: boolean;
    constructor() {
        this.arr = [];
        this.analista = false;
        this.consulta = false;
        this.credito = false;
        this.reportes = false;
    }
    public setPermisos(_permisos: any): void {
        _permisos.filter((_item: any) => {
            if (Number(_item.rol) === 1) {
                this.consulta = true;
            } else if (Number(_item.rol) === 2) {
                this.analista = true;
            } else if (Number(_item.rol) === 3) {
                this.reportes = true;
            } else if (Number(_item.rol) === 4) {
                this.credito = true;
            }
        });
    }
    public setMenus(_menus: any): void {
        this.arr = _menus.filter((_item: any) => {
            if (_item.url === '/mesa-control/captacion' && (this.analista || this.consulta)) {
                return _item;
            } else if (_item.url === '/mesa-control/credito' && this.credito) {
                return _item;
            } else if (_item.url === '/mesa-control/reportes' && this.reportes) {
                return _item;
            } else if (_item.url === 'coloque-aqui-la-url-mantenimientos' && (this.analista && this.consulta && this.credito && this.reportes)) {
                return _item;
            }
        });
    }
    public getMenus(): any {
        return this.arr;
    }
}

export class PermisosUsuarios {
    constructor(private idAnalista: string) { }
}
