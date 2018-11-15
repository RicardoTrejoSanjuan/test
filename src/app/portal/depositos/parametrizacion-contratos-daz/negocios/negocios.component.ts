import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { DragulaService } from 'ng2-dragula';

// import { Data } from '../instituciones';
import { ClassGenerica } from '../../../../classGeneric/config';

import { Ng2Tables } from '../../../../ng2-tables/ng2-tables.component';

import { Notifications} from '../../../../classGeneric/notifications';

import { Service } from '../../../../service/service';
import * as _ from 'underscore';

import {FormControl} from '@angular/forms';
import { Array } from 'core-js/library/web/timers';

@Component({
  selector: "depositos",
  templateUrl:
    "negocios.component.html",
  styleUrls: [
    "negocios.css"
  ]
})
export class NegocioComponent extends ClassGenerica {
  public menuLateral: Array<Object>;

  public depositosObject: any;

  public objTablaNegocios: any;

  public validamontoVar: number = 0;
  public validareferenciaVar: number = 0;

  public canalConfigurado: any;
  public montoVar: any;

  public consultaCanalObject: any;

  public idCanal: any;
  public sacaMonto;
  public sacaReferencia;

  public decimalvalid: boolean = false;


  public containsString: any;
  
    public findPoint: any;
  
    public countLength = 0;
  
    public numeral: any;
  
    public numback:any;
    public numberRespaldo: number;

  public showDialogAlert:any;
  public modalFormulario:any;

  constructor(
    private service: Service,
    private router: Router,
    private notifications: Notifications,
    private dragulaService: DragulaService
  ) {
    super();
    this.menuLateral = this.getMenuLateral(1);
    this.menuNavigation = this.menuNavigation();

    this.depositosObject = super.getAttr("depositos");
    console.log(this.depositosObject);

    this.consultaTablaNegocios();
    this.canal();
  }

