/*
 * @version 1.0 (09/10/2018)
 * @author rtrejo
 * @description Interfas del elemento Empleado
 * @contributors Front-end team
 */

export interface IPage {
    totalItems?: number,
    currentPage?: number,
    pageSize?: number,
    totalPages?: number,
    startPage?: number,
    endPage?: number,
    startIndex?: number,
    endIndex?: number,
    pages?: Array<number>,
    rango?: number,
    total?: number,
    nextPage?: number
}

export class Page implements IPage {
    constructor(
        public totalItems?: number,
        public currentPage?: number,
        public pageSize?: number,
        public totalPages?: number,
        public startPage?: number,
        public endPage?: number,
        public startIndex?: number,
        public endIndex?: number,
        public pages?: Array<number>,
        public rango?: number,
        public total?: number,
        public nextPage?: number
    ) { };

}

export interface IParameter {
    idrol?: number,
    idRol?: number,
    estado?: number,
    idEstatus?: number,
    pagina?: number,
    busqueda?: string,
    ordenpor?: string,
    orden?: string,
    origen?: string,
    estatus_sol?: number
}

export class Parameter implements IParameter {
    constructor(
        public idrol?: number,
        public idRol?: number,
        public estado?: number,
        public idEstatus?: number,
        public pagina?: number,
        public busqueda?: string,
        public ordenpor?: string,
        public orden?: string,
        public origen?: string,
        public estatus_sol?: number
    ) { };

    //Set de valores para hacer el JSONREQUEST en Bandeja
    public setParameter (json: any): Parameter {
        let _parameters =  new Parameter();
        _parameters.idrol = json['idrol'];
        _parameters.idRol = json['idRol'];
        _parameters.estado = json['estado'];
        _parameters.idEstatus = json['idEstatus'];
        _parameters.pagina = json['pagina'];
        _parameters.busqueda = json['busqueda'];
        _parameters.ordenpor = json['ordenpor'];
        _parameters.orden = json['orden'];
        _parameters.origen = json['origen'];
        _parameters.estatus_sol = json['estatus_sol'];

        return _parameters;
    }

}