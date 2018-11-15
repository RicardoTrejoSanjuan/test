import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams } from "@angular/common/http";
import { HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

import { CryptoJSi } from './CryptoJS';

@Injectable()
export class AuthInterceptor extends CryptoJSi implements HttpInterceptor{

    private ticket: string;

    constructor() {
        super();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        console.log(sessionStorage.getItem('session'));
        if (sessionStorage.getItem('session')) {
            if (this.decryptAESLocal(sessionStorage.getItem('session')) !== '') {
                this.ticket = JSON.parse(this.decryptAESLocal(sessionStorage.getItem('session')));
            }
        } else {
            this.ticket = '';
        }  

        const authToken = JSON.parse(JSON.stringify(this.ticket));
        // Initialize Params Object
        let Params = new HttpParams();

        // Begin assigning parameters
        Params = Params.append('ticket', authToken.token);
        Params = Params.append('app', '2');

        const authReq = req.clone({
            headers: req.headers.set(
                'Content-Type', 'application/json; charset=UTF-8'
            ),
            params: Params

            // headers: req.headers.set('Authorization', `Token ${authToken}`)
        });
        return next.handle(authReq);
    }
}
