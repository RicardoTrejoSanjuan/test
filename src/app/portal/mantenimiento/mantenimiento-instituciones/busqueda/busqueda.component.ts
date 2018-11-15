import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { Service } from '../../../../service/service';
import { ClassGenerica } from '../../../../classGeneric/config';
import { Notifications } from '../../../../classGeneric/notifications';

import { Ng2Tables } from '../../../../ng2-tables/ng2-tables.component';
import { PagesHandler, ConfigNgTable2 } from '../../../../ng2-tables/ng2-tables';
import { FilterTable } from '../../../../pipes/pipes-portal';
@Component({
    selector: 'mantenimiento-instituciones-busqueda',
    templateUrl: 'busqueda.component.html',
    styleUrls: [
        '../instituciones.component.css',
        '../../../mesa-control/mesa-control.component.css'
    ]
})
export class MantenimientoInstitucionesBusqueda extends ClassGenerica implements AfterViewInit {

    private isEmptyResponse: Boolean;
    public isEmptyInputSearch: Boolean;
    private objResponse: any = [];
    /*private copyObjResponse: any = [];*/
    private pagesHandler: any = new PagesHandler();
    private config: any = new ConfigNgTable2(0, 10);
    public filter: string = '';
    private menuLateral: Array<Object>;
    @ViewChild('tablaBusqueda') tabla: Ng2Tables;

    constructor(private router: Router, private service: Service, private notifications: Notifications) {
        super();
        this.menuLateral = this.getMenuLateral();
        this.menuNavigation = this.menuNavigation();
    }

    ngAfterViewInit() {
        this.isEmptyResponse = false;
        this.isEmptyInputSearch = true;
    }

    // Se obtienen los registros de la BD que coincidan con lo escrito
    busquedaInstituciones(_str: String) {

        if (_str !== null && _str.length > 2) {
            super.loading(true);
            this.isEmptyInputSearch = false;

            let objRequest: any = { cadenaBusqueda: _str };
            let urlRequest: any = "/mantenimiento/institucion/busqueda";

            this.service.post(objRequest, urlRequest, 3).subscribe(
                data => {

                    let object = JSON.parse(JSON.stringify(data));

                    if (object.codE === 0) {

                        this.objResponse = object.jsonResultado;
                        /*this.copyObjResponse = JSON.parse(JSON.stringify(this.objResponse));*/

                        if (this.objResponse !== null && this.objResponse.length > 0) {
                            /*console.log(this.objResponse);*/
                            this.config.total = this.objResponse.length;
                            this.tabla.SetTabla(this.config);
                            this.isEmptyResponse = false;
                            /*this.notifications.success("Exito !!!",object.msgE);*/
                        } else {
                            this.isEmptyResponse = true;
                            /*this.notifications.info("Aviso !!!","La respuesta fue correcta, pero vacia !!!");*/
                        }

                    } else {
                        this.notifications.info("Aviso !!!", object.msgE);
                        this.isEmptyResponse = true;
                    }
                },
                error => {
                    this.notifications.error("Error !!!", error);
                },
                () => super.loading(false)
            );
        }
    }

    //funcion que actualiza las paginas visibles de la tabla
    private Update(_pagesHandler: PagesHandler): void {
        this.pagesHandler = _pagesHandler;
    }
    //Funcion para buscar en los registros de la tabla
    /* private filtrarInstituciones(_str: string): void {
         let filterPipe = new FilterPipe();
         this.objResponse = filterPipe.transform(this.copyObjResponse, _str);
         this.config.total = this.objResponse.length;
         this.tabla.SetTabla(this.config);
     }*/
    //Funcion para limpiar la caja de filtro
    public limpiarBusqueda() {
        this.filter = "";
        this.config.total = 0;
        this.tabla.SetTabla(this.config);
        this.objResponse = [];
        this.isEmptyInputSearch = true;
    }
    //Regresar el menu de mantenimientos
    public regresar(): void {
        this.router.navigate(['mantenimientos']);
    }
    //Una vez seleccionada una institucion se navega hasta los submodulos consecuentes
    private irConfigProductos(inst: any) {
        if (inst !== null) {
            super.saveData(inst, 'institucionMantenimiento');
            this.router.navigate(['mantenimientos/instituciones/configuracion-producto']);
        }
    }

}
