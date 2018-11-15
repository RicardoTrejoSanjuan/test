import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import * as moment from 'moment';

// import { Data } from '../instituciones';
import { ClassGenerica } from '../../../../classGeneric/config';



import { Notifications} from '../../../../classGeneric/notifications';

import { Service } from '../../../../service/service';

import { ValidationService } from '../../../../validator/validation.service';


import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

@Component({
  selector: "depositos",
  templateUrl:
    "referencia-spei.html",
  styleUrls: [
    "referencia-spei.css"
  ]
})
export class ReferenciaSPEI extends ClassGenerica {
  public menuLateral: Array<Object>;
  formulario: any;

  fechaVencimiento:Date;

  maxDate:any;


  constructor(
    private service: Service,
    private router: Router,
    private notifications: Notifications,
    private formBuilder: FormBuilder,
  ) {
    super();
    this.menuLateral = this.getMenuLateral(1);
    this.menuNavigation = this.menuNavigation();

    this.formulario = this.formBuilder.group({
      'contratodaz': ['', [Validators.required]],
      'fecha': ['', [Validators.required]],
      'importepago': ['', [Validators.required]],
      'descripcion': ['', [Validators.required]],
      'digitoverificador': ['', [Validators.required]],
    });

  }

  public saveForm(data):void{
    console.log(data);
   
  }

  

}
