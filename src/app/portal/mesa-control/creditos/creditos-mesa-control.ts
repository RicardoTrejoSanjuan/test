
export class Institucion {
    constructor(private dInstitucion: number, private idPais: number, private nombre: string, private talCreditos: number, private totalEmpleadosCredito: number) { }
}

export class Producto {
    constructor(private idProducto: number, private producto: string) { }
}
export class FotoCU {
    constructor(private pais: number, private canal: number, private sucursal: number, private folio: number) { }
}

export class ObjHandlerBusqueda {
    private queryRegisters: boolean = false;
    public showRegisters: boolean = false;
    public showFilters: boolean = false;
    private newQuery: boolean = false;
    private queryDates: boolean = false;
    public tipoUsuario: boolean = false;
    constructor() { }
    public setTipoUsuario(_value: boolean): void {
        this.tipoUsuario = _value;
    }
    public setFilters(_value: boolean): void {
        this.showFilters = _value;
    }
    public setRegisters(_value: boolean): void {
        this.showRegisters = _value;
    }
    public setQueryRegisters(_value: boolean): void {
        this.queryRegisters = _value;
    }
    public getQueryRegisters(): boolean {
        return this.queryRegisters;
    }
    public setStateNewQuery(_value: boolean): void {
        this.newQuery = _value;
    }
    public getStateNewQuery(): boolean {
        return this.newQuery;
    }
    public setQueryDates(_value: boolean): void {
        this.queryDates = _value;
    }
    public getQueryDates(): boolean {
        return this.queryDates;
    }
}

export class JsonRequest {
    private pagina: number;
    private idProducto: number;
    private busqueda: string;
    private statusRevision: number;
    private fechaFin: string;
    private fechaInicio: string;
    constructor(private idInstitucion: number, private empresaNombre: string, private idPais: number) {
        this.pagina = 1;
        this.idProducto = null;
        this.busqueda = null;
        this.statusRevision = null;
        this.fechaFin = null;
        this.fechaInicio = null;
    }
    public setIdProducto(_value: any): void {
        this.idProducto = this.validateValue(_value);
    }
    public setPagina(_value: any): void {
        this.pagina = _value;
    }
    public setBusqueda(_value: any): void {
        this.busqueda = this.validateValue(_value);
    }
    public setStatusRevision(_value: any): void {
        this.statusRevision = this.validateValue(_value);
    }
    public setFechaInit(_value: any): void {
        this.fechaInicio = _value;
    }
    public setFechaFin(_value: any): void {
        this.fechaFin = _value;
    }
    public get(): object {
        let json: any = {};
        for (let index in this) {
            if (this.hasOwnProperty(index)) {
                if (index !== 'fechaInicio' && index !== 'fechaFin') {
                    json[index] = this[index];
                } else if (this[index] !== null) {
                    json[index] = this[index];
                }
            }
        }
        return json;
    }
    public getNombreEmpresa(): any {
        return this.empresaNombre || 'Empresa';
    }
    private validateValue(_value: any): any {
        if (typeof (_value) === 'undefined' || _value === 'null' || _value === '') {
            return null;
        }
        return _value;
    }
}

/* CLASES PARA MANEJO DE DOCUMENTOS DE CREDITO  */
export class ClienteTienda {
    constructor(private clienteTienda: string) { }
}

export class DocumentoUrl {
    constructor(private url) { }
}

export class DocumentoDescargable {
    constructor(private clienteTienda: number, private tipoDocumento: number) { }
}

export class DocumentosCredito {
    constructor(private active: boolean, private idDocumento: number, private rutasHttp: string[], private title: any) { }
}

export class NotasCredito {
    constructor(private idSolicitud: string) { }
}

export class ObjHandlerDocumentos {
    private btnRevisar: boolean;
    public notas: boolean;
    private titleDocument: string;
    private lastDocument: any;
    public modalNuevoComentario: boolean;
    public modalRevisado: boolean;
    public alertMsgE: boolean;
    public loading: boolean;
    public tipoUsuario: boolean;
    constructor() {
        this.btnRevisar = false;
        this.notas = false;
        this.titleDocument = 'Documento';
        this.lastDocument = null;
        this.modalNuevoComentario = false;
        this.modalRevisado = false;
        this.alertMsgE = false;
        this.loading = false;
        this.tipoUsuario = false;
    }
    public setBtnRevisar(_value: any): void {
        if (this.lastDocument.idDocumento === _value.idDocumento) {
            this.btnRevisar = true;
        }
    }
    public setNotas(_value: boolean): void {
        this.notas = _value;
    }
    public setTipoUsuario(_value: boolean): void {
        this.tipoUsuario = _value;
    }
    public getTipoUsuario(): boolean {
        return this.tipoUsuario;
    }
    public setTitleDocument(_value: string): void {
        this.titleDocument = _value;
    }
    public getTitleDocument(): string {
        return this.titleDocument;
    }
    public setLastDocument(_value: any): void {
        this.lastDocument = _value;
    }
    public setModalNuevoComen(_value: boolean): void {
        this.modalNuevoComentario = _value;
    }
    public setModalRevisado(_value: boolean): void {
        this.modalRevisado = _value;
    }
    public setAlertMsgE(_value: boolean): void {
        this.alertMsgE = _value;
    }
    public setLoading(_value: boolean): void {
        this.loading = _value;
    }
}
