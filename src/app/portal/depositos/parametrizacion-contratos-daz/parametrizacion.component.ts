import { Component, ViewChild, AfterViewInit, OnInit} from "@angular/core";
import { Router } from "@angular/router";

// import { Data } from '../instituciones';
import { ClassGenerica } from "../../../classGeneric/config";

import { Notifications } from "../../../classGeneric/notifications";

import { Service } from "../../../service/service";

import { FormControl } from "@angular/forms";

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: "depositos",
  templateUrl:
    "busqueda.html",
  styleUrls: [
    "../deposito.css",
    "parametrizacion.css"
  ]
})
export class ParametrizacionComponent extends ClassGenerica implements AfterViewInit, OnInit{
  private menuLateral: Array<Object>;

  institucionCtrl: FormControl;
  bandIst: boolean;
  objFiltrosHandler: Object;
  institucion: any;
  statusVariables: any = super.getAttr("depositos");
  // sessionInstitucion: any;

  nameInstitucion: string = "";
  rfcInstitucion: string = "";

  activarDataConsulta: boolean = false;

  public listcuentas = [];
  public listcontratos = [];

  public activarContratosDAZ: boolean = false;

  public idCuenta: number;

  public idContrato: number;

  public esNuevaBusqueda: boolean;
  public tamañoCadenaSeleccion: number;

  public modalContrato: boolean = false;

  public generacionAutomatica: any;

  public contatoVanidad: boolean = false;

  public predefinido:any;

  public otro:any;

  public bloqueaCampo: boolean = false;
  
  public bloqueaOtro: boolean =false;

  public bolqueaPredefinido: boolean = false;

  public tipoCuentas:any;

  public tipoCuentasVanidad:any;

  public idCto:any;

  public idctoVanidad: any;

  public desCtoVanidad: any;

  public clabeInterbancaria: any;

  public isAvailable:any;

  public showDialogAlert:any;

  public modalFormulario:any;

  constructor(
    private service: Service,
    private router: Router,
    private notifications: Notifications
  ) {
    super();
    this.menuLateral = this.getMenuLateral();
    this.menuNavigation = this.menuNavigation();

    
    this.bandIst = true;
    this.objFiltrosHandler = {
      agrupamientoRequest: "INSTITUCION",
      anyoneSearchResult: false,
      institucionSelected: false
    };

    this.esNuevaBusqueda = true;
    this.tamañoCadenaSeleccion = 0;

    this.institucion = 0;
    
    this.institucionCtrl = new FormControl();
  }

  listaInstituciones: Observable<any[]>;

  ngOnInit() {
    console.log(this.institucionCtrl.valueChanges);
    
    this.listaInstituciones = this.institucionCtrl.valueChanges
      .pipe(
        startWith(null),
        map(name => this.filtrarInstituciones(name))
      );

    this.mainReturn();
  }

  ngAfterViewInit() {
    
  }

  mainReturn() {
    console.log("Status Variables");
    console.log(this.statusVariables);

    if (this.statusVariables !== null) {
      this.filtrarInstituciones(this.statusVariables.name);
      this.consultacanales(this.statusVariables);
      this.consultacontratosdaz(this.statusVariables);
      // this.sessionInstitucion = this.statusVariables.name;
      console.log(this.institucionCtrl);
      
      this.institucionCtrl.setValue(this.statusVariables.name);
    }
  }

