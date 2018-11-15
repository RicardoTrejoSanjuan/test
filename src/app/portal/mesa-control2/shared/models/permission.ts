/*
 * @version 1.0 (09/10/2018)
 * @author rtrejo
 * @description Interfas del elemento Permiso
 * @contributors Front-end team
 */

export interface IPermission {
}

export class Permission implements IPermission {

    private analista?: boolean = false;
    private consulta?: boolean = false;
    private credito?: boolean = false;
    private reportes?: boolean = false;
    private asesor?: boolean = false;

    get Analista():boolean {
        return this.analista;
    }
    set Analista(analista: boolean) {
        this.analista = analista;
    }

    get Consulta():boolean {
        return this.consulta;
    }
    set Consulta(consulta: boolean) {
        this.consulta = consulta;
    }

    get Credito():boolean {
        return this.credito;
    }
    set Credito(credito: boolean) {
        this.credito = credito;
    }

    get Reportes():boolean {
        return this.reportes;
    }
    set Reportes(reportes: boolean) {
        this.reportes = reportes;
    }
    get Asesor():boolean {
        return this.asesor;
    }
    set Asesor(asesor: boolean) {
        this.asesor = asesor;
    }
}