import { Injectable } from "@angular/core";



@Injectable()

export class RevisionSolicitudService {



    private esBandejaEspecial: boolean;

    private numRevisionSolicitud: number;



    constructor() { }



    public setNumeroRevisionSolicitud(val: number): void {

        if (val !== null && val !== undefined && val > 0) {

            this.numRevisionSolicitud = val;

        }

    }



    public getNumerorevisionSolicitud(): number {

        return this.numRevisionSolicitud;

    }



    public setEsBandejaEspecial(val: boolean): void {

        if (val !== null && val !== undefined && typeof val === 'boolean') {

            this.esBandejaEspecial = val;

        }

    }



    public getEsBandejaEspecial(): boolean {

        return this.esBandejaEspecial;

    }

}