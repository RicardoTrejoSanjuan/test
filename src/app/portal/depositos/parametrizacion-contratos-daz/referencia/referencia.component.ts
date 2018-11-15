import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

// import { Data } from '../instituciones';
import { ClassGenerica } from '../../../../classGeneric/config';


import { Notifications} from '../../../../classGeneric/notifications';

import { Service } from '../../../../service/service';


import {FormControl} from '@angular/forms';

@Component({
  selector: "depositos",
  templateUrl:
    "referencia.component.html",
  styleUrls: [
    "referencia.css"
  ]
})
export class ReferenciaDepositos extends ClassGenerica {


  public nombre: string = '';

  public ObjectDepositos:any;

  public menuLateral: Array<Object>;
  public showFomulario: boolean = false;
  public showBusqueda: boolean = true;
  public bloqueaCampo: boolean = false;
  status:any;
  tiporeferencia: number = 1;
  numCaracter:any;
  prefijoreferencia: number = 2;
  tieneprefijo: boolean = false;

  tipolongitud: boolean = true;
  divtipodelongitud: boolean = true;

  valorprefijo: string = "";
  forFecha: any = "";
  rango1prefijo: number = 0;
  rango2prefijo: number = 0;
  formasdecobro: any;
  totalposiciones: number = 0;

  rango1variable: number = 0;
  rango2variable: number = 0;

  tipolectura: boolean = true;
  textoamostrar:string = '';

  validafecha: boolean = false;
  validafechaposicion: boolean = this.validafecha;
  validafechaposicionde: number = 0;
  validafechaposiciona: number = 0;

  bloqueo:boolean;
  validaimporte: boolean = false;
  validaimporteposicion: boolean = this.validaimporte;
  validaimportede: number = 0;
  validaimportea: number = 0;

  numDecimales: number = 0;

  digitoverificador: boolean = false;
  digitoverificadorposicion: boolean = this.digitoverificador;
  digitoverificadorposicionde: number = 0;
  digitoverificadorposiciona: number = 0;

  posicionponderador1: number = 0;
  posicionponderador2: number = 0;
  mostrarlistaponderadores: boolean = false;
  itemtotalponderadores: Array<any> = [];
  countPonderadores: any;
  cadPonderadoresTemp:any;
  pagoSpei:any;
  objguardaSpei:any;

  cadPonderadores: string = null;
  checkPond: boolean;
  checkPond2: boolean;
  checkPond3: boolean;
  checkPond4: boolean;

  tipoAlgoritmo:  Array<Object>;

  public bloqueaBoton: boolean = false;
   public modalSpei: boolean= false;
  

  private listReferencia = [];

  public restriccionRegistros: any;

  private nuevoRegistro:boolean;

  private idRef: number;
  private idReferencia: number;

  private numberRespaldo1: number;
  private numberRespaldo2: number;

  private formatoFecha:any;

  public showDialogAlert:any;
  public modalFormulario:any;

  constructor(
    private service: Service,
    private router: Router,
    private notifications: Notifications
  ) {
    super();
    this.bloqueo=false;
    console.log(this.bloqueo);
    
    this.menuLateral = this.getMenuLateral(1);
    this.menuNavigation = this.menuNavigation();
    this.numCaracter = 1;
    this.ObjectDepositos = super.getAttr('depositos');
    console.log(this.ObjectDepositos);

    if (this.tipolectura) {
      this.textoamostrar = "Izquierda / Derecha";
    } else {
      this.textoamostrar = "Derecha  / Izquierda";
    }

    this.consreferenciasdaz();

    if (Number(this.prefijoreferencia) === 1) {
      this.tieneprefijo = true;
    } else {
      this.tieneprefijo = false;
    }

    console.log(this.tieneprefijo);

    
   
  }

