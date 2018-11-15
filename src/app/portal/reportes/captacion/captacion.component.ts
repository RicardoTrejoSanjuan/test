import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// import { ClassGenerica } from '../../../classGeneric/config';
import {  Pagination } from '../../../classGeneric/pagination';
import { Service } from '../../../service/service';
//graficas
import { GraficaComponent } from '../../../graficas-highchart/graficas-highchart.component';
import { GRAFICAS } from '../../../constants/graficas';
import { ConfGraficaPie } from '../../../interfaces/interfacesGraficas';
import { ConfGraficaColumn } from '../../../interfaces/interfacesGraficas';
import * as _ from 'underscore';
import { Observable }     from 'rxjs/Observable';
import { Notifications} from '../../../classGeneric/notifications';
import { JsonToCsv } from '../../../classGeneric/jsontocsv';
import { forEach } from '@angular/router/src/utils/collection';
import { FilterTable } from '../../../pipes/pipes-portal';

@Component({
  selector: 'reportes-captacion',
  templateUrl: 'captacion.component.html',
  styleUrls: [
    'templates/captacion.component.css',
    '../credito/credito.component.css'
  ],
  /*animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity:0}),
        animate(500, style({opacity:1})) 
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(500, style({opacity:0})) 
      ])
    ])
  ]*/
})
export class ReportesCaptacion extends Pagination {

  private solicitudesFinalizadas: any;
  private solicitudesTotales: any;
  private solicitudesActivas: any;
  private solicitudesXcaptacion: any;
  private solicitudesXenlace: any;

  private datosCaptacionDia: any;

  private isTableView: boolean;
  private showTableInst: boolean;

  private strBusqueda: string;

  menuLateral: Array<Object>;
  confGrafica: ConfGraficaPie;
  confGraficaColumnas: ConfGraficaColumn;
  reportesEmpleados: any;
  reportesEstatus: any;
  solicitudesEstatus: any;
  solicitudesPendientes: any;
  reportesInstitucionesEstatus: any;
  reportesEstatus2: any;
  reportesInstitucionesEstatus2: any;
  paletaColores: string[] = GRAFICAS.PALETA_COLORES;
  currentView: boolean;
  tipo: string;
  idInstitucion: any;
  nombreInstitucion: String;
  nombreEstatus:String;
  showTable:boolean;
  datosSegundaGrafica:any;
  pager: any = {};
  pagedItems: any[];
  tipoStatus: String;
  solicitudDevuelta: boolean;
  formatMiles:any;
  private lista: Array<Object>;
  @ViewChild(GraficaComponent) grafica: GraficaComponent;
  @ViewChild(GraficaComponent) gReporte: GraficaComponent;
  constructor(private service: Service, private notifications: Notifications, private router: Router, private jsonToCsv : JsonToCsv) {
    super();

    this.lista = [];
    this.pagedItems = [];
    this.datosCaptacionDia = null;
    this.showTableInst = false;
    this.strBusqueda = "";
    console.log("DatosCaptacionDia: ",this.datosCaptacionDia);
    
    this.solicitudesFinalizadas = null;
    this.solicitudesTotales = null;
    this.solicitudesActivas = null;
    this.solicitudesXcaptacion = null;
    this.solicitudesXenlace = null;

    this.menuLateral = this.getMenuLateral();
    this.currentView = true;
    this.idInstitucion=null;
    this.showTable=false;
    super.loading(true);
    this.datosSegundaGrafica=null;
    this.menuNavigation = this.menuNavigation();
    let pathredirec = JSON.parse(JSON.stringify(this.menuLateral[0])).url;
    this.router.navigate([pathredirec]);
    
  }
  ngAfterViewInit() {
    this.cargarPrimeraGrafica(null);
  }
  
  calcularPaletaColores(listSize: any) {
    let colorSize: any = GRAFICAS.PALETA_COLORES.length;

    if(listSize > colorSize) {
      for(let i = 1;i <= listSize; i++) {
        this.paletaColores.push(GRAFICAS.PALETA_COLORES[i-1]);
      }
    }
  }

