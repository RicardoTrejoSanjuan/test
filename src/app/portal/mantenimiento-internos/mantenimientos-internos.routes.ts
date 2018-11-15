import { RouterModule, Routes } from '@angular/router';
import { AuthGuard} from '../../classGeneric/config';


import { MantenimientosInternosMenu } from './menu/menu.component';
const MantenimientoInterno: Routes = [
  {
    path: "mantenimientos-internos",
    component: MantenimientosInternosMenu,
    canActivate: [AuthGuard],
    pathMatch: "full"
  }
];
export const MantenimientoInternoRoutingModule = RouterModule.forRoot(MantenimientoInterno);
