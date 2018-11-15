/*
 * @version 1.0 (09/10/2018)
 * @author ezuñiga
 * @description Muestra los campos a validar en la solicitud.
 * @contributors Front-end team
 */
import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { ClassGenerica } from './../../../../../classGeneric/config';
import { Notifications } from '../../../../../classGeneric/notifications';
import { Service } from '../../../../../service/service';
import { FormularioController } from './formularioController';

@Component({
    selector: 'formulario',
    templateUrl: 'formulario.component.html',
    styleUrls: ['../../../mesa-control2.component.css']
})
export class Formulario extends ClassGenerica{
    
    @Input() listFormAll: any = {};
    @Input() perfil: boolean;
    @Input() origen: boolean;
    @Input() activaClick : string;
    @Output() banderaBotonAC = new EventEmitter<boolean>();
    @Output() listFormAC = new EventEmitter<object>();
    @Output() banderaFoto = new EventEmitter<boolean>();
    public listForm: Array<any>=[];
    public formularioController: FormularioController;
    
    
    constructor(private service: Service, private router: Router, private notifications: Notifications) {
        super();
        this.formularioController = new FormularioController();
    }
    ngOnInit(): void {
        // this.perfil = this.dataUser['analista'];
        // this.origen = (this.dataTab.estado == 5) ? true : false;
        this.listForm = this.formularioController.listForm(this.listFormAll);
        this.validaSelfieForm();
    }
    validOkX(value){
        let listFormUpdate = this.formularioController.convertValidacion(value,this.listForm);
            this.listForm = listFormUpdate[0];
        this.banderaBotonAC.emit(listFormUpdate[1]);   
        this.banderaFoto.emit(listFormUpdate[2]);   
        this.listFormAC.emit(this.listForm);   
    }
    validaSelfieForm(){
        this.listForm.filter(element => { 
            if(element.etiqueta=="Fotografía"){
                this.banderaFoto.emit(element.validado);
            }
        });
    }
}
