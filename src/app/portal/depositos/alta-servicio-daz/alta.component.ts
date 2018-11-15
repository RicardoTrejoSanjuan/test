import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";

// import { Data } from '../instituciones';
import { ClassGenerica } from "../../../classGeneric/config";

import { Notifications } from "../../../classGeneric/notifications";

import { Service } from "../../../service/service";

@Component({
  selector: "depositos",
  templateUrl: "busqueda.html",
  styleUrls: [
    "../deposito.css",
    "alta.css"
  ]
})
export class BusquedaComponent extends ClassGenerica {
  private menuLateral: Array<Object>;

  shoTable: boolean = false;
  object: any;

  activarRadio: boolean = true;

  activarBtnActualizar: boolean = true;

  nombreCuenta: string;

  ojbContainer:any;

  showDialogAlert: Boolean = false;

  statusinp:any;
  statusinp2:any;
  pasaParametrocta: any;

  numCtaGlobal: any;

  busquedaActualiza: Boolean = false;

  displayModal: boolean = true;
  desicion:any;
  


  constructor(
    private service: Service,
    private router: Router,
    private notifications: Notifications
  ) {
    super();
    this.menuLateral = this.getMenuLateral();
    this.menuNavigation = this.menuNavigation();
  }

  private getInstitucion(data) {
    this.shoTable = true;
    this.object = {
      idAlnova: data.idClienteAlnova,
      cuenta: data.idCuenta,
      numCuenta:data.numCuenta,
      descripcion: data.descripcion,
      institucion: data.nomcInstitucion,
      estatus: data.status
    };
    this.activarRadio = data.status;
  }

  private Changeradio(evt) {
    var target = evt.target;
    if (target.checked) {
      if (this.activarRadio !== this.object.estatus) {
        this.activarBtnActualizar = false;
      } else {
        this.activarBtnActualizar = true;
      }
    }
  }
    public buscar(): void {
        if (this.nombreCuenta !== "" && this.nombreCuenta !== undefined) {
          this.numCtaGlobal = this.nombreCuenta;
        super.loading(true);
        let objRequest = { numCuenta: this.nombreCuenta };
        let uriRequest = "/depositoazteca/servicios/consultactastatus";
          console.log(objRequest);
        this.service.post(objRequest, uriRequest, 3).subscribe(
            data => {
            let objServiceResponse: any = JSON.parse(JSON.stringify(data));
            console.log(objServiceResponse);
            if (objServiceResponse.codE === 0) {
              objServiceResponse.jsonResultado.forEach(element => {
                  if (element.cuentaDualidad===0) {
                    element.cuentaDualidadStatus=false;
                  } else {
                    element.cuentaDualidadStatus=true;
                  }
              });
              console.log(objServiceResponse);
            this.ojbContainer = objServiceResponse.jsonResultado;

                if (objServiceResponse.jsonResultado.length !== 0) {
                this.getInstitucion(objServiceResponse.jsonResultado[0]);
                } else {
                this.notifications.info("No se encontraron coincidencias");
                }
            } else {
                this.notifications.info(
                "El servidor respondio con algun fallo -> [" +
                    objServiceResponse.msgE +
                    "]"
                );
            }
            },
            error => {
            this.notifications.error(
                "Error",
                "Ha ocurrido una falla en la peticion -> [" + error + "]"
            );
            },
            () => super.loading(false)
        );
        } else {
        this.notifications.info("Ingrese Número de cuenta");
        }
    }

    private actualizarestatus(data,item) {
      console.log('Valor del input');
      console.log(data.target.checked);

      this.showDialogAlert = true;
      
        this.statusinp;

        if (data.target.checked === true) {
          this.statusinp = 1;
        } else {
          this.statusinp= 2;
        }

        this.desicion=1;
        this.pasaParametrocta = item.idCuenta;
  
      }
    
    public updateparameter(): void {
      
      this.showDialogAlert = false;
      this.busquedaActualiza=true;
        super.loading(true);
    
        let objRequest = {
          idCta: this.pasaParametrocta,
          status: this.statusinp
        };
        console.log('Peticion altaBajaServ ');
        console.log(objRequest);
        let uriRequest = "/depositoazteca/servicios/altaBajaServ";
    
        this.service.post(objRequest, uriRequest, 3).subscribe(
          data => {
            let objServiceResponse: any = JSON.parse(JSON.stringify(data));
            if (objServiceResponse.codE === 0) {
             
                this.nombreCuenta = this.numCtaGlobal;
                this.notifications.success(objServiceResponse.msgE );
                this.buscar();
              console.log('Respuesta altaBajaServ');
                this.object.estatus = this.activarRadio;
                this.activarBtnActualizar = true;
            } else {
              this.notifications.info(
                "El servidor respondio con algun fallo -> [" +
                  objServiceResponse.msgE +
                  "]"
              );
            }
          },
          error => {
            this.notifications.error(
              "Error",
              "Ha ocurrido una falla en la peticion -> [" + error + "]"
            );
          },
          () => super.loading(false)
        );
    }


    public alfanumerico(e): boolean {
      this.tecla = document.all ? e.keyCode : e.which;
      //Tecla de retroceso para borrar, siempre la permite
      if (
        this.tecla === 13 ||
        this.tecla === 8 ||
        this.tecla === 9 ||
        this.tecla === 37 ||
        this.tecla === 39||
        this.tecla === 32
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
    
    actualizarcuentaDualidadStatus(event,item){
      console.log('Valor del input');
      console.log(event.target.checked);
    
      this.showDialogAlert = true;
      
        this.statusinp2;

        if (event.target.checked === true) {
          this.statusinp2 = 1;
        } else {
          this.statusinp2= 0;
        }

        this.desicion=2;
        this.pasaParametrocta = item;
        console.log(item);
    }

    private updateparameterDualidad(): void {
      
      this.showDialogAlert = false;
      this.busquedaActualiza=true;
        super.loading(true);
    
        let objRequest = {
          idCta: this.pasaParametrocta.idCuenta,
          ctaDualidad: this.statusinp2,
          numCuenta:this.pasaParametrocta.numCuenta,
        };
        console.log('Peticion altaBajaServ ');
        console.log(objRequest);
        let uriRequest = "/depositoazteca/servicios/dualidad/cuenta";
    
        this.service.post(objRequest, uriRequest, 3).subscribe(
          data => {
            let objServiceResponse: any = JSON.parse(JSON.stringify(data));
            if (objServiceResponse.codE === 0) {
             
                this.nombreCuenta = this.numCtaGlobal;
                this.buscar();
               
              
              console.log('Respuesta altaBajaServ');
              console.log(objServiceResponse);
                this.object.estatus = this.activarRadio;
                this.activarBtnActualizar = true;
                this.notifications.success(objServiceResponse.msgE );
            } else {
              this.notifications.info(
                "El servidor respondio con algun fallo -> [" +
                  objServiceResponse.msgE +
                  "]"
              );
              this.buscar();
            }
          },
          error => {
            this.notifications.error(
              "Error",
              "Ha ocurrido una falla en la peticion -> [" + error + "]"
            );
          },
          () => super.loading(false)
        );
    }
}
