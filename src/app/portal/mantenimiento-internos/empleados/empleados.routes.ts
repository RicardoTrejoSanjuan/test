import { RouterModule, Routes } from '@angular/router';
import { TrackerComponent } from './tracker/tracker.component';

import { AuthGuard} from '../../../classGeneric/config';

const RUTAS: Routes = [
  {
    path: "mantenimientos-internos/empleados",
    component: TrackerComponent,
    canActivate: [AuthGuard],
    pathMatch: "full"
  }
];

export const Empleados = RouterModule.forRoot(RUTAS);
