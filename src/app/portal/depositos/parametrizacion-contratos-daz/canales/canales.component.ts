import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

// import { Data } from '../instituciones';
import { ClassGenerica } from '../../../../classGeneric/config';

import { Notifications} from '../../../../classGeneric/notifications';

import { Service } from '../../../../service/service';
import * as _ from 'underscore';

import {FormControl} from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
    selector: 'depositos',
    templateUrl: 'canales.component.html',
    styleUrls: ['canales.css',]
})
export class CanalesComponent extends ClassGenerica {

    public menuLateral: Array<Object>;

    public fechaInicial:any;
    public fechaFinal:any;
    public canalesradio: number = 0;
    public formatos: any;
    public idcan: any;
    public idsuc:any;

    public deposito:any;

    public Canales: any;
    public Sucursales: any;
    formulario: any;


    public Desc: any;
    public Formatos: any;
    public idCanalPred: any;

    public Idcan:any;
    public Idformato: any;
    public Descan:any;
    public Desuc:any;
    public consultaGeneral: any;


    public editaIdCanal ;
    public editaIdSucursal ;


    public activarpredictivoCanal: boolean = false;
    public activarpredictivoSucursal: boolean = false;
    public editaCampos:boolean=false;

    public Horas1:  any;
    public Horas2:  any;
    public TableData : any;
    public idFecha1: any;
    public idFecha2: any;
    public content: any;
    showDialogAlert: Boolean = false;
    public canalesC: any;

    public displayModal:any;

    public can:any;


      // pridictiva configuracion
      form: FormGroup;
      
  horaInicial: FormControl;
  horaFinal: FormControl;
  institucionCtrl: FormControl;
  clasSucursalesinstitucionCtrl2: FormControl;

  bandIst: boolean;
  objFiltrosHandler: Object;
  institucion: any;

  // pridictiva configuracion


    
    SucursalesinstitucionCtrl2: Observable<any[]>;

    listaInstituciones: Observable<any[]>;


    constructor(private service: Service,private router: Router,private notifications: Notifications,private formBuilder: FormBuilder) {
        super();
        this.menuLateral = this.getMenuLateral(1);
        this.menuNavigation = this.menuNavigation();

        this.deposito = super.getAttr('depositos');

        console.log('Variable Global');
        console.log(this.deposito);

        this.consultaCanal();
        this.canalOpera();
        // this.limpiaCampos();
        this.cancelar();
            
    
 this.institucionCtrl = new FormControl();
 this.clasSucursalesinstitucionCtrl2 = new FormControl();
 this.horaInicial = new FormControl('', Validators.required);
 this.horaFinal = new FormControl('', Validators.required);

 this.form = new FormGroup({

    institucionCtrl: this.institucionCtrl,
    clasSucursalesinstitucionCtrl2: this.clasSucursalesinstitucionCtrl2,
    horaInicial: this.horaInicial,
   horaFinal: this.horaFinal
 });



 this.listaInstituciones = this.institucionCtrl.valueChanges
    .pipe(
       startWith(null),
       map(name => this.filtrarInstituciones(name))
    );


   this.SucursalesinstitucionCtrl2 = this.clasSucursalesinstitucionCtrl2.valueChanges
   .pipe(
        startWith(null),
        map(name => this.canalesfiltra(name))
    );

 this.bandIst = true;
 this.objFiltrosHandler = {
   agrupamientoRequest: "INSTITUCION",
   anyoneSearchResult: false,
   institucionSelected: false
 };
 this.institucion = 0;
 // pridictiva configuracion






       
        
    }

    public  editar(canal:any){

               this.editaCampos = true;
        
               if(this.editaCampos === true)    { 
          
            this.fechaFinal = canal.horaCierre;
            this.fechaInicial=canal.horaApertura;
            this.idcan=canal.idCanal;
            this.idsuc= canal.descFormato;


            this.editaIdCanal = canal.idCanal;
            this.editaIdSucursal = canal.idFormato;

            this.idCanalPred =   this.editaIdCanal;
            this.Idformato = this.editaIdSucursal;
               }

 }





