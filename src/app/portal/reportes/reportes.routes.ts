import { RouterModule, Routes } from '@angular/router';
import { ReportesMenu } from './menu/menu.component';

import { AuthGuard} from '../../classGeneric/config';

const RUTAS_REPORTES: Routes = [
  {
    path: "reportes",
    component: ReportesMenu,
    canActivate: [AuthGuard],
    pathMatch: "full",
    
  }
];

export const REPORTES_ROUTES = RouterModule.forRoot(RUTAS_REPORTES);
