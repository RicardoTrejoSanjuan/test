/*
 * @version 1.0 (09/10/2018)
 * @author rtrejo
 * @description Interfas del elemento Menu
 * @contributors Front-end team
 */
export interface IMenu {
    child?: Array<Menu>;
    claseFondo?: string;
    claseIcono?: string;
    color?: string;
    descripcion?: string;
    idMenu?: number;
    idMenuParent?: number;
    imagen?: string;
    textoMenu?: string;
    url?: string;
}

export class Menu implements IMenu {
    constructor(
        public child?: Array<Menu>,
        public claseFondo?: string,
        public claseIcono?: string,
        public color?: string,
        public descripcion?: string,
        public idMenu?: number,
        public idMenuParent?: number,
        public imagen?: string,
        public textoMenu?: string,
        public url?: string
    ){};
}