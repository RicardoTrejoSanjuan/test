import { Component, OnInit } from '@angular/core';
import { Service } from '../../service/service';
import { Router } from '@angular/router';
import { ClassGenerica} from '../../classGeneric/config';

import * as moment from 'moment';

import { Notifications} from '../../classGeneric/notifications';
@Component({
    selector: 'infinite-movimientos',
    templateUrl: 'templates/infinite-movimientos.component.html',
    styleUrls: ['templates/infinite.component.css']
})

export class InfiniteMovimientosComponent  extends ClassGenerica{
    arrCuentas: any[];
    path:string;
    dataService:Object;
    fechaInicial:Date;
    fechaFinal:Date;
    storageData: any;
    arrayServicios:Object;
    showTable: boolean;
    minDate: any;
    maxDate:any;
    maxDate2:any;
    constructor(private service : Service, private router:Router, private notifications: Notifications) {
        super();
        this.storageData=this.getObject();
        this.showTable=false;
        this.maxDate=(new Date());
        this.menuNavigation = this.menuNavigation();
        this.actualizarFechas(new Date());
    }   
    regresar(){
         this.router.navigate(['./infinite/datos']);
    }
    
    actualizarFechas(fechaInicio){
        let diasDisponibles = moment().diff(fechaInicio,'days');
        this.maxDate2=new Date(moment(fechaInicio).add(diasDisponibles > 30 ? 30 : diasDisponibles,'days').format('MM-DD-YYYY'));
        this.minDate=new Date(moment(fechaInicio).subtract(30, 'days').format('MM-DD-YYYY'));
    }

    fechaInicialCambia(){
        /*console.log("cambio la fecha inicial:"+this.fechaInicial);*/
        console.log(this.fechaInicial);
        this.fechaFinal=this.fechaInicial;
        this.actualizarFechas(this.fechaInicial);
    }

    buscar(fechaInicial, fechaFinal) {
        super.loading(true);
        this.showTable=false;
            this.dataService={
                 "tarjeta": this.storageData.finoplasticoasignado,
                 "fechaInicio":  moment(fechaFinal).format("DD-MM-YYYY"),
                 "fechaFin":  moment(fechaInicial).format("DD-MM-YYYY")
            };
            this.path='/AsesorBig/api/infinite/consulta/movimientos';
            this.service.post(this.dataService, this.path, 1).subscribe(
                data => {
                    let object = JSON.parse(JSON.stringify(data));
                    if (object.codE === 0) {
                        console.log("resultado movimientos");
                        console.log(object.jsonResultado.length);
                        if(object.jsonResultado.length>0){
                            this.arrayServicios=object.jsonResultado;
                            this.showTable=true;
                        }else{
                            this.notifications.info("No se encontraron movimientos asociados");
                        }
                    } else {
                        this.notifications.error("Ingrese el nombre, cuenta o número de tarjeta");
                    }
                },
                error => {
                    console.log("error callback");
                },
                () => super.loading(false)
            );

    }
}
