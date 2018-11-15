import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Validator
import { ValidationModule } from '../../../validator/validation.module';
import { ValidationService } from '../../../validator/validation.service';
/* componentes de portal BIG */
import { HeaderModule } from '../../../header/header.module';
import { Ng2TablesModule } from '../../../ng2-tables/ng2-tables.module';
/* Archivo de rutas de mantenimiento de instituciones */
import { MantenimientoIinstitucionesRutas } from './instituciones.routes';
/* Directive para permitir solo numeros y letras */
import { DirectivesModule } from '../../../directives/directive.module';
/* Importaciones de los componentes que integraran a los mantenimientos de instituciones */
import { MantenimientoInstitucionesBusqueda } from './busqueda/busqueda.component';
import { MantenimientoInstitucionesCredito } from './credito/credito.component';
import { MantenimientoInstitucionesProducto } from './producto/producto.component';
import { MantenimientoInstitucionesRiesgo } from './riesgo/riesgo.component';
import { MantenimientoInstitucionesSeguro } from './seguro/seguro.component';
import { AnimateModule } from '../../../animate/animate.module';

import { AuthGuard} from '../../../classGeneric/config';
import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
    imports: [
        MantenimientoIinstitucionesRutas,
        Ng2TablesModule,
        HeaderModule,
        BrowserModule,
        FormsModule,
        AnimateModule,
        DirectivesModule,
        FormsModule,
        ReactiveFormsModule,
        ValidationModule,
        SimpleNotificationsModule.forRoot()
    ],
    declarations: [
        MantenimientoInstitucionesBusqueda,
        MantenimientoInstitucionesCredito,
        MantenimientoInstitucionesProducto,
        MantenimientoInstitucionesRiesgo,
        MantenimientoInstitucionesSeguro
    ],
    providers: [ValidationService,AuthGuard],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InstitucionesModule { }
