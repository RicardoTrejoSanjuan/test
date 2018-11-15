import { Component, AfterViewInit} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


import { ClassGenerica } from '../../classGeneric/config';

import { Notifications } from '../../classGeneric/notifications';
import { Pagination } from '../../classGeneric/pagination';

import { Service } from '../../service/service';

import * as _ from 'underscore';
import { Observable } from 'rxjs/Observable';

//Pruebas
import { TableData } from '../../classGeneric/table-data';

import { Http } from '@angular/http';



@Component({
    selector: 'my-seguridad',
    styleUrls: ['template/seguridad.css'],
    templateUrl: 'template/seguridad.component.html',
})



export class SeguridadComponent extends Pagination {
    
    showAlert;
    MsgAlert;

    path: string;

    menuLateral: Array<Object>;
    showDialogAlert: Boolean = false;


    pager: any = {};
    pagedItems: any[];

    options: Object;

    constructor(
        private service: Service,
        private router: Router,
        private notifications: Notifications,
        private http: Http,
    ) {
        super();
        this.menuLateral = this.getMenuLateral();
        this.menuNavigation = this.menuNavigation();
        let pathredirec = JSON.parse(JSON.stringify(this.menuLateral[0])).url;
        this.router.navigate([pathredirec]);
    }





}
