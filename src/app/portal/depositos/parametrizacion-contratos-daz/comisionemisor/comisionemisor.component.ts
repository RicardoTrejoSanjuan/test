import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

// import { Data } from '../instituciones';
import { ClassGenerica } from '../../../../classGeneric/config';

import { Notifications} from '../../../../classGeneric/notifications';

import { Service } from '../../../../service/service';
import * as _ from 'underscore';

import {FormControl} from '@angular/forms';

@Component({
  selector: "depositos",
  templateUrl:
    "comisionemisor.component.html",
  styleUrls: [
    "comisionemisor.css"
  ]
})
export class EmisorComponent extends ClassGenerica {
  public menuLateral: Array<Object>;

  public formasdecobro: any;
  public canalConfigurado: any;
  public valorporcentajeMonto: any;

  public depositosObject: any;
  public consultaFormasdeCobroObject: any;
  public consultaCanalObject: any;

  public porcentajeMontoRadio: number = 1;

  public numberRespaldo: number;

  public consultaComisionObject: any;

  public idComision: number;
  public idCanal: number;

  public idFormaCobro: number;

  public decimalvalid:boolean = false;

  public containsString: any;

  public findPoint: any;

  public countLength = 0;

  public numeral: any;

  public numback:any;

  public showDialogAlert:any;
  public modalFormulario:any;


  constructor(
    private service: Service,
    private router: Router,
    private notifications: Notifications
  ) {
    super();
    this.menuLateral = this.getMenuLateral(1);
    this.menuNavigation = this.menuNavigation();

    this.depositosObject = super.getAttr("depositos");
    console.log(this.depositosObject);

    this.consultaformascobro();
    this.canal();
    this.ConsultaComisiones();
  }