  /*calcularSolicitudesGrl(jsonResultado: any): void {
        if(jsonResultado !== null && jsonResultado !== undefined) {
          this.limpiarSolicitudes();
          for(let rubro of jsonResultado) {
              this.solicitudesTotales += Number(rubro.cantidad);
              if(rubro.idStatus === 1) {
                this.solicitudesFinalizadas = (rubro.cantidad) ? Number(rubro.cantidad) : null;
              }
          }
          console.log(`Totales: ${this.solicitudesTotales} - Finales: ${this.solicitudesFinalizadas}`);
          this.solicitudesActivas = this.solicitudesTotales - this.solicitudesFinalizadas;
      }
  }*/

  calcularSolicitudesInst(item: any): void {
    if(item !== null && item !== undefined) {
      
      this.limpiarSolicitudes();

      let pendientes:any = item.data.filter(function(status) { 
        return status[3] === 7; 
      })[0];

      for(let status of item.data) {
          this.solicitudesTotales += Number(status[1]);
          if(status[3] === 1) {
            this.solicitudesFinalizadas = (!isNaN(status[1]) && !isNaN(pendientes[1])) ? Number(status[1]) + Number(pendientes[1]) : null;
          }
      }
      console.log(`Totales: ${this.solicitudesTotales} - Finales: ${this.solicitudesFinalizadas}`);
      this.solicitudesActivas = this.solicitudesTotales - this.solicitudesFinalizadas;
      console.log(this.solicitudesActivas);
      this.solicitudesXcaptacion = (item.hasOwnProperty('porCaptacion')) ? item.porCaptacion : 0;
      this.solicitudesXenlace = (item.hasOwnProperty('porEnlace')) ? item.porEnlace : 0;
    }
  }

  limpiarSolicitudes(): void {
    this.solicitudesFinalizadas = null;
    this.solicitudesTotales = null;
    this.solicitudesActivas = null;
    this.solicitudesXcaptacion = null;
    this.solicitudesXenlace = null;
  }

  cargarPrimeraGrafica(estatus) {
    this.tipo = estatus;
    super.loading(true);
    let path: string = '/AsesorBig/api/interno/captacion/reportes/captacionReporte';
    let params: object = { 'cuentasBig': estatus };
    this.service.post(params, path, 1).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        console.log("RESPONSE REPORTE CAPTACION: ",object);
        // this.calcularSolicitudesGrl(object.jsonResultado.reportesEstatus);
        super.loading(false);
        this.reportesEmpleados = object.jsonResultado.reportesEmpleados[0].totalEmpleados;
        this.formatMiles=object.jsonResultado.reportesEstatus;
        this.miles("cantidad");
        this.reportesEstatus = this.formatMiles;
        // this.reportesEstatus = this.reportesEstatus.filter(function(currentObj) { return currentObj.idStatus !== 1; });        
        this.formatMiles=object.jsonResultado.reportesInstitucionesEstatus;
        this.miles("total");
        this.calcularPaletaColores(this.formatMiles.length);
        let i=0;
        this.formatMiles.forEach(element => {
          element.color=this.paletaColores[i];
          i++;
        });
        this.reportesInstitucionesEstatus = this.formatMiles;

        this.construirTablaInst();
        
        //console.log(this.reportesEmpleados);
        if (object.codE === 0) {
          this.confGrafica = {
            type: 'pie',
            nameCategory: 'Asesor',
            title: '',
            subtitle: '',
            tooltip: true,
            dataLabels: false,
            drilldown: true,
            showLegends: false
          };
          this.grafica.CargarGrafica(object.jsonResultado.reportesInstitucionesEmpleados, this.confGrafica);
        } else {
          console.log("Error al obtener los datos");
        }
      }, error => {
        console.log("error del servidor");
      }
    );
  }
  consultar(item) {
    this.nombreEstatus=item.name;
    if (this.currentView) {
      this.idInstitucion=item.idInstitucion;
      for (let x of this.reportesInstitucionesEstatus) {
        console.log( this.nombreEstatus);
        if (item.name === x.name) {
          this.cargarSegundaGrafica(x);
          break;
        }
      }
    } else {
      console.log("funcion consultar tabla: "+item.name);
      if(item.name==="SOLICITUD DEVUELTA"){
        this.solicitudDevuelta=true;
      }else{
        this.solicitudDevuelta=false;
      }
      console.log(item);
      this.showTable=true;
      for (let x of this.reportesEstatus2) {
        if (x[0] === item.name) {
          console.log(item);
          this.tipoStatus=x[3];
          this.setPage(1);
        }
      }
    }
  }
  public consultarTabla = (page) : Observable<Object> =>{
    return Observable.create(observer => {
        super.loading(true);
        let path = '/AsesorBig/api/pdf/consulta';
        let params:object={
          "idInstitucion": this.idInstitucion,
          "idPais": 1,
          "idStatus":this.tipoStatus,
          "pagina": page,
          "cuentasBig":null
        };
        console.log("Datos que se envian");
        console.log(params);
        this.service.post(params,path,1).subscribe(
        data => {
                let object = JSON.parse(JSON.stringify(data));
                if(object.codE === 0){
                    let res: any = this.limpiarObjeto(object.jsonResultado);
                    observer.next(res);
                    observer.complete();
                }
        },
        error => {
            super.loading(false);
            console.log(error);
            this.notifications.error('Error de servicio');
            observer.next(null);
            observer.complete();
        },
        () => super.loading(false)
      );
    });
}

