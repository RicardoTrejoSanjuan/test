import { Component, ViewChild } from '@angular/core';
import { ClassGenerica } from '../../../../classGeneric/config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Service } from '../../../../service/service';
import { Notifications } from '../../../../classGeneric/notifications';
import { PaginationFron } from '../../../../classGeneric/paginationFront';

@Component({
    selector: 'mantenimiento-instituciones-producto',
    templateUrl: 'producto.component.html',
    styleUrls: [
        '../instituciones.component.css', 
        '../../../mesa-control/mesa-control.component.css']
})

export class MantenimientoInstitucionesProducto extends ClassGenerica {

    public menuLateral: Array<Object>;

    public institucion: any;
    public productoEliminar: any;
    public formularioProducto: any;

    public esCreacionProducto: boolean;
    public formularioProductoActivo: boolean;
    public formularioEliminarActivo: boolean;

    public productosInstitucion: any[];
    public catalogoProducto: any[];
    public catalogoTipoNomina: any[];
    public catalogoPeriodicidad: any[];

    public paginadorProductos: any = {};
    public paginaProductos: any[] = [];

    constructor(private service: Service,private notifications: Notifications,private pagination: PaginationFron) {
        super();
        this.menuLateral = this.getMenuLateral(1);
        this.menuNavigation = this.menuNavigation();

        this.productoEliminar = { producto: "" };
        this.institucion = super.getAttr('institucionMantenimiento');

        this.formularioProductoActivo = false;
        this.formularioEliminarActivo = false;

        this.productosInstitucion = [];
        this.catalogoProducto = [];
        this.catalogoTipoNomina = [];
        this.catalogoPeriodicidad = [];

        this.inicializarFormulario();
        this.consultarProductosInstitucion();
        this.consultarCatalogosProductos();
    }

    private inicializarFormulario(): void {
        this.formularioProducto = new FormGroup({
            tipoNomina: new FormControl("", [Validators.required]),
            producto: new FormControl("", [Validators.required]),
            periodicidad: new FormControl("", [Validators.required])
        });

        this.limpiarFormularioProducto();
    }

    private asignarValoresEliminar(_form: any): void {
        this.formularioEliminarActivo = true;
        this.productoEliminar = _form;
    }

    public mostrarFormularioProducto(): void {
        this.limpiarFormularioProducto();
        this.formularioProductoActivo = true;
        this.esCreacionProducto = true;
    }

    public crearProducto(_form: any): void {

        if (_form !== null) {

            let requestUrl: string = (this.esCreacionProducto) ? "/mantenimiento/productos/insert" : "/mantenimiento/productos/actualiza";
            let requestObj: object = {
                idInstitucion: this.institucion.idInstitucion,
                idPais: this.institucion.idPais,
                idTipoNomina: parseInt(_form.tipoNomina, 0),
                idProducto: parseInt(_form.producto, 0),
                idPeriodicidad: parseInt(_form.periodicidad, 0)
            };

            this.formularioProductoActivo = false;
            /*console.log(requestObj);*/
            this.realizarPeticionHttp(requestObj, requestUrl).subscribe((response: any) => {
                /*console.log(response);*/
                if (response.codE === 0) {
                    this.notifications.success("Exito !!!", response.msgE);
                    this.consultarProductosInstitucion();
                } else {
                    this.notifications.info("Aviso !!!", response.msgE);
                }
            });
        }
    }

    private consultarDetalleProducto(_prod: any): void {

        this.limpiarFormularioProducto();
        this.formularioProductoActivo = true;
        this.esCreacionProducto = false;

        let idProd: any = (_prod.idProducto !== null && _prod.idProducto > 0) ? _prod.idProducto : "";
        let idNomi: any = (_prod.idTipoNomina !== null && _prod.idTipoNomina > 0) ? _prod.idTipoNomina : "";
        let idPeri: any = (_prod.idPeriodicidadPago !== null && _prod.idPeriodicidadPago > 0) ? _prod.idPeriodicidadPago : "";

        this.formularioProducto.controls['producto'].reset({ value: idProd, disabled: true });
        this.formularioProducto.controls['tipoNomina'].reset({ value: idNomi, disabled: false });
        this.formularioProducto.controls['periodicidad'].reset({ value: idPeri, disabled: idPeri !== "" ? false : true });
    }

