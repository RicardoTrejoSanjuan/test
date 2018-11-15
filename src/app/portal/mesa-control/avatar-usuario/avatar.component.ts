/*
 * @version 1.0 (02-06-2017)
 * @author lfgonzalezr
 * @description Componente AVATAR de usuario de mesa de control
 * @contributors Front-end team
 */

/* IMPORTACION GENERAL */
import { Component, OnInit } from '@angular/core';
import { ClassGenerica } from '../../../classGeneric/config';

@Component({
    selector: 'mesa-control-avatar',
    templateUrl: 'avatar.component.html',
    styleUrls: ['avatar.component.css']
})

export class MesaControlAvatarUsuario extends ClassGenerica {
    public nombreUsuario: string;
    public empresa: string;
    public folio: string;
    public foto: any;
    public fotoCliente: any;
    constructor() {
        super();
        let cliente: any = super.getAttr('Usuario');
        this.fotoCliente = '';
        this.foto = '';
        this.folio = cliente.folio;
        this.nombreUsuario = cliente.cliente;
        this.empresa = cliente.empresa;
    }

    public updateFoto(_foto: any): void {
        if (_foto !== null && _foto !== undefined) {
            if (this.validateFoto(_foto)) {
                console.log('Se ajusta la foto del cliente');
                let newFoto: any = this.AdjustFoto(_foto);
                this.fotoCliente = "data:image/png;base64," + newFoto;
                this.foto = newFoto;
            } else {
                this.fotoCliente = "data:image/png;base64," + _foto;
                this.foto = _foto;
            }
        }
    }

    public getfoto(): any {
        return this.foto;
    }

    private validateFoto(base64: any): boolean {
        try {
            let regexp: any = new RegExp("/9j/4AAQ", "gi");
            let res: any = base64.match(regexp);
            return res.length > 1;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    private AdjustFoto(base64: any): any {
        try {
            let newFoto: string = "/9j/4AAQ";
            let res: any = base64.split("/9j/4AAQ");
            res.shift();
            newFoto = newFoto.concat(res.shift());
            return newFoto;
        } catch (e) {
            console.log(e);
            return "";
        }
    }

}
