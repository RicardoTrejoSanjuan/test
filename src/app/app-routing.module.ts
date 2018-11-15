import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dash.component';

import { AuthGuard } from './classGeneric/config';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule',
    pathMatch: 'full',
  },

  {
    path: 'depositos-referenciado',
    loadChildren: 'src/app/portal/depositos/depositos.module#DepositosReferenciadoModule',
  },
  {
    path: 'centralizacion-cuentas',
    loadChildren: 'src/app/portal/centralizacion-cuentas/centralizacion-cuentas.module#CentralizacionCuentasModule',
  },
  {
    path: 'seguridad',
    loadChildren: 'src/app/portal/seguridad/seguridad.module#SeguridadModule',
  },
  {
    path: 'infinite/datos',
    loadChildren: 'src/app/portal/infinite/infinite-datos.module#InfiniteDatosModule',
  },
  // {
  //   path: 'script-general',
  //   loadChildren: './portal/scriptsql/scriptsql.module#ScriptsqlModule',
  //   canActivate: [AuthGuard]
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