  private consreferenciasdaz(){
    super.loading(true);
    let path = '/depositoazteca/referenciasdaz/consreferenciasdaz/';
    let parameter: any = {
      "idInstitucion": this.ObjectDepositos.idInst,
      "idPais": this.ObjectDepositos.idPais,
      "idCuenta": this.ObjectDepositos.idCuenta,
      "idContratoDaz": this.ObjectDepositos.idContratoDaz,
      // "numCuenta":this.ObjectDepositos.numCuenta,
    };
    console.log(parameter);
    this.service.post(parameter, path, 3).subscribe(
        data => {
            let object = JSON.parse(JSON.stringify(data));
            if(object.codE === 0){
              console.log('Consulta General');
                console.log(object);
                this.listReferencia = object.jsonResultado;
               this.restriccionRegistros =  object.jsonResultado.length;
               this.numeroRegistros(this.restriccionRegistros);
       
                for (let index = 0; index < this.listReferencia.length; index++) {
                  if (this.listReferencia[index].pagoPorSpei ===  0 ) {
                    this.listReferencia[index].pagoSpei = false;
                   
                  }else{
                    this.listReferencia[index].pagoSpei = true;
                    
                  }

                }


            }else{
                this.notifications.error(object.msgE);
            }
        },
        error => {
            super.loading(false);
            this.notifications.error('Error de servicio');
        },
        () => super.loading(false)
    );
  }

  private nuevo(): void {
    this.consultaAlgoritmo();
    this.nombre = '';
    this.showBusqueda = false;
    this.showFomulario = true;
    this.nuevoRegistro = true;

    this.tiporeferencia = 1;
    
    this.prefijoreferencia = 2;
    this.tieneprefijo= false;
    
    this.tipolongitud = true;
    this.divtipodelongitud = true;
    
    this.valorprefijo = "";
    this.rango1prefijo = 0;
    this.rango2prefijo = 0;
    
    this.totalposiciones = 0;
    
    this.rango1variable = 0;
    this.rango2variable = 0;
    
    this.tipolectura = true;
    this.textoamostrar = '';
    
    this.validafecha = false;
    this.validafechaposicion = this.validafecha;
    this.validafechaposicionde = 0;
    this.validafechaposiciona = 0;
    this.validaimportede = 0;
    this.validaimportea = 0;
    
    this.validaimporte = false;
    //check this
    this.validaimporteposicion = this.validaimporte;
    
    // this.numDecimales = 0;
    
    this.digitoverificador = false;
    this.digitoverificadorposicion = this.digitoverificador;
    this.digitoverificadorposicionde = 0;
    this.digitoverificadorposiciona = 0;
    
    this.posicionponderador1 = 0;
    this.posicionponderador2 = 0;
    this.mostrarlistaponderadores = false;
    this.itemtotalponderadores = [];
    
    
    this.cadPonderadores = null;
  

  }

  private lareferenciaes(evt) {
    var target = evt.target;
    console.log(target.checked);
    if (target.checked) {
      this.valorprefijo = "";
      this.rango1prefijo = 0;
      this.rango2prefijo = 0;
    }
  }

  public numeroRegistros(data){
    console.log('Funcion G');
    console.log(data);
    if (data >= 4) {
      this.notifications.error('Número Maximo de referencias alcanzado: 4');
      this.bloqueaBoton = true;
     
      
    }
    

  }

  private ChangeTienePrefijo(evt) {
    var target = evt.target;
    if (target.checked) {
      console.log(
        "Se cambia de posicion el radio ::: Tiene prefijo la referencia"
      );
      console.log(this.prefijoreferencia);
      if (Number(this.prefijoreferencia) === 1)  {
        this.tieneprefijo = true;
      } else {
        this.tieneprefijo = false;
      }

      console.log("Ocultamos el div de prefijos: ", this.tieneprefijo);
    }
  }

  private ChangeTipoLongitud(evt) {
    var target = evt.target;
    if (target.checked) {
      console.log(this.rango1variable);
      console.log(this.rango2variable);
      console.log("Se cambia de posicion el radio ::: Tipo de longitud");
      console.log(this.tipolongitud);
      if (this.tipolongitud) {
        this.divtipodelongitud = true;
      } else {
        this.divtipodelongitud = false;
      }

      console.log(
        "Ocultamos el div de tipo de longitud fija es true y variable es false: ",
        this.divtipodelongitud
      );
      this.totalposiciones = this.totalposiciones;
    }
  }

