import { NgModule } from '@angular/core';
import { Empleados } from './empleados.routes';



import { TrackerModule } from './tracker/tracker.module';


@NgModule({
    imports: [
        Empleados,
        TrackerModule
    ]
})
export class EmpleadosModules { }
