import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DashboardModule } from './dashboard/dash.module';

import { SimpleNotificationsModule } from 'angular2-notifications';
import { Notifications } from './classGeneric/notifications';

import { JsonToCsv } from './classGeneric/jsontocsv';
import { PaginationFron } from './classGeneric/paginationFront';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { FechasPipe, MonedaMX, FilterTable } from './pipes/pipes-portal';

// Service genral
import { Service } from './service/service';

// interceptor
import { AuthInterceptor } from './classGeneric/AuthInterceptor';

// import menu
import { MenuModule } from './menu/menu.module';

// Import css
import '../styles/css/estilos.css';

import { environment } from '../environments/environment';

// Importamos el modulo que no es lizy
import { PortalModule } from './portal/portal.module';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    MenuModule,
    DashboardModule,
    PortalModule,
    SimpleNotificationsModule.forRoot(),
    HttpClientModule, // cargamos el módulo en el array de imports
  ],
  declarations: [
    AppComponent,
    FechasPipe,
    MonedaMX,
    FilterTable
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    Notifications,
    JsonToCsv,
    PaginationFron,
    environment.ENV_PROVIDERS,
    Service
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
