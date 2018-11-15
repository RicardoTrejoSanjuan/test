/*
 * @version 1.0 (09/10/2018)
 * @author rtrejo
 * @description Interfas del elemento Busqueda
 * @contributors Front-end team
 */

export interface ISearch {
    text?: string,
    previousSearch?: string
}

export class Search implements ISearch {
    constructor(
        public text?: string,
        public previousSearch?: string
    ){};
}

export interface IColumn {
    key?: string,
    name?: string,
}

export class Column implements IColumn {
    constructor(
        public key?: string,
        public name?: string
    ){};
}