private consultarCaptacionDia(): void {
     
    super.loading(true);

    let serviceURL: string = '/api/portal/consulta/captaciones';
    let requestOBJ: object = { "idInstitucion": this.idInstitucion, "idPais":1 };

    this.service.post(requestOBJ, serviceURL, 3).subscribe(
      success => {
        let responseObj = JSON.parse(JSON.stringify(success));
        console.log("RESPONSE ['REPORTE CAPTACION POR DIA']: ",responseObj);
        if (responseObj.codE === 0) {

          this.datosCaptacionDia = this.obtenerDatosGrafica(responseObj.jsonResultado);
          
          this.confGraficaColumnas = {
              type: 'column',
              title: 'SOLICITUDES FINALIZADAS POR DÍA',
              subtitle: '',
              categories: [""],
              titleCategories: '',
              titleVertical: "CANTIDAD SOLICITUDES",
              valueSuffix: '',
              allowDecimals: false,
              drilldown: false,
              pointPadding: 150,
              showLegends: true,
              formatLabel: '',
              tooltip: true
          };

          this.gReporte.CargarGrafica(this.datosCaptacionDia, this.confGraficaColumnas);

        } else {
          console.log("Error al obtener los datos");
        }
      }, 
      error => {
        console.error("Error del servidor");
      },
      () => super.loading(false)
    );
}

private cambiarVista(idView: number): void {
  if(!isNaN(idView)) {
    this.isTableView = (idView === 0) ? true : false;
    if(!this.isTableView && this.datosCaptacionDia === null) { 
      this.consultarCaptacionDia(); 
    } else if(!this.isTableView && this.datosCaptacionDia !== null) {
      setTimeout(() => {
          this.gReporte.CargarGrafica(this.datosCaptacionDia, this.confGraficaColumnas);
      }, 0);
    }
  } else {
    console.log("El identificador de la vista no es número.");
  }
}

private obtenerDatosGrafica(_items: any): any {
  
  let collectionData = [];
  
  if(Array.isArray(_items) && _items.length > 0) {
    for(let item_ of _items) {
      let objData = {"name": null,"data": null};
      objData.name = item_.fecha;
      objData.data = [item_.totalCteCapt];
      collectionData.push(objData);
    }
  } else {
    console.log("La lista de datos de la grafica no es valida");
  }

  return collectionData;
}

