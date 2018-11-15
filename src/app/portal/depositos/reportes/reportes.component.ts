import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";

// import { Data } from '../instituciones';
import { ClassGenerica } from "../../../classGeneric/config";


import { Notifications } from "../../../classGeneric/notifications";

import { Service } from "../../../service/service";

import { FormControl } from "@angular/forms";

import { JsonToCsv } from '../../../classGeneric/jsontocsv';

@Component({
  selector: "depositos",
  templateUrl: "reportes.html",
  styleUrls: [
    "../deposito.css",
    "reportes.css"
  ]
})
export class BusquedaComponent extends ClassGenerica {
  private menuLateral: Array<Object>;

  shoTable: boolean = false;
  object: any;

  activarRadio: boolean = true;

  activarBtnActualizar: boolean = true;

  nombreCuenta: string;

  Reportes: any;

  FormaJson: any;


  constructor(
    private service: Service,
    private router: Router,
    private notifications: Notifications,
    private jsonToCsv : JsonToCsv
  ) {
  
    super();

           this.menuLateral = this.getMenuLateral();
           this.menuNavigation = this.menuNavigation();
           let pathredirec = JSON.parse(JSON.stringify(this.menuLateral[0])).url;
           console.log(pathredirec);
           this.router.navigate([pathredirec]);
           this.getReportes();
   
  }


  private getReportes(): void {
    super.loading(true);

    let objRequest = {
    
    };
    let uriRequest = "/depositoazteca/resportesdaz/reportedeposito";
    console.log('Peticion');
    console.log(objRequest);
    this.service.post(objRequest, uriRequest, 3).subscribe(
      data => {
        let objServiceResponse: any = JSON.parse(JSON.stringify(data));
        if (objServiceResponse.codE === 0) {
         console.log('Reportes');
       

         this.Reportes = objServiceResponse.jsonResultado;
         console.log('Variable iterable Reportes');
         console.log(this.Reportes);

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



public getAll(): void{
  super.loading(true);

  for (var index = 0; index < this.Reportes.length; index++) {
    this.FormaJson = this.Reportes[index];
    
  }

  this.Reportes.forEach(element => {

    this.FormaJson = this.Reportes;
    
  });

  let toExcel = {

    NúmerodecontratosdeDepósitoAzteca: this.FormaJson.numCon,
    NúmerodeoperacionesdeDepósitoAzteca: this.FormaJson.numOpe,
    MontodelasoperacionesdeDepósitoAzteca: this.FormaJson.montoOpe,
    Canaldondeserealizólaoperación: this.FormaJson.canal
    
    };
    console.log(this.Reportes);
    console.log(toExcel);


    if (this.Reportes !== '' && this.Reportes !== null && this.Reportes !== undefined) {
      this.jsonToCsv.generateToExcel(this.Reportes,'reportes');
      setInterval(()=> {
        super.loading(false); },3000); 
    }else{

      this.notifications.error(
        "Error",
        "Intentelo mas tarde"
      );
    }

    }


    
  

   




}
