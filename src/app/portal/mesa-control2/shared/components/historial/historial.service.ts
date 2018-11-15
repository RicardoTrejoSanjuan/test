import { ClassGenerica } from './../../../../../classGeneric/config';
import { Service } from '../../../../../service/service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HistorialNombreEmpleado } from '../../models/historialNombreEmpl';
import { MESA_CONTROL } from '../../../shared/constants/constants-url';

@Injectable()
export class HistorialService extends ClassGenerica {
    constructor(private service: Service) {
        super();
    }

    public callHistorial(idEmpleado: number): Observable<HistorialNombreEmpleado[]> {
        return Observable.create(observer => {
            this.service.post({ idEmpleado: idEmpleado }, MESA_CONTROL.historialNombres, 3).subscribe(
                data => {
                    let response = JSON.parse(JSON.stringify(data));
                    if (response.codE === 0) {
                        observer.next( response.jsonResultado );
                        observer.complete();
                    } else {/*Notifications*/ }
                },
                error => {
                    observer.next(null);
                    observer.complete();
                },
                () => super.loading(false)
            );
        });
    }

}