  private changeValorPrefijo(data): void {
    if (this.rango1prefijo === 0) {
      this.rango2prefijo = Number(this.rango1prefijo) + Number(data.length);
      this.rango1prefijo = 1;
    } else {
      this.rango2prefijo = Number(this.rango1prefijo) + Number(data.length) - 1;
    }
  }



  // aqui calculamos la referencia
  private changeValorPrefijo1(data): void {
    if (this.rango1prefijo === 0) {
      this.rango2prefijo = Number(this.rango1prefijo) + Number(data.length);
      this.rango1prefijo = 1;
    } else {
      this.rango2prefijo = Number(this.rango1prefijo) + Number(data.length) - 1;
    }
    this.totalposiciones =this.rango2prefijo; 
  }





  private ChangeTipoLectura(evt):void{
      if(this.tipolectura){
        this.textoamostrar = 'Izquierda / Derecha';
      }else{
        this.textoamostrar = 'Derecha  / Izquierda';
      }
  }

  private consultaReferenciaConf(idRef): void {
    this.idRef = idRef;
    this.nuevoRegistro = false;
    super.loading(true);
    let path = '/depositoazteca/referenciasdaz/configreferenciasdaz/';
    let parameter: any = {
      "idInstitucion": this.ObjectDepositos.idInst,
      "idPais": this.ObjectDepositos.idPais,
      "idCuenta": this.ObjectDepositos.idCuenta,
      "idContratoDaz": this.ObjectDepositos.idContratoDaz,
      "numCuenta":this.ObjectDepositos.numCuenta,
      "idRef": idRef

    };
   
    let algoritmo=0;
    console.log(parameter);
    this.service.post(parameter, path, 3).subscribe(
        data => {
            let object = JSON.parse(JSON.stringify(data));
            if (object.codE === 0) {
              console.log(object);
              
              this.formasdecobro = object.jsonResultado[0].idAlgoritmo;

              // if(this.posicionponderador1 !== null && this.posicionponderador2 !== null&& this.posicionponderador1 !== 0 && this.posicionponderador2 !== 0){
              //   this.changeponderador2(this.posicionponderador1);
               
              // }
              this.consultaAlgoritmo();
              
              this.nombre = object.jsonResultado[0].etiqueta;

              this.tiporeferencia = object.jsonResultado[0].idTipoRef;
              this.tieneprefijo = object.jsonResultado[0].tienePrefijo === 1 ? true : false;

              console.log(this.tieneprefijo);

              this.valorprefijo = object.jsonResultado[0].prefijo;
              this.rango1prefijo = object.jsonResultado[0].posInicialPre;
              this.rango2prefijo = object.jsonResultado[0].posFinalPre;

              // Tipo de longitud
              this.tipolongitud = object.jsonResultado[0].idTipoLongitud === 1 ? true : false;
              this.totalposiciones = object.jsonResultado[0].longitudFija;
              this.rango1variable =  object.jsonResultado[0].longitudMin;
              this.rango2variable =  object.jsonResultado[0].longitudMax;
              // Tipo de longitud

              // Tipo de lectura
              this.tipolectura = object.jsonResultado[0].idTipoLectura === 1 ? true : false;
              // Tipo de lectura
             
              // ¿Validar fecha?
              this.validafecha = object.jsonResultado[0].validaFecha === 1 ? true : false;
              this.validafechaposicion = this.validafecha;
              this.validafechaposicionde = object.jsonResultado[0].posIniFecha;
              this.validafechaposiciona = object.jsonResultado[0].posFinFecha;
              // ¿Validar fecha?

              // ¿Validar el importe?
              this.validaimporte = object.jsonResultado[0].validaImporte === 1 ? true : false;
              this.validaimportede = object.jsonResultado[0].posIniImporte;
              this.validaimportea = object.jsonResultado[0].posFinImporte;
              //check this
               this.validaimporteposicion = this.validaimporte;
              // this.numDecimales = object.jsonResultado[0].numDecimales;
              // console.log(object.jsonResultado[0].numDecimales);
              // ¿Validar el importe?

              // ¿Se valida dígito verificador?
              this.digitoverificador = object.jsonResultado[0].validaDigVerific === 1 ? true : false;
              this.digitoverificadorposicion = this.digitoverificador;

              this.posicionponderador1 = object.jsonResultado[0].posIniPond;
              this.posicionponderador2 = object.jsonResultado[0].posFinPond;

              this.cadPonderadores = object.jsonResultado[0].cadPonderadores;
              
              
              if (this.tipolongitud) {
                this.changeponderador2(this.totalposiciones);
                this.divtipodelongitud = true;
              } else {
                this.changeponderador2(this.rango2variable);
                this.divtipodelongitud = false;
              }
              setTimeout(() => {
                this.cambioAlgoritmo(object.jsonResultado[0].idAlgoritmo.toString());
              }, 1000);
              console.log('Recuperar datos de la consulta IMPORTES');
             console.log( this.validaimportede);
             console.log( this.validaimportea);
              
              // ¿Se valida dígito verificador?
              this.showBusqueda = false;
              this.showFomulario = true;
              
            } else {
              this.notifications.error(object.msgE);
            }
        },
        error => {
            super.loading(false);
            this.notifications.error('Error de servicio');
        },
        () => super.loading(false)
    );
  }


