/*
 * @version 1.0 (09/22/2018)
 * @author rtrejo
 * @description Muestra el avatar del usuario
 * @contributors Front-end team
 */

import { Component, Input } from '@angular/core';
import { Service } from '../../../../../service/service';
import { ClassGenerica } from './../../../../../classGeneric/config';
import { Employee } from '../../../shared/models/employee';
import { AvatarController } from './avatarController';

@Component({
    selector: 'avatar-mc',
    templateUrl: 'avatar.component.html',
    styleUrls: ['./avatar.component.css']
})

export class AvatarUsuario extends ClassGenerica {

    @Input() avatar: boolean;

    public empleado: Employee;
    public controller: AvatarController;
    public foto: any;
    public fotoCliente: any;

    constructor(private service: Service) {
        super();
        this.empleado = super.getAttr('Usuario');
        this.controller = new AvatarController(service);
        this.fotoCliente = this.load_static + "/images/mesa-control-expedientes/iconoGris.png";
        this.getPhoto();
    }

    private async getPhoto() {
        let photo = await this.controller.getPhoto({ pais: this.empleado.pais, folio: this.empleado.folioCteUn, canal: this.empleado.canal, sucursal: this.empleado.sucursal });
        if (photo != 0) {
            this.updatePhoto(photo);
        }
    }

    private updatePhoto(_photo: any): void {
        if (_photo !== null && _photo !== undefined) {
            if (this.controller.validatePhoto(_photo)) {
                console.log('Se ajusta la foto del cliente');
                let newFoto: any = this.controller.AdjustePhoto(_photo);
                this.fotoCliente = "data:image/png;base64," + newFoto;
                this.foto = newFoto;
            } else {
                this.fotoCliente = "data:image/png;base64," + _photo;
                this.foto = _photo;
            }
        }
    }
}