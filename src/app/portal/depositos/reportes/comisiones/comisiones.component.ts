import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";

// import { Data } from '../instituciones';
import { ClassGenerica } from "../../../../classGeneric/config";


import { Notifications } from "../../../../classGeneric/notifications";

import { Service } from "../../../../service/service";

import { FormControl } from "@angular/forms";
import { HttpModule, JsonpModule, Jsonp, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import moment  from "moment";
import { JsonToCsv } from '../../../../classGeneric/jsontocsv';
 

@Component({
  selector: "depositos",
  templateUrl:
  "comisiones.html",
  styleUrls: [
    "../../deposito.css",
    "../../parametrizacion-contratos-daz/parametrizacion.css"
  ]
})
export class ComisionesComponent extends ClassGenerica {
  public menuLateral: Array<Object>;
  public objSorter: any;
  public canal: any;
  public empresa: any;
  public contrato: any;
  public fechaInicio: any;
  public fechaFin: any;
  public empresas: any;
  public canales:any;
  public contratos: any;
  public nd2:any;
  public nd5:any;
  public asc : boolean = false;
  public desc: boolean = false;
  public def: boolean = true;
  public columna: any;
  public count:any;
  public countN:any;
  public countF:any;
  public objSortercopy:any;
  public countRegistros: any;
  public ComisionesVentanilla:any;
  public Apostrofe: any='`';

  public minFechaNacimiento:any;
  public maxFechaNacimiento:any;
  

  // datePicker Prueba Test A
  
model: any = { date: { year: 2018, month: 10, day: 9 } };

// Fin


  constructor(
    private service: Service,
    private router: Router,
    private notifications: Notifications,
    private jsonToCsv : JsonToCsv
  ) {
    super();
    this.menuLateral = this.getMenuLateral(1);
    this.menuNavigation = this.menuNavigation();
    console.log(this.menuLateral);
    //this.consreferenciasdaz();
    this.consultaCanal();
    this.consultaEmpresa();
    this.count = 0;
    this.countN= 0;
    this.countF = 0;
    
  

  };

  public comosionesCobradas() {


    if (this.canal === 'null' || this.canal === 'undefined' || this.canal === undefined) {
      this.canal = null;
    }

    if (this.empresa === 'null' || this.empresa === "undefined" || this.empresa === undefined) {
      this.empresa = null;
    } 

    if (this.contrato === 'null' || this.contrato === 'undefined' || this.contrato === undefined) {
      this.contrato = null;
    }

    

    if (this.fechaInicio === undefined  || this.fechaInicio === null || this.fechaInicio === '') {
      let today = moment().format('YYYY-MM-DD'); 
      
             this.fechaInicio =today;
             this.fechaFin = today;
    }


    if (this.fechaFin === undefined || this.fechaFin === null || this.fechaFin === '') {
      let today = moment().format('YYYY-MM-DD'); 
      
             this.fechaInicio =today;
             this.fechaFin = today;
    }

    if (this.fechaInicio !== null || this.fechaInicio !== ""  || this.fechaInicio !== undefined) {
      let nd:number[] = this.fechaInicio.split('-');
      nd = nd.reverse();
      this.nd2  = nd.join('-');
  
      
    }
  
    if (this.fechaInicio !== null || this.fechaInicio !== ""|| this.fechaFin !== undefined) {
      let nd4:number[] = this.fechaFin.split('-');
      nd4 = nd4.reverse();
     this.nd5  = nd4.join('-');

    }

    let parameter2: any = {
      nomInstitucion: this.empresa,
      idCanal: this.canal,
      idContrato: this.contrato,
      fechaInicio: this.nd2,
      fechaFin: this.nd5
    };
    console.log('Pasa parametros ngModel');
    
    console.log(parameter2);
    

    super.loading(true);
    let path = '/depositoazteca/resportesdaz/repcomicobradas/';
   
    this.service.post(parameter2, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        let object2 = JSON.parse(JSON.stringify(data));
       
        if (object.codE === 0) {
          console.log('Sorter');
          console.log(object);
          this.objSorter = object.jsonResultado;
          console.log(JSON.stringify(this.objSorter));
          this.countRegistros = object.jsonResultado.length;
          this.printExcel50( this.countRegistros);
          console.log(this.objSorter);


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




private consultaCanal() {
  
  
  super.loading(true);
  let path = '/depositoazteca/resportesdaz/consultacanales/';
  let parameter: any = {
 
   };
  console.log(parameter);
  this.service.post(parameter, path, 3).subscribe(
    data => {
      let object = JSON.parse(JSON.stringify(data));
     
      if (object.codE === 0) {
        console.log(object);
        this.canales = object.jsonResultado;
        console.log('canales');
        console.log(this.canales);


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

private consultaEmpresa() {
  
  
  super.loading(true);
  let path = '/depositoazteca/resportesdaz/consultainstrep/';
  let parameter: any = {
    "idCanal": null ,
    "nomInstitucion": null
   };
  console.log(parameter);
  this.service.post(parameter, path, 3).subscribe(
    data => {
      let object = JSON.parse(JSON.stringify(data));
     
      if (object.codE === 0) {
        console.log(object);
        this.empresas = object.jsonResultado;
        console.log('cONSULTA emPRESA');
        console.log(this.empresas);


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

public consultaContrato(dataEmpresa) {
  
  if (dataEmpresa === 'undefined') {
    this.contrato = 'undefined';
    let cleanObj:any = [{
      
          }];
    this.contratos = cleanObj;
    return null;
  }
  super.loading(true);
  let path = '/depositoazteca/resportesdaz/consultacontrep';
  let parameter: any = {
    "idPais": 1 ,
    "idInstitucion": Number (dataEmpresa)
   };
   console.log('');
  console.log(parameter);
  this.service.post(parameter, path, 3).subscribe(
    data => {
      let object = JSON.parse(JSON.stringify(data));
     
      if (object.codE === 0) {
        console.log(object);
        this.contratos = object.jsonResultado;
        console.log('Consulta de contratos');
        console.log(this.contratos);


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


public mainSort(_item: any){
  this.columna = _item;
  console.log(this.columna);
  this.count= this.count +1;



  if (this.count ===1) {
    this.desc = true;
    this.def = false;
    this.asc = false;
   
    this.objSorter.sort(function(a: any, b: any) {
      return b[_item] - a[_item];
    });
  }
  if (this.count === 2 ) {
    this.desc = false;
    this.asc = true;
    this.def = false;
    this.objSorter.sort(function(a: any, b: any) {
      return a[_item] - b[_item];
    });
  }
  if (this.count ===3 ) {
    this.count =0;
    this.desc = false;
    this.asc = false;
    this.def = true;
    this.objSorter = JSON.parse(JSON.stringify(this.objSortercopy));;
  }

}


public mainNombres(_item: any) {
  this.columna = _item;
  console.log(this.columna);
  console.log('SortNames');
  
  this.countN= this.countN +1;
 
  if (this.countN ===1) {
    this.desc = true;
    this.def = false;
    this.asc = false;
   
    this.objSorter.sort(function(a: any, b: any) {
      return (a[_item] > b[_item]) ? 1 : ((b[_item] > a[_item]) ? -1 : 0);
    });
  }
  if (this.countN === 2 ) {
    this.desc = false;
    this.asc = true;
    this.def = false;
    this.objSorter.sort(function(a: any, b: any) {
      return (a[_item] < b[_item]) ? 1 : ((b[_item] < a[_item]) ? -1 : 0);
    });
  }
  if (this.countN ===3 ) {
    this.countN =0;
    this.desc = false;
    this.asc = false;
    this.def = true;
    this.objSorter = JSON.parse(JSON.stringify(this.objSortercopy));;
  }

  
}

public mainDates(_item:any) {
  this.columna = _item;
  console.log(this.columna);
  console.log('SortNames');
  
  this.countF= this.countF +1;


  if (this.countF ===1) {
    this.desc = true;
    this.def = false;
    this.asc = false;

    this.objSorter.sort(function(a: any, b: any) {
      let arrDate1: any[] = a.fechaOpera.split('-');
      let arrDate2: any[] = b.fechaOpera.split('-');
      let date1: Date = new Date(arrDate1.shift(), arrDate1.shift(), arrDate1.shift());
      let date2: Date = new Date(arrDate2.shift(), arrDate2.shift(), arrDate2.shift());
      console.log(date1, date2);


      if (date1 < date2) {           
        return -1;
    } else if (date2 < date1) {    
        return 1;
    } else {               
        return 0;            
    }

    });
  }
  if (this.countF === 2 ) {
    this.desc = false;
    this.asc = true;
    this.def = false;
  
    this.objSorter.sort(function(a: any, b: any) {
      let arrDate1: any[] = a.fechaOpera.split('-');
      let arrDate2: any[] = b.fechaOpera.split('-');
      let date1: Date = new Date(arrDate1.shift(), arrDate1.shift(), arrDate1.shift());
      let date2: Date = new Date(arrDate2.shift(), arrDate2.shift(), arrDate2.shift());
      console.log(date1, date2);


      if (date1 > date2) {           
        return -1;
    } else if (date2 > date1) {    
        return 1;
    } else {               
        return 0;            
    }

    });

    
  }
  if (this.countF ===3 ) {
    this.countF =0;
    this.desc = false;
    this.asc = false;
    this.def = true;
    this.objSorter = JSON.parse(JSON.stringify(this.objSortercopy));;
  }
  
}



private SortTableByString(_item: any): void {
 
    this.objSorter.sort(function(a: any, b: any) {
    
        return (a[_item] > b[_item]) ? 1 : ((b[_item] > a[_item]) ? -1 : 0);
    });
}


public printExcel50(registros){


   if (registros >= 50) {
    this.notifications.success('La consulta excede los 50 registros, Archivo excel generado automaticamente');
    if (this.objSorter !== '' && this.objSorter !== null && this.objSorter !== undefined) {
      
            let array : any = [];
            let printObjSorter : any [] = [];
            this.objSorter.forEach((element: any) => {
              element.numCuentaConc = "'" + element.numCuentaConc;
              element.numCuentaCom = "'" + element.numCuentaCom;
              element.trackingNum = "'" + element.trackingNum;
              element.importe = "$" + element.importe;
              element.comEmi = "$" + element.comEmi;
              element.ivaComEmi = "$" + element.ivaComEmi;
              element.comDep = "$" + element.comDep;
              element.ivaComDep = "$" + element.ivaComDep;
              
      
              for (let index in element) {
                  if (element.hasOwnProperty(index)) {
                    if(index === 'fechaOperacion'){
                      array['afechaOperacion'] = element[index];
                     
                    } else {
                      array[index] = element[index];
                    }
                    
      
                  }
                }
            });
            this.jsonToCsv.generateToExcelG(this.objSorter,'ReporteDeCosimisones');
          
            
           
            
            setInterval(()=> {
              super.loading(false); },3000); 
          }else{
          
            this.notifications.error(
              "Error",
              "Intentelo mas tarde"
            );
          }
          
   }

   if (registros >= 49) {
    this.notifications.success('¡Archivo excel creado correctamente!');
    if (this.objSorter !== '' && this.objSorter !== null && this.objSorter !== undefined) {
      
            let array : any = [];
            let printObjSorter : any [] = [];
            this.objSorter.forEach((element: any) => {
              element.numCuentaConc = "'" + element.numCuentaConc;
              element.numCuentaCom = "'" + element.numCuentaCom;
              element.trackingNum = "'" + element.trackingNum;
              element.importe = "$" + element.importe;
              element.comEmi = "$" + element.comEmi;
              element.ivaComEmi = "$" + element.ivaComEmi;
              element.comDep = "$" + element.comDep;
              element.ivaComDep = "$" + element.ivaComDep;
              
      
              for (let index in element) {
                  if (element.hasOwnProperty(index)) {
                    if(index === 'fechaOperacion'){
                      array['afechaOperacion'] = element[index];
                     
                    } else {
                      array[index] = element[index];
                    }
                    
      
                  }
                }
            });
            this.jsonToCsv.generateToExcelG(this.objSorter,'ReporteDeCosimisones');
          
            
           
            
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
  

}




