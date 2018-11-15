/*
 * @version 1.0 (09/10/2018)
 * @author rtrejo
 * @description Interfas del elemento Empleado
 * @contributors Front-end team
 */

export interface IEmployee {
    apellidoMaternoBloqueo?: string;
    apellidoPaternoBloqueo?: string;
    canal?: number;
    cliente?: string;
    empresa?: string;
    estadoBloqueo?: number;
    estatus?: string;
    fecha_recepcion?: string;
    folio?: number;
    folioCteUn?: number;
    idClienteBig?: number;
    nombreBloqueo?: string;
    page?: number;
    pais?: number;
    revision?: number ;
    rfc?: string;
    sucursal?: number ;
    tipo_producto?: string;
    analista?: boolean;
    imagen?: string;
}

export class Employee implements IEmployee {
constructor(
    public apellidoMaternoBloqueo?: string,
    public apellidoPaternoBloqueo?: string,
    public canal?: number,
    public cliente?: string,
    public empresa?: string,
    public estadoBloqueo?: number,
    public estatus?: string,
    public fecha_recepcion?: string,
    public folio?: number,
    public folioCteUn?: number,
    public idClienteBig?: number,
    public nombreBloqueo?: string,
    public page?: number,
    public pais?: number,
    public revision?: number ,
    public rfc?: string,
    public sucursal?: number ,
    public tipo_producto?: string,
    public analista?: boolean,
    public imagen?: string
){};
}