  private ChangeValidafecha():void{
    if(this.validafecha) {
        this.validafechaposicion = true;
    } else {
        this.validafechaposicion = false;
    }
  }

  private ChangeValidaImporte():void{
    if(this.validaimporte) {
        this.validaimporteposicion = true;
        console.log('Valida importe');
        console.log(this.validaimporte);
        
        
    } else {
        this.validaimporteposicion = false;
        console.log('Valida importe');
        console.log(this.validaimporte);
    }
  }


  private ChangeDigitoVerificador():void{
    if(this.digitoverificador) {
        this.digitoverificadorposicion = true;
    } else {
        this.digitoverificadorposicion = false;
    }

    console.log(this.digitoverificadorposicion);
  }

  private changeponderador2(ponderador1):void{


    let ponderador2 = 0;

    console.log('Entre a la creacion de los ponderadores');
    
    // Con esta wea voy a checar la onda de las D's
    console.log(this.cadPonderadores);

    let cadPonderadoresobj;

    if (this.cadPonderadores !== null) {
      cadPonderadoresobj = this.cadPonderadores.split(",");
    }else{
      cadPonderadoresobj = {value:'',number:0};
    }

      // let cadPonderadoresobj = this.cadPonderadores.split(',');

      let pond1 = Number(ponderador1);
      let pond2 = Number(ponderador2);

      if(pond2 > pond1){
        this.mostrarlistaponderadores = false;
        this.notifications.success("Aviso","No puede ser mayor el ponderador 2, revise las asignaciones de los ponderadores");
      }
        this.itemtotalponderadores = [];

        let total = (pond1 - pond2) + 1;
        this.mostrarlistaponderadores = true;

   

        let count = 0;
        let item = 0;
        let contador = total;
      
        let numbercasilla = 1;
        console.log('Soy pond1');
        
        console.log(pond1);
        this.countPonderadores = pond1;
        if (this.bloqueo) {
          if (this.countPonderadores > 20) {
            this.notifications.alert("Aviso","Limite de ponderadores excedido, Limite actual de ponderadores: 20");
            return null;
          }
        } else {
          if (this.countPonderadores > 30) {
            this.notifications.alert("Aviso","Limite de ponderadores excedido, Limite actual de ponderadores: 30");
            return null;
          }
        }
// For For example crea los inputs xdxdxdxdxdx
          for(let i =  this.countPonderadores; i>=1; i--) {
            console.log(numbercasilla);
              count = count +1;
              if(this.cadPonderadores !== ''){
                if (this.countPonderadores === numbercasilla ) {
                  cadPonderadoresobj[item] ="D";
                }
                if(this.bloqueo){
                  if (this.countPonderadores-1 === numbercasilla) {
                    cadPonderadoresobj[item] ="D";
                  }
                }
                this.itemtotalponderadores.push({value:cadPonderadoresobj[item],number:numbercasilla,});
              }else{
                this.itemtotalponderadores.push({value:'',number:numbercasilla});
              }
              item = item + 1;
              numbercasilla = numbercasilla+1;
         }
         
         console.log(this.itemtotalponderadores[this.countPonderadores-1],"aqui");
         
  }

