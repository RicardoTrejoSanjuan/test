// Importaciones generales
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule}   from '@angular/forms';

//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';

//Modulos hijos de la aplicacion
//import { GruposModule }     from '../seguridad/grupos/grupos.module';


//import { RolesModule }     from '../seguridad/roles/roles.module';

//import { UsuariosModule } from './usuarios/usuarios.module';
//import { PermisosModule } from './permisos-roles/permisos.module';
//import { ArbolModule }     from '../seguridad/arbol/arbol.module';
//import { MenuModule }     from '../seguridad/menu/menu.module';
import { GruposComponent } from './grupos/grupos.component';
import 'hammerjs';
import { HeaderModule} from '../../header/header.module';

// import { AuthGuard} from '../../classGeneric/config';

import { AnimateModule } from '../../animate/animate.module';

// Importaciones routing app
import { SeguridadRoutingModule }     from './seguridad-routing.module';

// Component
import { SeguridadComponent } from './seguridad.component';
import {DirectivesModule} from '../../directives/directive.module';
import { RolesComponent } from './roles/roles.component';
import { AuthGuard} from '../../classGeneric/config';
// Validator
import { ValidationModule } from '../../validator/validation.module';
import { ValidationService } from '../../validator/validation.service';
import { UsuariosComponent } from './usuarios/usuarios-crud.component';


import { Ng2TablesModule } from '../../ng2-tables/ng2-tables.module';
import { MenuComponent } from './menu/menu.component';
import { BookFilterPipe } from './menu/menu.pipes';
import { PermisosRolesComponent } from './permisos-roles/permisos-roles.component';
import { ArbolComponent } from './arbol/arbol.component';
import { TreeView } from "./arbol/tree-view.component";
import { Notifications } from '../../classGeneric/notifications';

@NgModule({
  imports: [
    HeaderModule,
    ValidationModule,
    //BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SeguridadRoutingModule,
    AnimateModule,
    CommonModule,
    //GruposModule,
    //ArbolModule,
    //MenuModule,
    //RolesModule,
    //UsuariosModule,
    //PermisosModule,
    DirectivesModule,
    Ng2TablesModule,
    
  ],
  declarations: [//Componentes
    SeguridadComponent,
    GruposComponent,
    RolesComponent,
    UsuariosComponent,
    MenuComponent,
    BookFilterPipe,
    PermisosRolesComponent,
    ArbolComponent,
    TreeView
  ],
  providers: [ValidationService,Notifications
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})



export class SeguridadModule { }
