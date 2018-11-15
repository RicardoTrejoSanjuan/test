import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

// import { Data } from '../instituciones';
import { ClassGenerica } from '../../../../classGeneric/config';

import { Notifications} from '../../../../classGeneric/notifications';

import { Service } from '../../../../service/service';
import * as _ from 'underscore';


import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: "depositos",
  templateUrl:
    "liquidacion.component.html",
  styleUrls: [
    "../canales/canales.css"
  ]
})
export class LiquidacionComponent extends ClassGenerica implements OnInit {
  public menuLateral: Array<Object>;

  public cuentas: any;

  // pridictiva configuracion
  form: FormGroup;

  CuentaControl: FormControl;
  inputBuscar: FormControl;
  inputTipo: FormControl;

  bandIst: boolean;
  objFiltrosHandler: Object;
  institucion: any;
  // pridictiva configuracion

  public depositosObject: any;
  public consultaCuentaLiquidaObject: any;
  public consultacattipoctaObject: any;

  public numCuenta: any;


  public idCuentaDepRef: number = null;

  public objectLiquidacion:any;

  public bloquearSelectTipoCuenta:boolean = false;

  public restriccionRegistros: any;
  public bloqueaBoton: boolean = false;

  public comparaCuenta:any = 0;

  public tipoCobro: any;

  public bloqueaLinea :boolean = false;

  public ConsultaTipoCuenta : any;

  public ConsultaTipoCobro: any;

  public ispredictiva :boolean = false;

  public isCobroComision: boolean = true;

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
    this.bloquearSelectTipoCuenta = false;

    this.consultacattipocta();
    this.consultaCuentaLiquida();
    this.consultaTipocta();

