import { Injectable } from '@angular/core';


import { Producto } from './dash';
import { Path } from '../interfaces/path';
import { ClassGenerica} from '../classGeneric/config';


import { Headers, Http, Response, RequestOptions} from '@angular/http';

// Add the RxJS Observable operators.
//import './rxjs-operators';
import { Observable }     from 'rxjs/Observable';

// Statics
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// clase de servicio que puede ser compartido por muchos componentes.

//servicio que devuelve promesa a el Componente
@Injectable()
export class DashService extends ClassGenerica implements Path{
  path;

  constructor(private http: Http) {
    super();
  }



  // getFunctionAll (): Observable<Producto[]> {

    

  //   this.path = PathService.Asesor+'service-productos-query/';

  //   return this.http.get(this.path,super.headersfunct())
  //                   //.map((res:Response) => res.json())
  //                   .map(this.extractData)
  //                   .catch(this.handleError);
  // }

  private extractData(res: Response) {
    let body = res.json();
      console.log(body);
      return body || { };
  }


  private handleError (error: Response | any) {
  // In a real world app, we might use a remote logging infrastructure
  let errMsg: string;
  if (error instanceof Response) {
    const body = error.json() || '';
    const err = body.error || JSON.stringify(body);
    errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  } else {
    errMsg = error.message ? error.message : error.toString();
  }
  return Observable.throw(errMsg);
}


}