  private guardarReferncia(): void {
    console.log("Guardamos referencia");
    let cadenaPonderadores:string = '';
    let count:number = 0;
    let cadena:any;
 
    for(let object of this.itemtotalponderadores){
      console.log(cadenaPonderadores);
      let object2 = JSON.parse(JSON.stringify(object));
      console.log(object2);

      if (object2.value === ""|| object2.value === undefined || object2.value === null) {
        object2.value = 0;
      }

      if (object2.value === "D") {
        object2.value = '';
      }

      count = count + 1;

      if(count < this.itemtotalponderadores.length-1){
        cadenaPonderadores = cadenaPonderadores + object2.value+',';
      }else{
        if (!this.bloqueo) {
          cadenaPonderadores = cadenaPonderadores + object2.value;
        }
      }
    }
    if (this.bloqueo) {
      cadenaPonderadores = cadenaPonderadores.substring(0,cadenaPonderadores.length-1);
    }
    
    console.log('No Pinta',cadenaPonderadores);
    console.log(this.itemtotalponderadores);
    
    
   

    
    let depositoObject = super.getAttr('depositos');

    //console.log(depositoObject);


    super.loading(true);
    let path = '/depositoazteca/referenciasdaz/altareferenciasdaz/';
    let parameter: any = {
      "idInstitucion": this.ObjectDepositos.idInst,
      "idPais": this.ObjectDepositos.idPais,
      "idCuenta": this.ObjectDepositos.idCuenta,
      "idContratoDaz": this.ObjectDepositos.idContratoDaz,
      "idRef": this.nuevoRegistro === true ? null : this.idRef,/* Puede Ser null para dar de alta*/
      "etiqueta" :  this.nombre,/*Cualquier cadena*/          
      "idTipoRef":  this.tiporeferencia, /* 1)= Numérica      2)= Alfanumérica       3)= Alfabética    */          
      "idTienePrefijo":  this.prefijoreferencia, /*1 = SI      2 = NO*/          
      "prefijo":  this.prefijoreferencia === 1 ? this.valorprefijo: '' ,/*Cadena*/          
      "posInicial": this.rango1prefijo,/*Posición inicial del prefijo*/
      "posFinal": this.rango2prefijo,/*Posición Final del prefijo*/          
      "idTipoLongitud": this.tipolongitud === true ? 1 : 2,/* 1)= Fija      2)= Variable*/         
      "longFija":  Number(this.totalposiciones),/*Cuando sea Fija*/          
      "longMin":   this.rango1variable,/*Longitud min de la referencia*/          
      "longMax":   this.rango2variable,/*Longitud max de la refencia*/          
      "idTipoLectura": this.tipolectura === true ? 1 : 2,/*  1)= De isquieda a derecha      2)= De derecha a isquierda*/           
      "validaFecha":  this.validafecha === true ? 1 : 2,//1)SI    2)NO           
      "formatoFecha":  this.formatoFecha + "",/* Formato de la fecha dd/mm/yyyy */    
      "posIniFecha":Number(this.validafechaposicionde),
      "posFinFecha":Number(this.validafechaposiciona),
      "validaImporte":  this.validaimporte === true ? 1 : 2,//-- 1)SI    2)NO

      // "numDecimales": Number(this.numDecimales),/*Numero de decimales en caso se validarse*/

      "posIniImporte": Number(this.validaimportede),
      "posFinImporte": Number(this.validaimportea),


      "valDigVerificador":  this.digitoverificador === true ? 1 : 2,//-- 1)SI    2)NO  

      "refRequerida":  1,/*1 = SI      2 = NO*/
      
      "posIniPond":  Number(this.posicionponderador1),/*Posicion inicla de los ponderadores*/         
      "posFinPond":  Number(this.posicionponderador2),/*Posicion final de los ponderadores*/           
      "cadPonderadores": cadenaPonderadores,/* Cadena de ponderadores ejemplo = 1,2,3,4,5,6,7,8*/
      "status":1,//-> Status de la referencia (0 = Desactivado 1 = Activado (Eliminar)
      "idAlgoritmo":this.formasdecobro,

    };
    console.log('Peticion Guarda Referencia');
    
    console.log(parameter);

    this.service.post(parameter, path, 3).subscribe(
        data => {
            let object = JSON.parse(JSON.stringify(data));
            console.log(object);
            if(object.codE === 0){
              this.showBusqueda = true;
              this.showFomulario = false;
              this.consreferenciasdaz();
            }else{
                this.notifications.error(object.msgE);
            }
        },
        error => {
            super.loading(false);
            this.notifications.error('Error de servicio');
        },
        () => super.loading(false)
    );

  }