    console.log(this.CuentaControl);
    


  }

  listaInstituciones: Observable<any[]>;

  ngOnInit() {
    // pridictiva configuracion

   
    this.CuentaControl = new FormControl('', Validators.required);
    this.inputBuscar = new FormControl('', Validators.required);
    this.inputTipo = new FormControl('',Validators.required);

    this.form = new FormGroup({
      inputBuscar: this.inputBuscar,
      CuentaControl: this.CuentaControl,
      inputTipo:  this.inputTipo

    });
   

    
    this.listaInstituciones = this.CuentaControl.valueChanges
    .pipe(
      startWith(null),
      map(name => this.filtrarCuentas(name))
    );

    this.bandIst = true;
    this.institucion = 0;
     // pridictiva configuracion  

   


	}

  private getCuenta(dato): void {
    this.numCuenta = dato.numCuenta;
    console.log(this.numCuenta);
  }


  private consultaTipocta(){

    super.loading(true);
    
        console.log();
    
        let path = "/depositoazteca/canales/consultacattipocta/";
        let parameter: any = {
         
        };
        console.log(parameter);
        this.service.post(parameter, path, 3).subscribe(
          data => {
            let object = JSON.parse(JSON.stringify(data));
            console.log(object);
            if (object.codE === 0) {
              this.ConsultaTipoCuenta =  object.jsonResultado.listCatTiposCuenta;
              this.ConsultaTipoCobro =  object.jsonResultado.listCatCobroComi;
              console.log('Consulta Tipo Cuenta');
              console.log( this.ConsultaTipoCuenta);
              console.log(this.ConsultaTipoCobro);
            }else{
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

  public guardarLiquidacion(): void {
    console.log(this.numCuenta);
    console.log(this.cuentas);
    



    this.consultaCuentaLiquidaObject;


     //Consultamos si la ruta donde esté ya existe en el array de rutas
     let tipoCuentas =  this.consultaCuentaLiquidaObject.filter((element) => {
      return element.idTipoCuenta === Number (this.cuentas);
      
  });
  console.log(tipoCuentas);



  if (tipoCuentas.length !== 0 && this.bloquearSelectTipoCuenta !== true ) {
    this.notifications.error('El Tipo de cuenta ya se encuentra insertado, favor de verificar');
    return null;
  }

   



    super.loading(true);

    let path = "/depositoazteca/servicios/mergectasliq/";
    if (Number(this.cuentas)!==3) {
      this.tipoCobro=0;
    }
    let parameter: any = {
        "idInstitucion": this.depositosObject.idInst,
        "idPais": this.depositosObject.idPais,
        "idCuenta": this.depositosObject.idCuenta,
        "contratoDaz": this.depositosObject.idContratoDaz,
        "idCuentPagoRef": this.idCuentaDepRef === null? null : Number(this.idCuentaDepRef),// Alta - Editar
        "idTipoCuenta": Number(this.cuentas),
        "cuentaDeposito": this.numCuenta,
        "idTipoCobroComi":this.tipoCobro,
        "status": 1,
    };
    console.log(parameter);
    this.service.post(parameter, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        if (object.codE === 0) {
            console.log(object);
            this.consultaCuentaLiquida();
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

  private consultacattipocta(): void {
    super.loading(true);

    let path = "/depositoazteca/canales/consultacattipocta/";
    let parameter: any = {};
    this.service.post(parameter, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        console.log(object);
        if (object.codE === 0 && object.jsonResultado !== null) {
          this.consultacattipoctaObject = object.jsonResultado;
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

  private consultaCuentaLiquida(): void {
    super.loading(true);

    console.log();

    let path = "/depositoazteca/canales/consultacuentaliquida/";
    let parameter: any = {
      idInstitucion: this.depositosObject.idInst,
      idPais: this.depositosObject.idPais,
      idCta: this.depositosObject.idCuenta,
      idContrato: this.depositosObject.idContratoDaz,
    };
    console.log(parameter);
    this.service.post(parameter, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        console.log(object);
        // this.numeroRegistros(this.restriccionRegistros);



        if (object.codE === 0 && object.jsonResultado !== null) {
          this.restriccionRegistros =  object.jsonResultado.length;
          console.log('Numero de registros de la consulta');
          console.log( this.restriccionRegistros);
          this.consultaCuentaLiquidaObject = object.jsonResultado;
          console.log(this.consultaCuentaLiquidaObject.tipoCuenta);
         
      
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
  

  filtrarCuentas(val: string) {
    console.log("inicio funcion");
    let instituciones: any[] = [];
    if (this.bandIst) {
      if (val !== null && val !== undefined) {
        this.ispredictiva = false;

        if (val.length > 2) {
          super.loading(true);
          let objRequest = {
            "idInstitucion": this.depositosObject.idInst,
            "idPais": this.depositosObject.idPais,
            "numCuenta": val
          };
          console.log(objRequest);
          let uriRequest = "/depositoazteca/canales/conscuentaliqpredictiva/";
          this.service.post(objRequest, uriRequest, 3).subscribe(
            data => {
              let objServiceResponse: any = JSON.parse(JSON.stringify(data));
              console.log(objServiceResponse);
              if (objServiceResponse.codE === 0) {
                if (objServiceResponse.jsonResultado !== null) {
                  if (objServiceResponse.jsonResultado.length > 0) {
                    this.verificaCobro();
                    for (let inst of objServiceResponse.jsonResultado) {
                      instituciones.push({
                        name: inst.titularCuenta,
                        numCuenta: inst.numCuenta
                      });
                    }
                   
                  } else {
                    this.notifications.info(
                      "No se encontraron coincidencias de instituciones"
                    );
                  }
                }
              } else {
                //console.log("La respuesta contiene algun fallo -> [" + objServiceResponse.msgE + "]");
                this.notifications.info(
                  "Consulta de instituciones",
                  "El servidor respondio con algun fallo -> [" +
                    objServiceResponse.msgE +
                    "]"
                );
              }
            },
            error => {
              //console.log("Ha ocurrido una falla en la peticion -> [" + error + "]");
              this.notifications.error(
                "Error",
                "Ha ocurrido una falla en la peticion -> [" + error + "]"
              );
            },
            () => super.loading(false)
          );
        } 
      } else {
        this.institucion = 0;
      }
    }
    this.bandIst = true;
    return instituciones;
  }
  

  private editar(item){
    console.log('Editando ANDO');
    
    console.log(item);
    this.cuentas = item.idTipoCuenta;
    this.tipoCobro = item.idTipoCobroComi;
    // this.buscar = item.cuentaDeposito;
    this.CuentaControl.setValue(item.cuentaDeposito);
    this.idCuentaDepRef = item.idCuentaDepRef;
    this.numCuenta = item.cuentaDeposito;
    this.bloquearSelectTipoCuenta = true;
    this.ispredictiva = true;
   
    console.log(this.tipoCobro);
    console.log(item);
    
    
  }


  public cancelar():void{
    // this.buscar = '';
    this.CuentaControl.setValue('');
    this.cuentas = undefined;
    this.idCuentaDepRef = null;
    this.bloquearSelectTipoCuenta = false;
    this.tipoCobro = undefined;
  }

  public  numeroRegistros(data){

      console.log('Funcion G');
      console.log(data);
      this.notifications.error('El Tipo de cuenta ya se encuentra insertado, favor de verificar');
      this.bloqueaBoton = true;
     
  }

  public verificaCobro (){
    console.log('Verificando Cobro');
    console.log('Cuneta input');
    // console.log(this.buscar);
    console.log(console.log(this.CuentaControl.value));
    console.log('Cuneta session');
    console.log(this.depositosObject.numCuenta);
    
    if (this.CuentaControl.value !== this.depositosObject.numCuenta) {
      this.bloqueaLinea = true;
      // this.tipoCobro = undefined; 
      console.log('status LINEA');
      console.log(this.bloqueaLinea);
      
      
    }else{
      this.bloqueaLinea = false;
    }

  }


  public verificaCta(){
    console.log(this.cuentas);
    
    if (this.cuentas === "3") {
      this.isCobroComision = false;
    }else{
      this.isCobroComision=true;
    }



  }
  

  private CargarIdLiquidacion(data):void{
    this.objectLiquidacion = data;
    console.log(this.objectLiquidacion);
  }

  public eliminarLiquidacion():void{
    console.log(this.objectLiquidacion);
    super.loading(true);
    this.bloqueaBoton = false;
        let path = "/depositoazteca/servicios/mergectasliq/";
        let parameter: any = {
            "idInstitucion": this.objectLiquidacion.idInstitucion,
            "idPais": this.objectLiquidacion.idPais,
            "idCuenta": this.objectLiquidacion.idCta,
            "contratoDaz": this.objectLiquidacion.idContrato,
            "idCuentPagoRef": this.objectLiquidacion.idCuentaDepRef,
            "idTipoCuenta": Number(this.objectLiquidacion.idTipoCuenta),
            "cuentaDeposito": this.objectLiquidacion.cuentaDeposito,
           "idTipoCobroComi": this.objectLiquidacion.idTipoCobroComi,
            "status": 0,
        };
        console.log('Elimina Registro');
        console.log(parameter);
        this.service.post(parameter, path, 3).subscribe(
          data => {
            let object = JSON.parse(JSON.stringify(data));
            console.log(object);
            if (object.codE === 0) {
                this.consultaCuentaLiquida();
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
  

}