    public eliminarProducto(): void {

        let requestUrl: string = "/mantenimiento/productos/elimina";
        let requestObj: object = {
            idInstitucion: this.institucion.idInstitucion,
            idPais: this.institucion.idPais,
            idTipoNomina: this.productoEliminar.idTipoNomina,
            idProducto: this.productoEliminar.idProducto,
            idPeriodicidad: this.productoEliminar.idPeriodicidadPago
        };

        this.realizarPeticionHttp(requestObj, requestUrl).subscribe((response: any) => {

            this.formularioEliminarActivo = false;

            if (response.codE === 0) {
                this.notifications.success("Exito !!!", response.msgE);
                this.consultarProductosInstitucion();
            } else {
                this.notifications.info("Aviso !!!", response.msgE);
            }
        });
    }

    private consultarCatalogosProductos(): void {

        super.loading(true);

        let requestUrl: string = "/mantenimiento/productos/catalogo/consulta";
        let requestObj: object = { idInstitucion: this.institucion.idInstitucion, idPais: this.institucion.idPais };

        this.realizarPeticionHttp(requestObj, requestUrl).subscribe((response: any) => {
            if (response.codE === 0) {
                if (response.jsonResultado !== null) {
                    /*this.notifications.success("Exito !!!",response.msgE);*/

                    let listaProductos: any[] = [];

                    listaProductos = response.jsonResultado.pa_DATOSPROD;

                    let objAnterior: any = { idProducto: null, producto: null };

                    for (let item of this.productosInstitucion) {

                        let objProd: any = JSON.parse(JSON.stringify(objAnterior));

                        objProd.idProducto = item.idProducto;
                        objProd.producto = item.producto;

                        if (objAnterior !== null) {
                            if (objProd.idProducto !== objAnterior.idProducto && objProd.producto !== objAnterior.producto) {
                                listaProductos.push(JSON.parse(JSON.stringify(objProd)));
                            }
                        }
                        objAnterior = objProd;
                    }

                    this.catalogoProducto = listaProductos;
                    /*console.log(this.catalogoProducto);*/
                    this.catalogoTipoNomina = response.jsonResultado.pa_DATOSTIPNOM;
                    /*console.log(this.catalogoTipoNomina);*/
                    this.catalogoPeriodicidad = response.jsonResultado.pa_DATOSPERIPAG;
                    /*console.log(this.catalogoPeriodicidad);*/
                } else {
                    this.notifications.info("Aviso !!!", "La respuesta fue correcta, pero vacia !!!");
                }
            } else {
                this.notifications.info("Aviso !!!", response.msgE);
            }
            super.loading(false);
        });
    }

    private consultarProductosInstitucion(): void {

        super.loading(true);

        let requestUrl: string = "/mantenimiento/productos/consulta";
        let requestObj: object = { idInstitucion: this.institucion.idInstitucion, idPais: this.institucion.idPais };

        this.realizarPeticionHttp(requestObj, requestUrl).subscribe((response: any) => {

            if (response.codE === 0) {
                if(response.jsonResultado !== null && response.jsonResultado.length > 0) {

                    let listaProductos: any[] = response.jsonResultado;
                    let lengthProductos: number = listaProductos.length;

                    this.paginadorProductos = this.pagination.getPager(lengthProductos);
                    this.productosInstitucion = this.pagination.getPagerdata(listaProductos);

                    /*console.log(listaProductos);*/

                } else {
                    this.notifications.info("Aviso !!!", "La respuesta fue correcta, pero vacia !!!");
                }
            } else {
                this.notifications.info("Aviso !!!", response.msgE);
            }
            super.loading(false);
        });
    }

    private setPagePaginator(page: number, rango?: number, total?: number): void {
        if (page < 1 || page > this.paginadorProductos.totalPages) {
            return;
        }
        this.paginadorProductos = this.pagination.getPager(total, page, rango);
        this.productosInstitucion = this.pagination.getPagerdata([],page);
    }

    private limpiarFormularioProducto(): void {
        this.formularioProducto.controls['producto'].reset({ value: "", disabled: false });
        this.formularioProducto.controls['tipoNomina'].reset({ value: "", disabled: false });
        this.formularioProducto.controls['periodicidad'].reset({ value: "", disabled: false });
    }

    /* Consumo de servicios */
    private realizarPeticionHttp = (_requestJson: any, _requestUrl: string): Observable<Object> => {

        let observableRequest: any = Observable.create(observer => {

            this.service.post(_requestJson, _requestUrl, 3).subscribe(
                (data: any) => {
                    let response = JSON.parse(JSON.stringify(data));
                    observer.next(response);
                    observer.complete();
                },
                error => { observer.next(null); observer.complete(); },
                () => { observer.next(null); observer.complete(); }
            );
        });
        return observableRequest;
    }
}