  filtrarInstituciones(val) {
    console.log('Primer predictivo');
    let instituciones: any[] = [];
    // if (this.bandIst) {
      if (val !== null && val !== undefined) {
        // if (val.length > 0 && this.tamañoCadenaSeleccion > 0) {
        //   if (val.length !== this.tamañoCadenaSeleccion) {
        //     this.esNuevaBusqueda = true;
        //   }
        // }

        // if (this.esNuevaBusqueda) {
          let _objFiltrosHandler: any = this.objFiltrosHandler;

          _objFiltrosHandler.anyoneSearchResult = false;

          if (
            val.length > 2 &&
            val !== null &&
            val !== undefined &&
            val !== ""
          ) {
            super.loading(true);
            let objRequest = { cadena: val };
            let uriRequest = "/depositoazteca/servicios/consultainstitucion";
            console.log(objRequest);
            this.service.post(objRequest, uriRequest, 3).subscribe(
              data => {
                
                let objServiceResponse: any = JSON.parse(JSON.stringify(data));
                console.log(objServiceResponse);
                if (objServiceResponse.codE === 0) {
                  if (objServiceResponse.jsonResultado !== null) {
                    if (objServiceResponse.jsonResultado.length > 0) {
                      for (let inst of objServiceResponse.jsonResultado) {
                        instituciones.push({
                          name: inst.nomRazonSocial,
                          idInst: inst.idInstitucion,
                          idClienteAlnova: inst.idClienteAlnova,
                          rfcInstitucion: inst.rfcInstitucion,
                          idPais: inst.idPais
                        });
                      }
                    } else {
                      _objFiltrosHandler.anyoneSearchResult = true;
                      _objFiltrosHandler.institucionSelected = false;
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
                  _objFiltrosHandler.institucionSelected = false;
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
          } else {
            _objFiltrosHandler.institucionSelected = false;
          }
          this.objFiltrosHandler = _objFiltrosHandler;
        // }
      } else {
        this.institucion = 0;
      }
    // }
    this.bandIst = true;
    return instituciones;
  }
  private getInstitucion(data) {
    console.log(data);
    // super.saveData(null,'depositos');
     this.listcuentas = [];
  this.listcontratos = [];
  
    this.esNuevaBusqueda = false;
    this.tamañoCadenaSeleccion = data.lengh;

    this.nameInstitucion = data.name;
    this.rfcInstitucion = data.rfcInstitucion;
    super.saveData(data, "depositos");
    this.consultacanales(data);
  }

  private consultacanales(data): void {
    super.loading(true);
    let path = "/depositoazteca/contratodaz/conscontratodaz/";
    let object: any = {
      idInstitucion: data.idInst,
      idPais: data.idPais,
      numCuenta: null
    };
    this.service.post(object, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        console.log(object);
        if (object.codE === 0) {
        this.activarDataConsulta = true;
        this.activarContratosDAZ = false;
        this.listcuentas = object.jsonResultado.listContratoDazCuentas;
        console.log(this.listcuentas);
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

  private mostrarContratos(cuenta) {
    let depositos = super.getAttr("depositos");
    depositos.numCuenta = cuenta;
    super.saveData(depositos, "depositos");
    this.consultacontratosdaz(depositos);
  }

  private consultacontratosdaz(data): void {
    super.loading(true);
    let path = "/depositoazteca/contratodaz/conscontratodaz/";
    let object: any = {
      idInstitucion: data.idInst,
      idPais: data.idPais,
      numCuenta: data.numCuenta
    };
    console.log(object);
    this.service.post(object, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        console.log(object);
        if (object.codE === 0) {
          this.activarContratosDAZ = true;
          this.listcontratos = object.jsonResultado.listContratoDaz;
          if (this.listcontratos.length !== 0) {
            this.idCuenta = this.listcontratos[0].idCuenta;
            this.clabeInterbancaria = this.listcontratos[0].ctosDazClave;
            let depositos = super.getAttr("depositos");
            depositos.idCuenta = this.idCuenta;
            depositos.ctosDazClave = this.clabeInterbancaria;
            super.saveData(depositos, "depositos");
          } else {
            this.idCuenta = null;

            let depositos = super.getAttr("depositos");
            depositos.idCuenta = this.idCuenta;
            super.saveData(depositos, "depositos");
          }
        } else  {
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


  private creaContradoDAZ(){
    //this.creaContratoDAZ();
    this.consultaTipoCuentaVanidad();
    this.modalContrato = true;

    this.generacionAutomatica = 1;
    this.predefinido = undefined;
    this.otro = '';
    this.lageneraciones();
  }


  public lageneraciones() {
    console.log('deshabilitar campos');

   
    if ( this.generacionAutomatica === 1) {
      this.bloqueaCampo =true;
      this.bloqueaOtro = true;
      this.bolqueaPredefinido = true;
      this.predefinido = undefined;
      this.otro = '';
      
    }else{
      this.bloqueaCampo = false;
      this.bloqueaOtro = false;
      this.bolqueaPredefinido = false;
    }
  }


private outData(data){
 
  
}

  public verificainputs(data){
    this.desCtoVanidad = data;
    console.log( this.desCtoVanidad);

    console.log('ngmodelPredefinido');
    console.log(this.predefinido);
    
    
    if (this.predefinido !== undefined) {
      this.bloqueaOtro = true;
      this.otro = '';
    }else{
      this.bloqueaOtro = false;
    } if ( this.otro !== "" || this.otro !== undefined ) {
      this.bolqueaPredefinido = false;
    }else{
      this.bolqueaPredefinido = false;
    }

  }
  public verificainputs2(){
  if (this.otro !== "" || this.otro !== undefined ) {
      this.bolqueaPredefinido = true;
    }
      if (this.otro === "") {
      this.bolqueaPredefinido = false; 
    }
     
    

  }




  private agregarContratoDAZ() {
    super.loading(true);
    let data = super.getAttr("depositos");
    let path = "/depositoazteca/contratodaz/creacontratodaz/";
    let parameter: any = {
      idInstitucion: data.idInst,
      idPais: data.idPais,
      idCuenta: data.numCuenta,
      idContVanidad: null
    };
    console.log(parameter);
    this.service.post(parameter, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        if (object.codE === 0) {

          console.log(object);
          this.editarContratoDAZ(object.jsonResultado[0]);

          this.idCuenta = object.jsonResultado[1];
          let depositos = super.getAttr("depositos");
          depositos.idCuenta = this.idCuenta;
          super.saveData(depositos, "depositos");
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

  private CargarIdContrato(idContrato): void {
    this.idContrato = idContrato;
  }

  public eliminarContratoDAZ() {
    super.loading(true);
    let dataSesion = super.getAttr("depositos");
    let path = "/depositoazteca/contratodaz/eliminacontratodaz/";
    let parameter: any = {
      idInstitucion: dataSesion.idInst,
      idPais: dataSesion.idPais,
      idCuenta: dataSesion.idCuenta,
      idContrato: this.idContrato
    };
    console.log(parameter);
    this.service.post(parameter, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        console.log(object);
        if (object.codE === 0) {
          console.log(object);
          this.consultacontratosdaz(dataSesion);
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

  private editarContratoDAZ(data) {
    console.log(data);
    let depositos = super.getAttr("depositos");
    depositos.idContratoDaz = data.idContratoDaz;
    depositos.ctosDazClave = data.ctosDazClave;
    super.saveData(depositos, "depositos");
    this.router.navigate([
      "./depositos-referenciado/parametrizacioncontratos/liquidacion"
    ]);
  }


  private consultaTipoCuenta() {
    super.loading(true);
    console.log('Consulta Tipo Cuenta');
    
    console.log('Entro a Consulta Contrato DAZ');
    
    let dataSesion = super.getAttr("depositos");
    console.log('Datos de sesion');
    console.log(dataSesion);
    
    
    let path = "/depositoazteca/canales/consultacuentaliquida/";
    let object: any = {

      idInstitucion : dataSesion.idInst,
      idPais : dataSesion.idPais,
      idCta : dataSesion.idCuenta,
      idContrato : dataSesion.idContrato

     
    };
    console.log('Request');
    console.log(object);
    
    
    this.service.post(object, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        console.log(object);
        console.log('Response');
        if (object.codE === 0) {
        this.tipoCuentas = object.jsonResultado;
        console.log('consultaTipoCuenta');
        console.log(this.tipoCuentas);
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

  
  private consultaTipoCuentaVanidad() {
    super.loading(true);
    let dataSesion = super.getAttr("depositos");
    console.log('Datos de sesion');
    console.log(dataSesion);
    
    
    let path = "/depositoazteca/contratodaz/conscontvanidad/";
    let object: any = {

     
     
    };
    console.log('Request');
    console.log(object);
    
    
    this.service.post(object, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        console.log(object);
        console.log('Response');
        if (object.codE === 0) {
          this.tipoCuentasVanidad = object.jsonResultado;
          console.log('consultaTipoCuentaVanidad');
          console.log(this.tipoCuentasVanidad);
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




  public creaContratoDAZ() {
    super.loading(true);
    console.log('Entro a Contrato DAZ');
  
    let data = super.getAttr("depositos");
    console.log('Datos de sesion');
    console.log(data);

    if (this.predefinido === undefined && this.otro === '') {
      this.idctoVanidad = null;
    }

    if (this.predefinido !== undefined) {
      this.idctoVanidad = this.predefinido;
    }

    if (this.otro !== '') {
      this.idctoVanidad = this.otro;
    }
    
    
    let path = "/depositoazteca/contratodaz/creacontratodaz/";
    let object: any = {
      idInstitucion: data.idInst,
      idPais: data.idPais,
      idCuenta: data.numCuenta,
      idContVanidad: this.idctoVanidad
    };
    console.log('Peticion Crea Contrato');
    console.log(object);
    
    this.service.post(object, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        console.log('Response Crea Contrato');
        console.log(object);
        if (object.codE === 0) {
          this.modalContrato = false;
          this.idContrato =object.jsonResultado[0];
          this.idCto = object.jsonResultado[0];
          this.idCuenta = object.jsonResultado[1];
          let depositos = super.getAttr("depositos");
          depositos.idCuenta = this.idCuenta;
          depositos.idContrato = this.idCto;
          super.saveData(depositos, "depositos");
          console.log(super.getAttr("depositos"));
        
          this.consultacontratosdaz(depositos);

        
          //let depositos = super.getAttr("depositos");



          console.log('Response');
          let responseDAZ = object.jsonResultado;
          console.log('Crea Contrato DAZ');
          console.log(responseDAZ);
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



  private guardaNuevosContratos() {
    super.loading(true);
    //let dataSesion = super.getAttr("depositos");
    let path = "/depositoazteca/contratodaz/eliminacontratodaz/";
    let parameter: any = {
      idCuenta: 2821,
      contratoDaz: 10073,
      idInstitucion: 3520,
      idPais: 1,
      idCuentPagoRef: 157,
      idTipoCuenta: 2,
      cuentaDeposito: "01000100058994",
      idTipoCobroComi: 1,
      status: 1
    };
    console.log(parameter);
    this.service.post(parameter, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        console.log(object);
        if (object.codE === 0) {
          console.log(object);
          //this.consultacontratosdaz(dataSesion);
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


  public solonumero(e): boolean {
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

}
