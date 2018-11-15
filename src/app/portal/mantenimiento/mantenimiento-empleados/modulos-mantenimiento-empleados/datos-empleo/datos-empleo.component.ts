import { Component, OnInit } from '@angular/core';
import { Service } from '../../../../../service/service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ClassGenerica } from '../../../../../classGeneric/config';
import {ValidationModule} from '../../../../../validator/validation.module';
import {ValidationService} from '../../../../../validator/validation.service';
import { Notifications} from '../../../../../classGeneric/notifications';
@Component({
    selector: 'mantenimiento',
    templateUrl: 'datos-empleo.component.html',
    styleUrls: ['../../templates/mantenimiento.component.css']
})

export class DatosEmpleoComponent extends ClassGenerica {
    private childrenEmpleados: Object[];
    constructor( private router: Router){
        super();
    }
    private Regresar(){
        this.router.navigate(['./dashboard']);
    }


}