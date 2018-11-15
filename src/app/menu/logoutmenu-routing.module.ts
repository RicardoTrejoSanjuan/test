// Importaciones generales
import { NgModule }      from '@angular/core';
import { RouterModule, Routes}   from '@angular/router';



// Component
import { MenuLogoutComponent } from './logoutmenu.component';






const RoutesModule: Routes = [
      {
        path: 'logout',
        component: MenuLogoutComponent,//Clase del comonente
      }
];


@NgModule({
  imports: [
    RouterModule.forChild(RoutesModule)
  ],
  exports: [
    RouterModule
  ]
})



export class LogoutRoutingModule { }