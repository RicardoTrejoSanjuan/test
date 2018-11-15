// Importaciones generales
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { SimpleNotificationsModule } from 'angular2-notifications';


import { MenuModule } from '../menu/menu.module';

import { HttpClientModule } from "@angular/common/http";


// Validator
import { ValidationModule } from '../validator/validation.module';
import { ValidationService } from '../validator/validation.service';


// Importaciones routing app
import { routes } from './login-routing.module';

// Component
import { LoginComponent } from './login.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
    MenuModule,
    ValidationModule,
    HttpClientModule,
    SimpleNotificationsModule.forRoot()
  ],
  declarations: [
    LoginComponent
  ],
  providers: [
    ValidationService,
  ]
})



export class LoginModule {
  static routes = routes;
}
