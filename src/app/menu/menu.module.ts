// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';


import { MenuComponent } from '../menu/menu.component';

import { LogoutRoutingModule } from './logoutmenu-routing.module';
import { MenuLogoutComponent } from './logoutmenu.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    LogoutRoutingModule,
  ],
  declarations: [
    MenuComponent,
    MenuLogoutComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [MenuComponent]
})



export class MenuModule { }
