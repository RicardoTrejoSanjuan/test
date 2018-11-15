import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Notifications } from '../classGeneric/notifications';


import { Path } from '../interfaces/path';
import { Vencriptdecript } from '../interfaces/CryptoJS';
// import { PathService} from '../classGeneric/config';

import { PathServicedes } from "../classGeneric/environments/des/environment";
import { PathServiceprod } from "../classGeneric/environments/prod/environment";

import { CryptoJSi } from '../classGeneric/CryptoJS';

import { HttpClient } from '@angular/common/http';


// Statics
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';



// Add the RxJS Observable operators.
//import './rxjs-operators';
import { Observable } from 'rxjs/Observable';

// clase de servicio que puede ser compartido por muchos componentes.

//servicio que devuelve promesa a el Componente
@Injectable()
export class Service extends CryptoJSi implements Path, Vencriptdecript {


  constructor(
    private http: Http,
    public httpClient: HttpClient,
    private router: Router,
    private notifications: Notifications
  ) {
    super();
  }

  path;

  encrypt;
  decrypt;

  errMsg: string;




  //   postLogin(parameter,ruta,idPath): Observable<Response> {

  //   this.encrypt = JSON.stringify(parameter);
  //   console.log(this.encrypt);
  //   this.encrypt = this.encryptAES(this.encrypt);


  //   this.path = this.pathServiceUse(idPath)+ruta;
  //   let headers = super.headersfunct();

  //   return this.http.post(this.path,this.encrypt,headers)
  //           .map((res:Response) => {
  //                 this.decrypt = this.decryptAES(res.text());
  //                 this.decrypt = JSON.parse(this.decrypt);
  //                 let dataUser = this.decrypt;
  //                 return this.decrypt || { };
  //           })
  //           .mergeMap((dataUser: any) => {

  //             if(dataUser.codE !== 0){
  //               console.log(dataUser);
  //               return Observable.throw(dataUser.msgE);

  //             }

  //             let objectSession: any = {};
  //             objectSession.token = dataUser.jsonResultado;
  //             objectSession.keyUser = parameter.user;




  //             // let encryptAESL = this.encryptAESLocal(arregloSession);
  //             // console.log(encryptAESL);

  //             // let decryptAESL = this.decryptAESLocal(encryptAESL);
  //             // console.log(decryptAESL);

  //             sessionStorage.setItem('session',JSON.stringify(objectSession));

  //             let headers = super.headersfunct().headers;
  //             let params = new URLSearchParams();
  //             params.set('ticket', dataUser.jsonResultado);

  //             let object: any = {};
  //             object.idUsuario = parameter.user;
  //             this.encrypt = JSON.stringify(object);
  //             this.encrypt = this.encryptAES(this.encrypt);


  //             return this.http.post(this.path,this.encrypt,{search: params,headers})
  //               .map((res: any) => {
  //                 this.decrypt = this.decryptAES(res.text());
  //                 this.decrypt = JSON.parse(this.decrypt);

  //                 console.log(this.decrypt);

  //                  if(this.decrypt.codE !== 0){
  //                    return Observable.throw(this.decrypt.msgE);
  //                  }

  //                 sessionStorage.setItem('permisos',JSON.stringify(this.decrypt.jsonResultado[0]));
  //                 return this.decrypt || { };
  //             });

  //           });
  // }


  post(parameter, ruta, idPath): Observable<Response> {
    //console.log("-> ",parameter);
    this.encrypt = JSON.stringify(parameter);
    //console.log(this.encrypt);
    this.encrypt = this.encryptAES(this.encrypt);
    this.path = this.pathServiceUse(idPath) + ruta;

    let myParams = new URLSearchParams();

    let params;
    if (super.addShowToken() !== null) {
      myParams.append('ticket', super.addShowToken());
      myParams.append('app', '2');
      params = myParams;
    } else {
      params = '';
    }
    let headers = super.headersfunct().headers;
    return this.http.post(this.path, this.encrypt, { search: params, headers })
      .map((res: Response) => {
        this.decrypt = this.decryptAES(res.text());
        //console.log('Decrypt: ',this.decrypt);
        this.decrypt = JSON.parse(this.decrypt);
        //console.log('JSON: ',this.decrypt);
        return this.decrypt || {};
      }
      )
      .catch((error) => {
        console.log(error);
        if (error.status === 0) {
          this.errMsg = "Conexión rechazada";
          super.delteAllSessionStorage();
          this.notifications.error(this.errMsg);
          this.router.navigate(['./login']);
          return Observable.throw(this.errMsg);
        } else if (error.status === 302) {
          this.errMsg = "Conexión rechazada";
          this.notifications.error(this.errMsg);
          super.delteAllSessionStorage();
          this.router.navigate(['./login']);
          return Observable.throw(this.errMsg);
        } else if (error.status === 415) {
          this.errMsg = "Unsupported Media Type";
          this.notifications.error(this.errMsg);
          return Observable.throw(this.errMsg);
        } else if (error.status === 417) {
          this.errMsg = "Error inesperado";
          this.notifications.error(this.errMsg);
          return Observable.throw(this.errMsg);
        } else if (error.status === 404) {
          this.errMsg = "Página no encontrada";
          this.notifications.error(this.errMsg);
          return Observable.throw(this.errMsg);
        } else if (error.status === 500) {
          this.errMsg = "Error interno de el servidor";
          this.notifications.error(this.errMsg);
          return Observable.throw(this.errMsg);
        }
      });
  }