 public limpiaCampos(){

    this.editaCampos = false;
  this.fechaFinal = '';
            this.fechaInicial='';
            this.idcan='';
            this.idsuc= '';
           


 }




 public cancelar():void{
     console.log('Todo limpio');
    this.editaCampos = false;
  }


  public eliminarcan(canal: any):void {
    
      this.showDialogAlert = true;
      this.idCanalPred = canal.idCanal;
      this.Idformato = canal.idFormato;


     

  }


 public eliminar (){

                        this.editaCampos = false;
                        super.loading(true);
                       
                        
                        let path = '/depositoazteca/canales/eliminacanalopera/';
                        let Request: any = {
                            "idInstitucion" : this.deposito.idInst,
                            "idPais" : this.deposito.idPais,
                            "idCta" : this.deposito.idCuenta,
                            "idContrato" : this.deposito.idContratoDaz,
                            "idCanal" : this.idCanalPred,
                            "idFormato" :  this.Idformato,
                            "status": 0
                           
                        };
                        console.log('Peticion Elimina');
                        console.log(Request);
                       
                        this.service.post(Request, path, 3).subscribe(
                            data => {
                                let object = JSON.parse(JSON.stringify(data));
                                if(object.codE === 0){
                                    this.showDialogAlert = false;
                                    console.log('Elimina Canal');
                                    console.log(object);
                                    this.canalOpera();
                                    
                                    console.log(this.consultaGeneral);
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
        
               

    private canalOpera(){
        
                super.loading(true);
    


                 let TableDatac: Array<any> = [
                    {
                      'idHour': '09:00',
                      'descHour': '09:00AM',
                      'myId': '1'
                      
                    }, {
                        'idHour': '10:00',
                        'descHour': '10:00AM',
                        'myId': '2'
                    }, {
                        'idHour': '11:00',
                        'descHour': '11:00AM',
                        'myId': '3'
                    }, {
                        'idHour': '12:00',
                        'descHour': '12:00AM',
                        'myId': '4'
                    }, {
                        'idHour': '01:00',
                        'descHour': '01:00PM',
                        'myId': '5'
                    }, {
                        'idHour': '02:00',
                        'descHour': '02:00PM',
                        'myId': '6'
                    }, {
                        'idHour': '03:00',
                        'descHour': '03:00PM',
                        'myId': '7'
                    }, {
                        'idHour': '04:00',
                        'descHour': '04:00PM',
                        'myId': '8'
                    }, {
                        'idHour': '05:00',
                        'descHour': '05:00PM',
                        'myId': '9'
                    }, {
                        'idHour': '06:00',
                        'descHour': '06:00PM',
                        'myId': '10'
                    }, {
                        'idHour': '07:00',
                        'descHour': '07:00PM',
                        'myId': '11'
                    }, {
                        'idHour': '08:00',
                        'descHour': '08:00PM',
                        'myId': '12'
                    }, {
                        'idHour': '09:00',
                        'descHour': '09:00PM',
                        'myId': '13'
                    
                    }];
                    

                    this.content =TableDatac ;
                    this.Horas1 = this.content;
                    this.Horas2 = this.content;

                            console.log('Catalogos Horas');
                    
                            console.log(TableDatac);
                
                let path = '/depositoazteca/canales/consultacanalopera/';
                let Request: any = {
                    "idInstitucion" : this.deposito.idInst,
                    "idPais" : this.deposito.idPais,
                    "idCta" : this.deposito.idCuenta,
                    "idContrato" : this.deposito.idContratoDaz
                   
                };
                console.log('Peticion Canal');
                console.log(Request);
                this.service.post(Request, path, 3).subscribe(
                    data => {
                        let object = JSON.parse(JSON.stringify(data));
                        if(object.codE === 0){
                            this.cancelar();
                            console.log('consultacanalopera');
                            console.log(object);
                            this.consultaGeneral = object.jsonResultado;
                            console.log(this.consultaGeneral);
                           
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


            setFormat(data:any){
                //this.fechaInicial = data.idHour;
               this.idFecha1 = data.myId;
               console.log('Fecha inicial + id');
                
                                    }
             setFormat2(data:any){
                console.log('Fecha final + id');
            //this.fechaFinal=data.idHour;
            this.idFecha2 = data.myId;
        }




    public guardarCanal():void{

     this.editaCampos = false;

        if(this.fechaInicial>this.fechaFinal || this.fechaInicial === this.fechaFinal){
            this.notifications.error('Horario de operaciones incorrecto, favor de verificar');
     return null;
    
           }
        
          
           super.loading(true);

         
           
           let Request: any = {
            "idInstitucion" : this.deposito.idInst,
            "idPais" : this.deposito.idPais,
            "idCta" : this.deposito.idCuenta,
            "idContrato" : this.deposito.idContratoDaz,
            "idCanal" : this.idCanalPred,
            "idFormato" : this.Idformato,
            "horaApertura" :this.fechaInicial,
            "horaCierre" : this.fechaFinal,
            "status": 1
        };
        console.log('Peticion Guaradar');
        console.log(Request);
        let path = '/depositoazteca/canales/mergecanalopera/';

        this.service.post(Request, path, 3).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                if(object.codE === 0){
                   this.form.controls['institucionCtrl'].setValue('');
                   this.form.controls['clasSucursalesinstitucionCtrl2'].setValue('');
                    console.log('Response Guardar');
                    console.log(object);
                    this.canalOpera();
                    this.limpiaCampos();


                this.Desc = object.jsonResultado;
                  

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
              this.canalesC = object.jsonResultado;
              console.log('canales');
              console.log(this.canalesC);
      
      
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
      



 





    private filtrarInstituciones(_str: string): any {
        
        if(this.activarpredictivoCanal && _str !== null && _str !== ''){
            
           return this.Canales.filter((_item: any) => {

                let strBusqueda: string = _str.toLowerCase();
                let campo: string = _item.descripcion.toLowerCase();

                let regexp: any = new RegExp(strBusqueda,"g");
                if (campo.match(regexp) !== null) {
                    return _item;
                }
            });

        }
            
    }




 

      getCuenta(data):void{
        console.log('Primer PREDICTIVO ');
        console.log(data);


       
            this.idCanalPred =  data; 
            this.Descan = 'PRUEBA DESC CAN';


            if ( this.idCanalPred !== 1) {
                this.idsuc = 'VIRTUAL';
                this.Idformato = data;
            }else{
               this.idsuc = "TODAS"; 
               this.Idformato = 1;
               this.Descan = "ELEKTRA";
            }

        super.loading(true);
       
        let path = '/depositoazteca/canales/consultacanales/';
        let parameter: any = {


            "idCanal":  this.idCanalPred, 
            "descCanal":this.Descan,
            "descSucursal": null



        };
        this.service.post(parameter, path, 3).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                if(object.codE === 0 && object.codE !== null){
                    this.Sucursales = object.jsonResultado.ListFormato;
                    console.log(object);
                    this.activarpredictivoSucursal = true;

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


      getValues2Pred(data){


        console.log('Segundo predictivo checar el id de la sucursal');
        this.Idformato = data.idSucursal;
        console.log(this.Idformato);

    }


      canalesfiltra(_str: string) {
                console.log(_str);

                if(this.activarpredictivoSucursal && _str !== null && _str !== ''){

                    return this.Sucursales.filter((_item: any) => {
                        
                         let strBusqueda: string = _str.toLowerCase();
                         let campo: string = _item.descSucursal.toLowerCase();
         
                         let regexp: any = new RegExp(strBusqueda,"g");
                         if (campo.match(regexp) !== null) {
                             return _item;
                         }
                     });


                        

                }
        
               
        
              }


      getCuenta2(data):void{
        console.log(data);
      }

    sendCanales(p):void{

    }


}
