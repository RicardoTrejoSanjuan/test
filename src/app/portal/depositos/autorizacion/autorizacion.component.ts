import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";

// import { Data } from '../instituciones';
import { ClassGenerica } from "../../../classGeneric/config";

import { Notifications } from "../../../classGeneric/notifications";

import { Service } from "../../../service/service";

import { FormControl } from "@angular/forms";

@Component({
  selector: "depositos",
  templateUrl: "autorizacion.html",
  styleUrls: [
    "../deposito.css",
    "autorizacion.css"
  ]
})
export class AutorizacionComponent extends ClassGenerica {
  private menuLateral: Array<Object>;
public objListAutorizacion: any;

  public shoTable: boolean = false;

  constructor(
    private service: Service,
    private router: Router,
    private notifications: Notifications
  ) {
    super();
    this.menuLateral = this.getMenuLateral();
    this.menuNavigation = this.menuNavigation();

    this.buscar();
  }

    private buscar(): void {
        super.loading(true);
        let objRequest = {};
        let uriRequest = "/depositoazteca/autorizaciones/consultacambios/";

        this.service.post(objRequest, uriRequest, 3).subscribe(
            data => {
            let objServiceResponse: any = JSON.parse(JSON.stringify(data));
            console.log(objServiceResponse);
            if (objServiceResponse.codE === 0) {
                if (objServiceResponse.jsonResultado.length !== 0) {
                  this.objListAutorizacion = objServiceResponse.jsonResultado;
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
       
    }

    private activar(item) {
      this.updateparameter(item);
      }
    
    private updateparameter(item): void {
        super.loading(true);
    
        let objRequest = {
          "idInstitucion": item.idInstitucion,
          "idPais": item.idPais,
          "idCuenta": item.idCuenta,
          "idContrato": item.idContrato,
          "status": item.statusCn,
        };
        let uriRequest = "/depositoazteca/autorizaciones/notificacambiosautorizados/";
        console.log(objRequest);
        this.service.post(objRequest, uriRequest, 3).subscribe(
          data => {
            let objServiceResponse: any = JSON.parse(JSON.stringify(data));
            console.log(objServiceResponse);
            if (objServiceResponse.codE === 0) {
              this.buscar();
              this.notifications.info("Activado correctamente");
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
}
