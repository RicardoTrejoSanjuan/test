/*
 * @version 1.0 (10/10/2018)
 * @author ezuñiga
 * @description Muestra las opciones para la validacion de los pdf´s.
 * @contributors Front-end team
 */

/* IMPORTACION GENERAL */
import { Component,OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Notifications } from '../../../../../classGeneric/notifications';
import { ClassGenerica } from './../../../../../classGeneric/config';
import { MESA_CONTROL } from './../../../shared/constants/constants-url';
import { Service } from '../../../../../service/service';
import { ImagenPdfController } from './imagenPdfController';

@Component({
    selector: 'imagenPdf',
    templateUrl: 'imagenPdf.component.html',
    styleUrls: ['../../../mesa-control2.component.css']
})

export class validaImagenesPdf extends ClassGenerica  implements OnInit {
    @Input() imagesPdfAll: any = {};
    @Output() banderaImagesPdf = new EventEmitter<Array<any>>();
    public imagenPdfController: ImagenPdfController;
    public usuarioBasic: object = {};
    public dataUser: object = {};
    public imagesPdf: Array<any> = [];
    public imagesPdfUpdate: Array<any> = [];
   
    constructor() {
        super();
        this.imagenPdfController = new ImagenPdfController();
        this.usuarioBasic = super.getAttr('Usuario');
    }
    ngOnInit(){
        this.dataUser=this.usuarioBasic;
        this.imagesPdf = this.imagesPdfAll;
        this.banderaImagesPdf.emit(this.imagesPdf);
    }
    ngOnChanges(){
        this.imagesPdf = this.imagesPdfAll;
        this.banderaImagesPdf.emit(this.imagesPdf);
    }
    validOkXImg(dataPdf){
        this.imagesPdf = this.imagenPdfController.updateDataPdf(this.imagesPdf,dataPdf);
        this.banderaImagesPdf.emit(this.imagesPdf);   
    }
}