  private consultaTablaNegocios(): void {
    super.loading(true);

    let path = "/depositoazteca/adicionales/consultaadicionales/";
    let parameter: any = {
      idInstitucion: this.depositosObject.idInst,
      idPais: this.depositosObject.idPais,
      idCta: this.depositosObject.idCuenta,
      idContrato: this.depositosObject.idContratoDaz
    };
    console.log(parameter);
    this.service.post(parameter, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        console.log(object);
        if (object.codE === 0) {
          if (object.jsonResultado.length !== 0) {
            this.objTablaNegocios = object.jsonResultado;
          } else {
            this.objTablaNegocios = [];
          }
        } else {
          this.notifications.error(object.msgE);
        }
      },
      error => {
        super.loading(false);
        this.notifications.error("Error de servicio");
      },
      () => super.loading(false)
    );
  }

  private canal(): void {
    super.loading(true);

    let path = "/depositoazteca/canales/consultacanal/";
    let parameter: any = {
      idInstitucion: this.depositosObject.idInst,
      idPais: this.depositosObject.idPais,
      idCuenta: this.depositosObject.idCuenta,
      idContratoDaz: this.depositosObject.idContratoDaz
    };
    this.service.post(parameter, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        console.log(object);
        if (object.codE === 0 && object.jsonResultado !== null) {
          this.consultaCanalObject = object.jsonResultado;
        } else {
          this.notifications.error(object.msgE);
        }
      },
      error => {
        super.loading(false);
        this.notifications.error("Error de servicio");
      },
      () => super.loading(false)
    );
  }

  public guardarNegocios(): void {
    super.loading(true);

    let path = "/depositoazteca/adicionales/insertaadicionales/";
    let parameter: any = {
      idInstitucion: this.depositosObject.idInst,
      idPais: this.depositosObject.idPais,
      idCta: this.depositosObject.idCuenta,
      idContrato: this.depositosObject.idContratoDaz,
      validaMonto: this.validamontoVar,
      validaRef: this.validareferenciaVar,
      idCanal: Number(this.canalConfigurado),
      montoMax: Number(this.montoVar)
    };
    console.log(parameter);
    this.service.post(parameter, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        console.log(object);
        if (object.codE === 0) {
          this.consultaTablaNegocios();
          this.cancelar();
        } else {
          this.notifications.error(object.msgE);
        }
      },
      error => {
        super.loading(false);
        this.notifications.error("Error de servicio");
      },
      () => super.loading(false)
    );
  }

  public cancelar(): void {
    console.log("Cancelar");
    this.validamontoVar = 0;
    this.validareferenciaVar = 0;
    this.canalConfigurado = "";
    this.montoVar = "";
  }

  private editar(item): void {
    console.log(item);

    // this.validamontoVar =  item.;
    // this.validareferenciaVar =  0;
    this.canalConfigurado = item.idCanal;
    this.montoVar = item.montoMax;

    // for (var index = 0; index <  this.objTablaNegocios.length; index++) {
    //   this.sacaMonto =  this.objTablaNegocios[index];
    //   this.sacaReferencia =this.objTablaNegocios[index];

    // }

    // for (var index = 0; index <  this.objTablaNegocios.length; index++) {

    // }

    //Consultamos si la ruta donde esté ya existe en el array de rutas
    //    let tipoCuentas =  this.consultaCuentaLiquidaObject.filter((element) => {
    //     return element.idTipoCuenta === Number (this.cuentas);

    // });

    this.sacaMonto = item.validaMonto;
    this.sacaMonto = item.validaRef;

    if (item.validaMonto === true) {
      this.validamontoVar = 1;
    } else {
      this.validamontoVar = 0;
    }

    if (item.validaRef === true) {
      this.validareferenciaVar = 1;
    } else {
      this.validareferenciaVar = 0;
    }
  }

  private CargarId(item) {
    console.log(item);
    this.idCanal = item.idCanal;
  }

  public eliminar(): void {
    console.log("eliminar negocio");
    super.loading(true);

    let path = "/depositoazteca/adicionales/eliminaadicionales/";
    let parameter: any = {
      idInstitucion: this.depositosObject.idInst,
      idPais: this.depositosObject.idPais,
      idCta: this.depositosObject.idCuenta,
      idContrato: this.depositosObject.idContratoDaz,
      idCanal: Number(this.idCanal)
    };
    console.log(parameter);
    this.service.post(parameter, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        console.log(object);
        if (object.codE === 0) {
          this.consultaTablaNegocios();
        } else {
          this.notifications.error(object.msgE);
        }
      },
      error => {
        super.loading(false);
        this.notifications.error("Error de servicio");
      },
      () => super.loading(false)
    );
  }

  public numericoComision(e): boolean {
    this.tecla = document.all ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (
      this.tecla === 13 ||
      this.tecla === 8 ||
      this.tecla === 9 ||
      this.tecla === 37 ||
      this.tecla === 39 ||
      this.tecla === 32 ||
      this.tecla === 190
    ) {
      return true;
    }
    if (this.tecla >= 96 && this.tecla <= 105) {
      return true;
    }
    // Patron de entrada, en este caso solo acepta numeros
    this.patron = /[0-9]/;
    this.tecla_final = String.fromCharCode(this.tecla);
    return this.patron.test(this.tecla_final);
  }

  // private decimales(e): void {
  //     let patron2 = /^\d{0,14}(\.\d{1,3})?$/;
  //     let valid = patron2.test(e);
  //     this.decimalvalid = valid;
  // }

 


  public decimales(e) {
    
      let patron3 = /^\d{0,14}(\.\d{1,2})?$/;
      let valid = patron3.test(e);
      if (valid) {
        this.numberRespaldo = e;
      } else {
        let length = e.length;
        let cadena = e.substring(length - 1, length);
        if (cadena === ".") {
          this.numberRespaldo = e;
        } else {
          this.montoVar = this.numberRespaldo;
        }
      }
    

  }




}


