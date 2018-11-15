import { Component, AfterViewInit, ViewChild } from '@angular/core';
//Importacion clase generica
import { ClassGenerica } from '../../../../classGeneric/config';
//Importacion de servicio para el consumo de servicios
import { Service } from '../../../../service/service';
//Importacion de la clase de garfica
import { GraficaComponent } from '../../../../graficas-highchart/graficas-highchart.component';
//Importacion de interfaces
import { ConfGraficaPie } from '../../../../interfaces/interfacesGraficas';
import { ConfGraficaColumn } from '../../../../interfaces/interfacesGraficas';
import { ConfGraficaLine } from '../../../../interfaces/interfacesGraficas';
import { ConfGraficaPercent } from '../../../../interfaces/interfacesGraficas';
//Importacion de la paleta de colores
import { GRAFICAS } from '../../../../constants/graficas';
import { Pagination } from '../../../../classGeneric/pagination';
import { Observable } from 'rxjs/Observable';
import * as _ from 'underscore';

@Component({
  selector: 'reportes-graficas',
  templateUrl: 'reportes-analista.component.html',
  styleUrls: [
    'captacion.component.css',
    'credito.component.css',
    '../reportes.component.css'
  ],

})

export class MesaControlReportesAnalista extends ClassGenerica implements AfterViewInit{

 //Arreglo para el menu lateral
  menuLateral: Array<Object>;
  //Bandera la la visibilidad del boton regresar
  btnRegresar: Boolean;
  paletaColores: string[] = GRAFICAS.PALETA_COLORES;
  confGrafica: ConfGraficaPie;
  reportesEstatus: any;
  rCatalogos: any;
  total_solicitudes : any;
  stSolicitudes: any;
  reportesEstatus2: any;
  porcentajeAux: any;
  porcentaje: any;
  segunda:boolean;
  tercera:boolean;
  nombreInstitucion: string;
  estatus: string;
  idInst: any;

  @ViewChild(GraficaComponent) grafica: GraficaComponent;
  @ViewChild("segundaGrafica") segundaGrafica: GraficaComponent;
  @ViewChild("tercerGrafica") tercerGrafica: GraficaComponent;
  constructor(private service: Service) {
    super();
    this.segunda=false;
    this.menuLateral = this.getMenuLateral(1);
    this.menuNavigation = this.menuNavigation();
    this.btnRegresar = false;
    this.rCatalogos=[  {id: 0, title: 'Bandeja de Recepción', total: 0},
                  {id: 3, title: 'Devueltas con observación', total: 0},
                  {id: 4, title: 'Rechazadas', total: 0},
                  {id: 2, title: 'Liberadas', total: 0}];
  }

