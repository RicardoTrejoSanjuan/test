import { Component, AfterViewInit, Input } from '@angular/core';
import { HistorialService } from './historial.service';
import { HistorialNombreEmpleado } from '../../models/historialNombreEmpl';

@Component({
    selector: 'historial',
    templateUrl: 'historial.component.html',
    providers: [ HistorialService ],
    styleUrls: []
})
export class Historial implements AfterViewInit {

    @Input() visible: boolean;
    @Input() dataUser: any = {};


    private historialNombres: HistorialNombreEmpleado[];

    constructor(private hstService: HistorialService) {
    }

    ngAfterViewInit(){

     this.loadHistorial(this.dataUser["idClienteBig"]);    
    }

    loadHistorial(idClienteBig) {
        this.hstService.callHistorial(parseInt(idClienteBig)).subscribe(
            (data: any) => {
                let response = JSON.parse(JSON.stringify(data));
                this.historialNombres = response;
            },
            error => { console.log(error); },
            () => { console.log('ok'); }
        );

    }

}
