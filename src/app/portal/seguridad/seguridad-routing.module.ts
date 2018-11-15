// Importaciones generales
import { NgModule }      from '@angular/core';
import { RouterModule, Routes}   from '@angular/router';

import { AuthGuard} from '../../classGeneric/config';

// Component
import { SeguridadComponent } from './seguridad.component';
import { GruposComponent } from './grupos/grupos.component';
import { RolesComponent } from './roles/roles.component';
import { UsuariosComponent } from './usuarios/usuarios-crud.component';
import { MenuComponent } from './menu/menu.component';
import { PermisosRolesComponent } from './permisos-roles/permisos-roles.component';
import { ArbolComponent } from './arbol/arbol.component';

const RoutesModule: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: SeguridadComponent,
        canActivate: [AuthGuard],
      },
      { 
        path: 'grupos',
        component: GruposComponent,
        canActivate: [AuthGuard],
      },
      { 
        path: 'roles',
        component:  RolesComponent,
        canActivate: [AuthGuard],
      },
      { 
        path: 'usuarios',
        component:  UsuariosComponent,
        canActivate: [AuthGuard],
      },
      { 
        path: 'menu',
        component:  MenuComponent,
        canActivate: [AuthGuard],
      },
      { 
        path: 'permisos-roles',
        component:  PermisosRolesComponent,
        canActivate: [AuthGuard],
      },
      { 
        path: 'arbol-permisos',
        component:  ArbolComponent,
        canActivate: [AuthGuard],
      },
    ]
  },
]; 

@NgModule({
  imports: [
    RouterModule.forChild(RoutesModule)
  ],
  exports: [
    RouterModule
  ]
})



export class SeguridadRoutingModule { }