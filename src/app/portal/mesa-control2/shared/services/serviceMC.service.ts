import { ClassGenerica } from './../../../../classGeneric/config';
import { Service } from '../../../../service/service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class ServiceMCService extends ClassGenerica {

    constructor(private service: Service){
        super();
    }

    public callPost(parameter, ruta, path): any {
        return new Promise((resolve) => {
            this.service.post(parameter, ruta, path).subscribe((data: any) => {
                let response = JSON.parse(JSON.stringify(data));
                if (response.codE === 0) {
                    return resolve(response);
                } else {
                    /*Notifications*/
                    return resolve(response);
                }
            })
        })
    }

    public callPostObs(parameter, ruta, path): Observable<Object> {
        return Observable.create(observer => {
            this.service.post(parameter, ruta, path).subscribe(
                data => {
                    let response = JSON.parse(JSON.stringify(data));
                    if (response.codE === 0) {
                        observer.next(response.jsonResultado);
                        observer.complete();
                    } else {/*Notifications*/}
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