setPage(page: number,rango?:number,total?:number) {
      console.log("funcion set page: "+page);
      console.log("total pages: "+this.pager.totalPages);
      if (page < 1 || page > this.pager.totalPages) {
          return;
      }
      let countPages = _.where(this.objectArrayPaginate, { page: page });
      console.log("count pages: "+countPages);
      if (countPages.length === 0) {
          let pagetoVisited = this.pageToVisited(page);
          this.consultarTabla(pagetoVisited).subscribe(
              data => {
                    let object = JSON.parse(JSON.stringify(data));
                    this.pager = this.getPager(object.total, page,object.rango);
                    this.addItemToArray(this.pager,object.consulta,object.rango,object.total);
                    this.pagedItems = _.where(this.objectArrayPaginate, { page: this.pager.currentPage });
              },
          );
      } else {
          this.pager = this.getPager(total, page,rango);
          this.pagedItems = _.where(this.objectArrayPaginate, { page: this.pager.currentPage });
      }

  }

  cargarSegundaGrafica(item) {
    //console.log( this.nombreEstatus);
    this.confGrafica = {
        type: 'pie',
        nameCategory: 'Asesor',
        title: '',
        subtitle: '',
        tooltip: true,
        dataLabels: false,
        drilldown: true,
        showLegends: false
    };
    if(item!==null) {
      if (item.hasOwnProperty("total") && Number((item.total).replace(',', '')) > 0) {
        console.log(item);
        this.currentView = false;
        this.nombreInstitucion=item.name;
        this.datosSegundaGrafica=item.data;
        this.idInstitucion=item.idInstitucion;
        this.reportesEstatus2 = item.data;
        this.solicitudesPendientes = (item.data).filter(function(currentObj) { return currentObj[3] === 7; })[0];
        this.solicitudesEstatus = (item.data).filter(function(currentObj) { return currentObj[3] !== 1 && currentObj[3] !== 7; });
        this.calcularSolicitudesInst(item);
        this.grafica.CargarGrafica(item.data, this.confGrafica);
      }
    } else {
      console.log("cargar segunda grafica");
      console.log(this.datosSegundaGrafica);
      setTimeout(() => {
          this.grafica.CargarGrafica(this.datosSegundaGrafica, this.confGrafica);
      }, 0);
    }
  }
  cargarTabla(item) {
    if(item[1]>0){
    //["SOLICITUD DEVUELTA", 7, 6.25, 9]
      if(item[0]==="SOLICITUD DEVUELTA"){
        this.solicitudDevuelta=true;
      }else{
        this.solicitudDevuelta=false;
      }
      console.log("ID INSTITUCION: ",this.idInstitucion);
      this.nombreEstatus=item[0];
      this.tipoStatus=item[3];
      this.showTable = true;
      this.isTableView = true;
      this.setPage(1);
    }
  }
  regresar() {
    this.currentView = true;
    console.log("funcion regresar: " + this.tipo);
    this.cargarPrimeraGrafica(this.tipo);
    this.strBusqueda = "";
    this.lista = [];
  }

  regresarTabla(){
    this.showTable=false;
    this.currentView=false;
    this.datosCaptacionDia = null;
    super.resetPaginator();
    this.cargarSegundaGrafica(null);
  }
  private getAll(valor): void{
    super.loading(true);
    let params:object;
    if (valor===1) {
      params={
        "idInstitucion": this.idInstitucion,
        "idPais": 1,
        "idStatus":null,
        "pagina": null,
        "cuentasBig":null
      };
    }
    if (valor===2) {
      params={
        "idInstitucion": this.idInstitucion,
        "idPais": 1,
        "idStatus":this.tipoStatus,
        "pagina": null,
        "cuentasBig":null
      };
    }
    let path = '/AsesorBig/api/pdf/consulta';
    
      console.log(params);
      this.service.post(params, path, 1).subscribe(
      data => {
          let object = JSON.parse(JSON.stringify(data));
          console.log(object);
          if (object.codE === 0) {
            this.corregirCuenta(object.jsonResultado.consulta);
            //
          }else{
            this.notifications.info("Descarga de excel", object.msgE);
        }
      },
      error => {
          super.loading(false);
          this.notifications.error('Error de servicio');
      },
      () => super.loading(false)
    );
    
  }
  corregirCuenta(array){
    let numCuenta;
    array.forEach(element => {
      element.numCuenta="'"+element.numCuenta;
    });
    this.jsonToCsv.generateToExcel(array,'reportes');
  }

  miles(palabra){
    this.formatMiles.forEach(element => {
      let separado: any[]=[];

      var number1 = element[palabra]+'', result = '';

      separado=number1.split(".");

      if (separado[0].indexOf(',') === -1) {

          while (separado[0].length > 3) {
            result = ',' + '' + separado[0].substr(separado[0].length - 3) + '' + result;
            separado[0] = separado[0].substring(0, separado[0].length - 3);
          }
 
          result = separado[0] + result;
          separado[0]=result;
          result = '';
      }

      if(separado.length>1){
          result= separado[0]+"."+separado[1];
      }else{
          result= separado[0];
      }
      element[palabra]=result;
     
    });
    //console.log( this.formatMiles);
  }
  private FiltrarInts(_str: string): void {
    /*this.lista = new FilterTable().transform(this.reportesInstitucionesEstatus, _str);
    console.log(this.lista);
    this.SortTableByString('name');*/
    if(_str.length > 2) {
      this.consultarInstituciones(_str);
    } else if( _str.length === 0) {
      this.construirTablaInst();
    }
    //this.tablaUsuarios.SetTabla(new ConfigNgTable2(this.Usuarios.length, 10));
  }
  private SortTableByString(_item: any): void {
    this.lista.sort(function(a: any, b: any) {
        return (a[_item] > b[_item]) ? 1 : ((b[_item] > a[_item]) ? -1 : 0);
    });
  }


  private consultarInstituciones(str: string): void {
     
    super.loading(true);

    let serviceURL: string = '/api/portal/busqueda/instituciones';
    let requestOBJ: object = { "cadena": str };

    this.service.post(requestOBJ, serviceURL, 3).subscribe(
      success => {
        let responseObj = JSON.parse(JSON.stringify(success));
        console.log("RESPONSE ['CONSULTA INSTITUCIONES']: ",responseObj);
        if (responseObj.codE === 0) {
          if(responseObj.jsonResultado.length > 0) {
            let resultadoBusqueda: Object[] = [];
            for(let item of responseObj.jsonResultado) {
              let institucionData = this.reportesInstitucionesEstatus.filter(function(inst) {
                return inst.idInstitucion === item.idInstitucion && inst.idPais === item.idPais;
              });
              let newObj: any = {
                "name": item.institucion,
                "total": item.cantidad,
                "idPais": item.idPais,
                "idInstitucion": item.idInstitucion,
                "data": (institucionData.length > 0) ? institucionData[0].data : [],
                "color": (institucionData.length > 0) ? institucionData[0].color : null,
              };
              resultadoBusqueda.push(newObj);
            }
            this.lista = resultadoBusqueda;
            console.log(this.lista);
          } else {
            this.lista = [];
          }
        } else {
          console.log("Error al obtener los datos");
        }
      }, 
      error => {
        console.error("Error del servidor");
      },
      () => super.loading(false)
    );
  }

  private construirTablaInst(): void {

    this.lista = new FilterTable().transform(this.reportesInstitucionesEstatus, '');

    if(this.lista.length > 0) {
      this.showTableInst = true;
      this.SortTableByString('name');
    } else {
      this.showTableInst = false;
    }
    
  }

}