  getBase64(parameter, ruta, idPath): Observable<Response> {
    //console.log(parameter);
    this.encrypt = JSON.stringify(parameter);
    this.encrypt = this.encryptAES(this.encrypt);
    this.path = this.pathServiceUse(idPath) + ruta;

    let myParams = new URLSearchParams();

    let params;
    if (super.addShowToken() !== null) {
      myParams.append('ticket', super.addShowToken());
      myParams.append('app', '2');
      params = myParams;
    } else {
      params = '';
    }
    let headers = super.headersfunct().headers;
    return this.http.post(this.path, this.encrypt, { search: params, headers })
      .map((res: Response) => {
        let base64: any = res.text();
        base64 = JSON.parse(base64);
        return base64 || {};
      }
      )
      .catch((error) => {
        if (error.status === 0) {
          this.errMsg = "Conexión rechazada";
          super.delteAllSessionStorage();
          this.notifications.error(this.errMsg);
          this.router.navigate(['./login']);
          return Observable.throw(this.errMsg);
        } else if (error.status === 302) {
          this.errMsg = "Conexión rechazada";
          this.notifications.error(this.errMsg);
          super.delteAllSessionStorage();
          this.router.navigate(['./login']);
          return Observable.throw(this.errMsg);
        } else if (error.status === 415) {
          this.errMsg = "Unsupported Media Type";
          this.notifications.error(this.errMsg);
          return Observable.throw(this.errMsg);
        } else if (error.status === 417) {
          this.errMsg = "Error inesperado";
          this.notifications.error(this.errMsg);
          return Observable.throw(this.errMsg);
        } else if (error.status === 404) {
          this.errMsg = "Página no encontrada";
          this.notifications.error(this.errMsg);
          return Observable.throw(this.errMsg);
        } else if (error.status === 500) {
          this.errMsg = "Error interno de el servidor";
          this.notifications.error(this.errMsg);
          return Observable.throw(this.errMsg);
        }
      });
  }


  get(ruta, idPath): Observable<Response> {

    this.path = this.pathServiceUse(idPath) + ruta;

    let params = new URLSearchParams();
    params.set('ticket', super.addShowToken());
    let headers = super.headersfunct().headers;

    return this.http.get(this.path, { search: params, headers })
      .map((res: Response) => {
        this.decrypt = this.decryptAES(res.text());
        this.decrypt = JSON.parse(this.decrypt);
        return this.decrypt || {};
      }
      )
      .catch((error) => {
        console.log(error);
        if (error.status === 0) {
          this.errMsg = "Conexión rechazada";
          super.delteAllSessionStorage();
          this.router.navigate(['./login']);
          return Observable.throw(this.errMsg);
        } else if (error.status === 302) {
          this.errMsg = "Conexión rechazada";
          super.delteAllSessionStorage();
          this.router.navigate(['./login']);
          return Observable.throw(this.errMsg);
        } else if (error.status === 415) {
          this.errMsg = "Unsupported Media Type";
          return Observable.throw(this.errMsg);
        } else if (error.status === 417) {
          this.errMsg = "Error inesperado";
          return Observable.throw(this.errMsg);
        }
        else if (error.status === 404) {
          this.errMsg = "Página no encontrada";
          return Observable.throw(this.errMsg);
        }
        else if (error.status === 500) {
          this.errMsg = "Error interno de el servidor";
          return Observable.throw(this.errMsg);
        }
      });
  }


  pathServiceUse(idPath): string {
    let PathService;
    if (process.env.NODE_ENV === 'production') {
      PathService = PathServiceprod;
    }else{
      PathService = PathServicedes;
    }
    for (let i in PathService.paths) {
      if (PathService.paths.hasOwnProperty(i)) {
        if (PathService.paths[i].idPath === idPath) {
          return PathService.paths[i].path;
        }
      }
    }
  }


  postHttpClient(parameter, ruta, idPath): Observable<any> {
    //console.log("-> ",parameter);
    this.encrypt = JSON.stringify(parameter);
    //console.log(this.encrypt);
    this.encrypt = this.encryptAES(this.encrypt);
    this.path = this.pathServiceUse(idPath) + ruta;

    return this.httpClient.post(this.path, this.encrypt, { observe: 'events', reportProgress: true, responseType: 'text'});
  }

  httpClientEncryptAES(text): Observable<any> {
    this.decrypt = this.decryptAES(text);
    this.decrypt = JSON.parse(this.decrypt);
    return JSON.parse(JSON.stringify(this.decrypt));
  }

  httpErrorResponse(err): Observable<any> {
    let msgAlert;
    let showAlert;
    if (err.error instanceof Error) {
      //A client-side or network error occurred.
      console.log('An error occurred:', err.error.message);
      msgAlert = err.error.message;
      showAlert = true;
      super.loading(false);
    } else {
      console.log(err);

      //Backend returns unsuccessful response codes such as 404, 500 etc.
      console.log('Backend returned status code: ', err.status);
      console.log('Response body:', err.error);

      msgAlert = 'Backend returned status code: ' + err.status + ' Response body: ' + err.message;
      showAlert = true;
      this.loading(false);
    }

    let r = {
      msgAlert,
      showAlert
    }

    return JSON.parse(JSON.stringify(r));


  }
  

}