  private consultaformascobro(): void {
    super.loading(true);

    let path = "/depositoazteca/servicios/consultaformascobro/";
    let parameter: any = {};
    this.service.post(parameter, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        console.log(object);
        if (object.codE === 0 && object.jsonResultado !== null) {
          this.consultaFormasdeCobroObject = object.jsonResultado;
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

  clearvariables(): void {
    this.formasdecobro = undefined;
    this.canalConfigurado = undefined;
    this.valorporcentajeMonto = "";
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

  public cancelar(): void {
    this.idComision = undefined;
    this.clearvariables();
  }

  private CargarIdComision(item): void {
    console.log(item);
    this.idComision = item.idComision;
    this.idCanal = item.idCanal;
    this.idFormaCobro = item.idFormaCobro;
    // this.idCanal = item.idCanal;
  }

  public guardarComisiones(): void {
    console.log(this.formasdecobro);
    console.log(this.canalConfigurado);
    console.log(this.valorporcentajeMonto);

    console.log(this.idComision);

    super.loading(true);

    let path = "/depositoazteca/servicios/mergecomisiones/";
    let parameter: any = {
      idInstitucion: this.depositosObject.idInst,
      idPais: this.depositosObject.idPais,
      idCta: this.depositosObject.idCuenta,
      idContrato: this.depositosObject.idContratoDaz,

      idFormaCobro: Number(this.formasdecobro),
      idCanal: Number(this.canalConfigurado),

      porcentaje:
        Number(this.formasdecobro) === 2
          ? Number(this.valorporcentajeMonto)
          : null,
      monto:
        Number(this.formasdecobro) === 1
          ? Number(this.valorporcentajeMonto)
          : null,

      idComision: this.idComision === undefined ? null : this.idComision,

      idPersonaComision: 1, // ->1 = Emisor, 2 = Cliente
      status: 1
    };

    console.log(parameter);
    this.service.post(parameter, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        console.log(object);
        if (object.codE === 0) {
          this.clearvariables();
          this.ConsultaComisiones();
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

  private ConsultaComisiones(): void {
    super.loading(true);
    let path = "/depositoazteca/servicios/consultaplancomision/";
    let parameter: any = {
      idInstitucion: this.depositosObject.idInst,
      idPais: this.depositosObject.idPais,
      idCta: this.depositosObject.idCuenta,
      idContrato: this.depositosObject.idContratoDaz,
      idPersonaCobro: 1 //->1 = Emisor, 2 = Cliente
    };

    console.log(parameter);
    this.service.post(parameter, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        console.log(object);
        if (object.codE === 0 && object.jsonResultado !== null) {
          this.consultaComisionObject = object.jsonResultado;
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
  public validatorcampodinamico(e): void {
    // console.log(this.formasdecobro);
    if (this.formasdecobro === "2") {
      if (e !== "") {
        let patron2 = /(?:\b|-)([0-9]{1,2}[0]?|100)(\.\d{1,2})?$/;
        let valid = patron2.test(e);

        if (valid) {
          this.numberRespaldo = e;
        } else {
          let length = e.length;
          let cadena = e.substring(length - 1, length);
          if (e === "100.") {
            this.valorporcentajeMonto = this.numberRespaldo;
          }
          if (cadena === "." && e.length <= 3) {
            this.numberRespaldo = e;
          } else {
            this.valorporcentajeMonto = this.numberRespaldo;
          }

          this.valorporcentajeMonto = this.numberRespaldo;
        }
      } else {
        this.numberRespaldo = e;
      }
    }
  }

  private editar(item): void {
    console.log(item);
    this.formasdecobro = item.idFormaCobro;
    this.canalConfigurado = item.idCanal;
    this.valorporcentajeMonto = item.porcMonto;
    this.porcentajeMontoRadio = 1;
    this.idComision = item.idComision;
  }

  public eliminarComision(): void {
    console.log(this.idComision);

    super.loading(true);
    let path = "/depositoazteca/servicios/mergecomisiones/";
    let parameter: any = {
      idInstitucion: this.depositosObject.idInst,
      idPais: this.depositosObject.idPais,
      idCta: this.depositosObject.idCuenta,
      idContrato: this.depositosObject.idContratoDaz,
      idComision: this.idComision,
      idCanal: Number(this.idCanal),
      idFormaCobro: this.idFormaCobro,
      idPersonaComision: 1, // ->1 = Emisor, 2 = Cliente
      status: 0 //-> Status de la referencia (0 = Desactivado 1 = Activado
    };
    console.log(parameter);
    this.service.post(parameter, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        if (object.codE === 0) {
          console.log(object);
          this.ConsultaComisiones();
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
  //  console.log(e);
  //  console.log(this.valorporcentajeMonto);
   
    //this.containsString = this.valorporcentajeMonto + e.key;
    // console.log('Numero de caracteres en la cadena');
    // this.numeral = this.containsString; 
    // console.log(this.numeral);


   
   if (e !== '' || e !== null ) {
    // this.countLength = this.countLength +1;
    // console.log(this.countLength);
  }

    // if (this.numeral> 6) {
    // this.findPoint = this.containsString.includes(".");
    // console.log('Encuentra Punto');
    // console.log(this.findPoint);
    //   this.countLength = 0;
    // }


    // if (this.countLength > 6 && this.findPoint !== true) {
    //   return false;

    // }


    
  
    this.tecla = document.all ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (
      this.tecla === 13 ||
      this.tecla === 8 ||
      this.tecla === 9 ||
      this.tecla === 37 ||
      this.tecla === 39 ||
      this.tecla === 32 ||
      this.tecla === 190||
      this.tecla === 110
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
  public decimales(e) {
    if (this.formasdecobro === "1") {
      let patron3 = /^\d{0,7}(\.\d{1,2})?$/;
      let valid = patron3.test(e);
      if (valid) {
        this.numberRespaldo = e;
      } else {
        let length = e.length;
        let cadena = e.substring(length - 1, length);
        if (cadena === ".") {
          this.numberRespaldo = e;
        } else {
          this.valorporcentajeMonto = this.numberRespaldo;
        }
      }
    }

  }


}