  ngAfterViewInit(){

    this.cargarPrimeraGrafica(null);
     this.cargarDatos(null);

  }
  calcularPaletaColores(listSize: any) {
    let colorSize: any = GRAFICAS.PALETA_COLORES.length;

    if(listSize > colorSize) {
      for(let i = 1;i <= listSize; i++) {
        this.paletaColores.push(GRAFICAS.PALETA_COLORES[i-1]);
      }
    }
  }
  cargarPrimeraGrafica(estatus) {
    //this.tipo = estatus;
    super.loading(true);
    let _data:any[]=[];
    let params= {rol: 101,
      empresa: null,
      estadoSolicitud: null,
      idAnalista: null,
      tipo: 'A'};

    let path: string = '/mesacontrol/reportes/grafica/consulta';
    //let params: object = { 'cuentasBig': estatus };
    this.service.post(params, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        super.loading(false);
        object.jsonResultado.tipo='A';
        _data=this.generarData(object.jsonResultado);
        this.reportesEstatus2=_data;
        //this.calcularPaletaColores(this.reportesInstitucionesEstatus.length);
        if (object.codE === 0) {
          this.confGrafica= {
            type: 'pie',
            nameCategory: 'Analistas',
            title: '',
            subtitle: '',
            tooltip: true,
            dataLabels: false,
            drilldown: true,
            showLegends: false
          };
          this.grafica.CargarGrafica(_data, this.confGrafica);
        } else {
          console.log("Error al obtener los datos");
        }
      }, error => {
        console.log("error del servidor");
      }
    );
  }
  regresar(){
    if (this.segunda) {
      this.segunda=false;
      this.cargarPrimeraGrafica(null);
    }
    if(this.tercera){
      this.tercera=false;
      this.segunda=true;
      this.cargarSegundaGrafica(this.idInst);
    }
  }
  cambiarSegundaGrafica(_params){
    this.segunda=true;
    this.nombreInstitucion=_params.name;
    this.idInst=_params.id;
    this.cargarSegundaGrafica(_params.id);
  }
  cambiarTerceraGrafica(_params){
    this.segunda=false;
    this.tercera=true;
    this.estatus=_params.name;
    this.cargarTerceraGrafica(_params);
  }
  cargarSegundaGrafica(estatus) {
    //this.tipo = estatus;
    super.loading(true);
    let _data:any[]=[];
    let params= {rol: 101,
      empresa: null,
      estadoSolicitud: null,
      idAnalista: estatus,
      tipo: 'AS'};

    let path: string = '/mesacontrol/reportes/grafica/consulta';
    //let params: object = { 'cuentasBig': estatus };
    this.service.post(params, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        super.loading(false);
        object.jsonResultado.tipo='AS';
        _data=this.generarData(object.jsonResultado);
        this.reportesEstatus2=_data;
        //this.calcularPaletaColores(this.reportesInstitucionesEstatus.length);
        if (object.codE === 0) {
          this.confGrafica= {
            type: 'pie',
            nameCategory: 'Empresa',
            title: '',
            subtitle: '',
            tooltip: true,
            dataLabels: false,
            drilldown: true,
            showLegends: false
          };
          this.segundaGrafica.CargarGrafica(_data, this.confGrafica);
        } else {
          console.log("Error al obtener los datos");
        }
      }, error => {
        console.log("error del servidor");
      }
    );
  }
  cargarDatos(estatus) {
    //this.tipo = estatus;
    super.loading(true);
    let params= {rol: 101,
      empresa: null,
      estadoSolicitud: null,
      idAnalista: null,
      tipo: 'S'};

    let path: string = '/mesacontrol/reportes/grafica/consulta';
    //let params: object = { 'cuentasBig': estatus };
    this.service.post(params, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        super.loading(false);
        if (object.codE === 0) {
          this.inicializarCounters(object.jsonResultado);
        } else {
          console.log("Error al obtener los datos");
        }
      }, error => {
        console.log("error del servidor");
      }
    );
  }
  inicializarCounters(obj) {
      var arr = this.rCatalogos;
      var total = 0;
      this.porcentajeAux=[0,0,0,0];
      let data:any[]=[];
      for (var i = 0; i < obj.length; i++) {
        total += obj[i].total;
        for (var j = 0; j < arr.length; j++) {
          if (arr[j].id === obj[i].estadoSolicitud){
            arr[j].total = obj[i].total;
          }

        }
      }
      for (var i = 0; i < arr.length; i++) {
          var porc = Number(((arr[i].total * 100) / total).toFixed(2));
          data.push({y: porc});
        }

          let IntervalDispersionesPrimero=setInterval(() => {
            if (this.porcentajeAux[0] < data[0].y) {
                this.porcentajeAux[0]++;
            } else {
                clearInterval(IntervalDispersionesPrimero);
            }
        }, 1);

          let segundo=setInterval(() => {
            if (this.porcentajeAux[1] < data[1].y) {
                this.porcentajeAux[1]++;
            } else {
                clearInterval(segundo);
            }
        }, 1);

          let tercero=setInterval(() => {
            if (this.porcentajeAux[2] < data[2].y) {
                this.porcentajeAux[2]++;
            } else {
                clearInterval(tercero);
            }
        }, 1);

          let cuarto=setInterval(() => {
            if (this.porcentajeAux[3] < data[3].y) {
                this.porcentajeAux[3]++;
            } else {
                clearInterval(cuarto);
            }
        }, 1);

      this.total_solicitudes = total;
      this.stSolicitudes = arr;
    }
    statusTexto = function (_st) {
                    if (_st === 0){
                        return "Bandeja de Recepción";
                    }
                    if (_st === 2){
                        return "Liberada";
                    }
                    if (_st === 3){
                        return "Devuelta con observación";
                    }
                    if (_st === 4){
                        return "Rechazada";
                    }
                };
    generarData(objIn){
      let data:any[]=[];
      var obj = objIn, total = 0;
      for (var index = 0; index < obj.length; index++) {
        total += obj[index].total;
      }
      if (objIn.tipo === 'E' || objIn.tipo === 'SAE' || objIn.tipo === 'ASE' || objIn.tipo === 'SE' || objIn.tipo === 'AE') {
        for (var i = 0; i < obj.length; i++) {
          var porc = Number(((obj[i].total * 100) / total).toFixed(2));
          data.push({name: obj[i].empresa, y: porc, total: obj[i].total, id: obj[i].idEmpresa, tipo: objIn.tipo});
        }
      }
      if (objIn.tipo === 'ES' || objIn.tipo === 'S' || objIn.tipo === 'AS' || objIn.tipo === 'EAS' || objIn.tipo === 'AES') {
          for (var i = 0; i < obj.length; i++) {
              var porc = Number(((obj[i].total * 100) / total).toFixed(2));
              data.push({name: this.statusTexto(obj[i].estadoSolicitud), y: porc, total: obj[i].total, id: obj[i].estadoSolicitud, tipo: objIn.tipo, empresa: obj[i].idEmpresa, idAnalista: obj[i].idAnalista});
          }
      }
      if (objIn.tipo === 'ESA' || objIn.tipo === 'SA' || objIn.tipo === 'A' || objIn.tipo === 'EA' || objIn.tipo === 'SEA') {
          for (var i = 0; i < obj.length; i++) {
              var porc = Number(((obj[i].total * 100) / total).toFixed(2));
              if (obj[i].analistaNombre !== null && obj[i].analistaApellidoPaterno !== null && obj[i].analistaApellidoMaterno !== null) {
                  data.push({name: obj[i].analistaNombre + ' ' + obj[i].analistaApellidoPaterno + ' ' + obj[i].analistaApellidoMaterno, y: porc, total: obj[i].total, id: obj[i].idAnalista, tipo: objIn.tipo});
              } else {
                  data.push({name: 'Sin asignar', y: porc, total: obj[i].total, id: obj[i].idAnalista, tipo: objIn.tipo});
              }
          }
      }
        return data;
    }
    cargarTerceraGrafica(estatus){
      super.loading(true);
      let _data:any[]=[];
      let params= {rol: 101,
        empresa: null,
        estadoSolicitud: estatus.id,
        idAnalista: estatus.idAnalista,
        tipo: 'ASE'};

      let path: string = '/mesacontrol/reportes/grafica/consulta';
      //let params: object = { 'cuentasBig': estatus };
      this.service.post(params, path, 3).subscribe(
        data => {
          let object = JSON.parse(JSON.stringify(data));
          super.loading(false);
          object.jsonResultado.tipo='ASE';
          _data=this.generarData(object.jsonResultado);
          this.reportesEstatus2=_data;
          //this.calcularPaletaColores(this.reportesInstitucionesEstatus.length);
          if (object.codE === 0) {
            this.confGrafica= {
              type: 'pie',
              nameCategory: 'Empresa',
              title: '',
              subtitle: '',
              tooltip: true,
              dataLabels: false,
              drilldown: false,
              showLegends: false
            };
            this.tercerGrafica.CargarGrafica(_data, this.confGrafica);
          } else {
            console.log("Error al obtener los datos");
          }
        }, error => {
          console.log("error del servidor");
        }
      );
    }
}
