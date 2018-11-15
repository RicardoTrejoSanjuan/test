
export class RubroActivo {
    constructor(public comentario: string, public visible: boolean) { }
}

export class Activo {
    private active: boolean = false;
    private claseActive: string = 'naranja-04-ico';
    private claseFondo: string = 'naranja-04-ico';
    private claseico: string = 'naranja-04-ico';
    private comentario: any = null;
    private hidden: boolean = false;
    private icon: string = '';
    private idDocumento: any = null;
    private idRechazo: any = null;
    private idRubro: number = null;
    private idStatusRevision: any = null;
    private status: string = '';
    private textoMenu: string = 'Documentos';

    constructor() { }

    public setActivo(_data: any): void {
        console.log(_data);
        for (let index in _data) {
            if (this.hasOwnProperty(index)) {
                this[index] = _data[index];
            }
        }
        console.log('this: ', JSON.stringify(this));
    }
    public getRubroActivo(): number {
        return this.idRubro;
    }
}

export class HandlerModal {
    private reqMotivo: boolean = false;
    private required: boolean = false;
    constructor() { }
}

export class HistorialNombres {
    private array: any = new Array<any>();
    constructor(private data: any, private usuario: any) {
        if (data.length !== 0) {
            this.array = data.filter((item: any) => {
                for (let i in item) {
                    if (item.hasOwnProperty(i)) {
                        item[i] = item[i] === null || item[i] === undefined ? i : item[i];
                    }
                }
                return item;
            });
        } else {
            this.array.push({
                nombreEmpleado: usuario.nombre,
                apellidoPaternoEmpleado: usuario.apellidoPaterno,
                apellidoMaternoEmpleado: usuario.apellidoMaterno,
                fechaNacimientoEmpleado: 'N/A',
                fechaCreacion: '',
                usuarioCreacion: 'N/A',
                nombreAsesor: ''
            });
        }
    }
    get(): Array<any> {
        return this.array;
    }
}

export class Fechas {
    private newDate: Object;
    constructor(private _date: any) {
        let mss: string[] = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        let date = new Date(_date);
        let dia: any = date.getDate();
        let mes: any = date.getMonth();
        let anio: any = date.getFullYear();
        this.newDate = { dia: dia < 10 ? '0' + dia : dia, mes: mss[mes], anio: anio };
    }
    getDate() {
        return this.newDate;
    }
}

export class ObjHandler {
    private stSolicitud: string = '';
    private docBuro: boolean = true;
    private docFATCA: boolean = true;
    private docCredito: boolean = false;
    private docAnexo: boolean = false;
    private vistaEnabled: number = 0;
    private modal1: boolean = false;
    private modalRechazar: boolean = false;
    private modalLiberar: boolean = false;
    private modalConfirmacion: boolean = false;
    private resumen: boolean = false;
    private tipoAnalista: boolean = false;
    private tipoIdentificacion: string = 'Tipo Identificación';
    private tipoComprobante: string = 'Tipo Comprobante';
    constructor() { }

    public setTipoIdentificacion(_value: any): void {
        console.log(_value);
        if (_value !== null && _value !== undefined && _value !== '') {
            if (_value.length > 0) {
                _value.filter((item: any) => {
                    if (item.idDocumento === 1) {
                        this.tipoIdentificacion = item.tipoDocumento;
                    } else if (item.idDocumento === 2) {
                        this.tipoComprobante = item.tipoDocumento;
                    }
                });
            }
        }
    }
    public setAnexoComision(_value: any): void {
        if (_value !== null) {
            _value = _value.toUpperCase();
            this.docAnexo = /^ACREQ/.test(_value);
        }
    }
}