  private cancelarReferncia(): void{
    this.showBusqueda = true;
    this.showFomulario = false;
  }

  private CargarIdReferencia(idRef):void{
    this.idReferencia =  idRef;
  }

  public eliminarReferencia():void{
    this.bloqueaBoton = false;

    console.log(this.idReferencia);
   
    super.loading(true);
    let path = '/depositoazteca/referenciasdaz/eliminareferenciasdaz/';
    let parameter: any = {
      "idInstitucion": this.ObjectDepositos.idInst,
      "idPais": this.ObjectDepositos.idPais,
      "idCuenta": this.ObjectDepositos.idCuenta,
      "idContratoDaz": this.ObjectDepositos.idContratoDaz,
      "idRef": this.idReferencia,
      "status": 0 //-> Status de la referencia (0 = Desactivado 1 = Activado

    };
    console.log(parameter);
    this.service.post(parameter, path, 3).subscribe(
        data => {
            let object = JSON.parse(JSON.stringify(data));
            if(object.codE === 0){
                console.log(object);
                this.consreferenciasdaz();
            }else{
                this.notifications.error(object.msgE);
            }
        },
        error => {
            super.loading(false);
            this.notifications.error('Error de servicio');
        },
        () => super.loading(false)
    );


  }


//   validamos la entrata de el teclado

  private validatorcampodinamico(e): boolean {
    this.tecla = document.all ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (
      this.tecla === 13 ||
      this.tecla === 8 ||
      this.tecla === 9 ||
      this.tecla === 37 ||
      this.tecla === 39
    ) {
      return true;
    }
    if (this.tecla >= 96 && this.tecla <= 105) {
      return true;
    }

    // Patron de entrada, en este caso solo acepta numeros
    if (Number(this.tiporeferencia) === 1) {
      this.patron = /[0-9]/;
    } else {
      this.patron = /[A-Za-z0-9]/;
    }

    this.tecla_final = String.fromCharCode(this.tecla);
    return this.patron.test(this.tecla_final);
  }

