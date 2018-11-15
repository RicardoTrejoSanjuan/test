import { Component } from '@angular/core';
import { Router, ChildActivationStart, ChildActivationEnd } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../validator/validation.service';

import { ClassGenerica } from '../classGeneric/config';
import { Service } from '../service/service';

import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Body } from '@angular/http/src/body';

@Component({
  selector: 'my-login',
  styleUrls: ['template/login.component.css'],
  templateUrl: 'template/login.component.html',
})

export class LoginComponent extends ClassGenerica {

  showAlert: boolean = false;
  MsgAlert: string;

  userForm: any;

  path: string;

  msgloading:any = '';





  constructor(
    private service: Service,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    super();

    this.userForm = this.formBuilder.group({
      'user': ['', [Validators.required, ValidationService.validarNumeros]],
      'token': ['', [Validators.required, Validators.maxLength(6)]]
    });

    // router.events.subscribe(e => {
    //   if (e instanceof ChildActivationStart) {
    //     console.log(e);
    //   } else if (e instanceof ChildActivationEnd) {
    //     console.log(e);
    //   }
    // });


  }

  login2() {
    if (this.userForm.dirty && this.userForm.valid) {// Si ya interactuo con el form y es valido
      this.path = '/api/big/login';
      this.service.post(this.userForm.value, this.path, 3).subscribe(

        data => {
          let object = JSON.parse(JSON.stringify(data));
          if (object.codE === 0) {

            let objectSession: any = {};
            objectSession.token = object.jsonResultado;
            objectSession.keyUser = this.userForm.value.user;

            sessionStorage.setItem('session', super.encryptAESLocal(objectSession));
            console.log("token");
            console.log(objectSession.token);
            this.router.navigate(['./dashboard']);

          } else {
            this.MsgAlert = object.msgE;
            this.showAlert = true;
            super.delteAllSessionStorage();
          }
        },
        error => {
          this.MsgAlert = error;
          this.showAlert = true;
          super.loading(false);
          super.delteAllSessionStorage();
        },
        () => super.loading(false)

      );

      super.loading(true);
    }
  }

  login(){
    if (this.userForm.dirty && this.userForm.valid) {// Si ya interactuo con el form y es valido
      super.loading(true)
      this.path = '/api/big/login';
      
      this.service.postHttpClient(this.userForm.value, this.path, 3).subscribe(
        result => {
          super.httpEventType(result, body => {
            let response = this.service.httpClientEncryptAES(body);
            let object = JSON.parse(JSON.stringify(response));
            super.loading(false)

            if (object.codE === 0) {
              let objectSession: any = {};
              objectSession.token = object.jsonResultado;
              objectSession.keyUser = this.userForm.value.user;

              sessionStorage.setItem('session', super.encryptAESLocal(objectSession));
              console.log("token");
              console.log(objectSession.token);
              this.router.navigate(['./dashboard']);

            } else {
              this.MsgAlert = object.msgE;
              this.showAlert = true;
              super.delteAllSessionStorage();
            }

          });
        },
        (err: HttpErrorResponse) => {
          super.loading(false)
          super.delteAllSessionStorage();
          let error = JSON.parse(JSON.stringify(this.service.httpErrorResponse(err)));
          this.MsgAlert = error.msgAlert;
          this.showAlert = error.showAlert;
        }
      );


    }
  }

}
