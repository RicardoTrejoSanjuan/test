import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
/* Importaciones de los componentes que integraran a los mantenimientos de instituciones */
import { MantenimientoInstitucionesBusqueda } from './busqueda/busqueda.component';
import { MantenimientoInstitucionesCredito } from './credito/credito.component';
import { MantenimientoInstitucionesProducto } from './producto/producto.component';
import { MantenimientoInstitucionesRiesgo } from './riesgo/riesgo.component';
import { MantenimientoInstitucionesSeguro } from './seguro/seguro.component';
import { AuthGuard } from '../../../classGeneric/config';


const RoutesModule: Routes = [
  {
    path: "mantenimientos/instituciones",
    component: MantenimientoInstitucionesBusqueda,
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "mantenimientos/instituciones/configuracion-producto",
    component: MantenimientoInstitucionesProducto,
    pathMatch: "full"
  },
  {
    path: "mantenimientos/instituciones/configuracion-credito",
    component: MantenimientoInstitucionesCredito,
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "mantenimientos/instituciones/configuracion-riesgos",
    component: MantenimientoInstitucionesRiesgo,
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: "mantenimientos/instituciones/configuracion-seguro",
    component: MantenimientoInstitucionesSeguro,
    canActivate: [AuthGuard],
    pathMatch: "full"
  }
];



@NgModule({
    imports: [
        RouterModule.forChild(RoutesModule),
    ],
    exports: [
        RouterModule

    ]
})

export class MantenimientoIinstitucionesRutas { }