  private solonumero(e): boolean {
    this.tecla = document.all ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (
      this.tecla === 13 ||
      this.tecla === 8 ||
      this.tecla === 9 ||
      this.tecla === 37 ||
      this.tecla === 39
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
  private alfanumerico(e): boolean {
    this.tecla = document.all ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (
    this.tecla === 13 ||
    this.tecla === 8 ||
    this.tecla === 9 ||
    this.tecla === 37 ||
    this.tecla === 39||
    this.tecla === 32||
    this.tecla === 68
    ) {
    return true;
    }
    if (this.tecla >= 96 && this.tecla <= 105) {
    return true;
    }
    // Patron de entrada, en este caso solo acepta numeros
    this.patron = /[A-Za-z0-9]/;
    this.tecla_final = String.fromCharCode(this.tecla);
    return this.patron.test(this.tecla_final);
    }


    private validatorcampomax1(e): void {
      if(e !== ''){

        let valid:boolean;
        console.log(valid);

        if(e <= 30){
          valid = true;
        }else{
          valid = false;
        }

        if(valid){
          this.numberRespaldo1 = e;
        }else{
          this.posicionponderador1 = this.numberRespaldo1;
        }
      }else{
        this.numberRespaldo1 = e;
      }
  }

  private validatorcampomax2(e): void {
    if(e !== ''){
      let valid:boolean;
      console.log(valid);

      if(e <= 30){
        valid = true;
      }else{
        valid = false;
      }
      if(valid){
        this.numberRespaldo2 = e;
      }else{
        this.posicionponderador2 = this.numberRespaldo2;
      }
    }else{
      this.numberRespaldo2 = e;
    }
}
    

private modalUp(e):void {
  console.log(e);
 this.objguardaSpei = e.idReferencia;
 this.status=e.pagoSpei === true ? 1 : 0;
  this.modalSpei = true;
  console.log('Variabale SPEI');
  console.log(this.objguardaSpei);
  
   
}

public cancelaSpei() {
  this.consreferenciasdaz();
} 


public guradaConSpei() {
  super.loading(true);
  let path = '/depositoazteca/referenciasdaz/actualizarefspei/';
  let parameter: any = {
    "idRef": this.objguardaSpei,
    "status":this.status
  };
  console.log(parameter);
  this.service.post(parameter, path, 3).subscribe(
      data => {
          let object = JSON.parse(JSON.stringify(data));
          if(object.codE === 0){
            this.notifications.success('Referencia configurada correctamente');
            this.consreferenciasdaz();

          }else{
              this.notifications.error(object.msgE);
              this.consreferenciasdaz();
          }
      },
      error => {
          super.loading(false);
          this.notifications.error('Error de servicio');
          this.consreferenciasdaz();
      },
      () => super.loading(false)
  );
}


private calculaFecha(data): void {

  this.validafechaposiciona =  Number(data.length) + Number(this.validafechaposicionde) -1;

  console.log(this.formatoFecha);
  

}
private consultaAlgoritmo(){
  super.loading(true);
  let path = '/depositoazteca/referenciasdaz/conscattipoalgoritmo';
  let parameter: any = {
  };
  this.service.post(parameter, path, 3).subscribe(
      data => {
          let object = JSON.parse(JSON.stringify(data));
          if(object.codE === 0){
            console.log('Consulta General');
            console.log(object);
            this.tipoAlgoritmo=object.jsonResultado;
          }else{
              this.notifications.error(object.msgE);
          }
      },
      error => {
          super.loading(false);
          this.notifications.error('Error de servicio');
      },
      () => super.loading(false)
  );
}
cambioAlgoritmo(alg){
  if (alg==='2') {
    this.tiporeferencia=1;
    this.prefijoreferencia=2;
    this.validafecha=true;
    this.validafechaposicion=false;
    this.validaimporte=true;
    this.digitoverificador=true;
    this.ChangeDigitoVerificador();
    this.numCaracter = 5;
    this.mostrarlistaponderadores=true;
    this.validaimporteposicion=false;
    this.bloqueo = true;
    if (this.itemtotalponderadores[this.itemtotalponderadores.length-2]) {
      this.itemtotalponderadores[this.itemtotalponderadores.length-2].value="D";
    }
    
  } else {
    this.bloqueo = false;
    this.numCaracter = 1;
    this.validafechaposicion=true;
    this.validaimporteposicion=true;
  }
  
}

}
