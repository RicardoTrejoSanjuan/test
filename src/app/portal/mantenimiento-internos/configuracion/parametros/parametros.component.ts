import { Component, OnInit, ViewChild, AfterViewInit, Input, Pipe } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../../../../service/service';
import { ClassGenerica } from '../../../../classGeneric/config';
import { Notifications } from '../../../../classGeneric/notifications';
import { HeaderModule } from '../../../../header/header.module';
import { PaginationFron } from '../../../../classGeneric/paginationFront';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Ng2Tables } from '../../../../ng2-tables/ng2-tables.component';

import { ConfigNgTable2, PagesHandler } from '../../../../ng2-tables/ng2-tables';
import { ValidationService } from '../../../../validator/validation.service';

import { FilterTable } from '../../../../pipes/pipes-portal';
declare var jquery: any;
declare var $: any;



@Component({
    selector: 'sortable-column',
    templateUrl: 'parametros.html',
})


export class ParametrosComponent extends ClassGenerica implements AfterViewInit {


    @ViewChild('tablaparametros') tablaParams: Ng2Tables;




    public ph: PagesHandler = new PagesHandler();
    public strBusqueda: string = '';
    menuLateral: Array<Object>;
    urlRequestGeneral: String;
    objRequestGeneral: Object;
    formulario: any;
    formularioInsert: any;
    saveItem: Boolean;
    editItem: Boolean;
    displayModal: Boolean;
    displayModalActualiza: Boolean;
    displayModal2: Boolean;
    showDialogAlert: Boolean = false;
    EliminaId: any;
    EliminaParametro: any;
    DisableId: Boolean = false;
    idGrupo: any;

    isDesc: boolean = false;
    column: string = 'CategoryName';



    pager: any = {};
    pagedItems: Array<Object>;


    listaParametros: Array<Object>;
    grupoId: Array<Object>;
    public Parametros: Array<Object>;

    constructor(private router: Router, private formBuilder: FormBuilder, private service: Service, private notifications: Notifications, private pagination: PaginationFron) {


        super();


        this.menuLateral = this.getMenuLateral(1);
        this.menuNavigation = this.menuNavigation();
        console.log(JSON.stringify(this.menuLateral));



        this.objRequestGeneral = {
            idGrupo: null,
            idParametro: null

        };

        this.formulario = this.formBuilder.group({
            'idGrupo': ['', [Validators.required, ValidationService.validarNumeros]],
            'idParametro': ['', [Validators.required]],
            'descripcion': ['', [Validators.required]],
            'valor': ['', [Validators.required]],
            'status': ['', [Validators.required]]



        });

        this.formularioInsert = this.formBuilder.group({
            'idGrupo': ['', [Validators.required, ValidationService.validarNumeros]],
            'idParametro': ['', [Validators.required]],
            'descripcion': ['', [Validators.required]],
            'valor': ['', [Validators.required]]




        });

        this.obtenerListaParametros();



    }










    ngAfterViewInit() {
        // this.obtenerListaParametros();
    }




    private lanzarPeticionHttpGeneral(request: any, url: String): void {

        super.loading(true);
        this.displayModal = false;

        console.log("Cuerpo peticion -> ", request);

        this.service.post(request, url, 3).subscribe(
            data => {

                let object = JSON.parse(JSON.stringify(data));
                console.log(object);
                if (object.codE === 0) {
                    this.obtenerListaParametros();
                    this.notifications.success("Exito !!!", object.msgE);

                } else {
                    this.notifications.info("Aviso !!!", object.msgE);
                }
            },
            error => {
                this.notifications.error("Error !!!", error);
            },
            () => super.loading(false)
        );
    }

    private obtenerListaParametros(): void {
        super.loading(true);

        this.urlRequestGeneral = "/mantenimiento/configuracion/parametros/consulta";

        let _requestGeneral: any = this.objRequestGeneral;
        _requestGeneral.idGrupo = null;
        if (_requestGeneral.idParametro !== null) {
            _requestGeneral.idParametro = null;
        }
        // _requestGeneral.idParametro=null;

        this.service.post(_requestGeneral, this.urlRequestGeneral, 3).subscribe(
            successResponse => {

                let response = JSON.parse(JSON.stringify(successResponse));

                if (response.codE === 0 && response.jsonResultado != null) {
                    console.log("Actualize");
                    this.listaParametros = response.jsonResultado;
                    console.log(this.listaParametros);
                    this.Filtrarparametros('');
                } else {
                    this.notifications.info("Aviso !!!", response.msgE);
                }
            },
            failureResponse => {
                this.notifications.error("Error !!!", failureResponse);
            },
            () => super.loading(false)
        );
    }

    public Filtrarparametros(_str: string): void {
        // console.log('elder es gay');
        this.Parametros = new FilterTable().transform(this.listaParametros, _str);
        this.tablaParams.SetTabla(new ConfigNgTable2(this.Parametros.length, 10));
    }

    public consultaId(parametro: any): void {
        this.displayModal2 = true;
        this.showDialogAlert = false;

        this.idGrupo = null;

        this.urlRequestGeneral = "/mantenimiento/configuracion/grupos/consulta";

        let _requestGeneral: any = this.objRequestGeneral;

        _requestGeneral.idGrupo = this.idGrupo;

        this.service.post(_requestGeneral, this.urlRequestGeneral, 3).subscribe(
            successResponse => {

                let response = JSON.parse(JSON.stringify(successResponse));

                if (response.codE === 0 && response.jsonResultado != null) {

                    this.grupoId = response.jsonResultado;
                    console.log(this.grupoId);

                    this.Filtrarparametros('');


                } else {
                    this.notifications.info("Aviso !!!", response.msgE);
                }
            },
            failureResponse => {
                this.notifications.error("Error !!!", failureResponse);
            },
            () => super.loading(false)
        );

    }






    public ActualizarTabla(_config: any): void {
        this.ph = _config;
    }



    public onSorted(): void {




    }

    public mostrarFormularioModal(): void {
        //Save Item

        this.displayModal = true;

        this.saveItem = true;
        this.editItem = false;

        this.formularioInsert.controls['idGrupo'].setValue('');
        this.formularioInsert.controls['idParametro'].setValue('');
        this.formularioInsert.controls['descripcion'].setValue('');
        this.formularioInsert.controls['valor'].setValue('');


        this.consultaId(null);

    }




    public mostrarDetalleModal(parametro: any): void {
        // Update Item

        this.displayModal = false;
        this.displayModalActualiza = true;
        this.saveItem = false;
        this.editItem = true;
        this.DisableId = true;



        console.log(parametro);

        this.formulario.controls['idGrupo'].setValue(String(parametro.idGrupo));
        this.formulario.controls['idParametro'].setValue(String(parametro.idParametro));
        this.formulario.controls['descripcion'].setValue(String(parametro.parametro));
        this.formulario.controls['valor'].setValue(String(parametro.valor));
        this.formulario.controls['status'].setValue(String(parametro.status));


    }

    public mostrarListaModal(parametro: any): void {
        // Update Item
        this.displayModal2 = true;


    }



    public saveForm(): void {

        if (this.formulario.valid) {
            this.urlRequestGeneral = this.saveItem ? "/mantenimiento/configuracion/parametros/alta" : "/mantenimiento/configuracion/parametros/actualiza";
            console.log(this.urlRequestGeneral);
            this.displayModalActualiza = false;
            this.lanzarPeticionHttpGeneral(this.formulario.value, this.urlRequestGeneral);
        }
    }


    public saveForm2(): void {

        if (this.formularioInsert.valid) {
            this.urlRequestGeneral = "/mantenimiento/configuracion/parametros/alta";
            console.log(this.urlRequestGeneral);
            this.displayModalActualiza = false;
            this.lanzarPeticionHttpGeneral(this.formularioInsert.value, this.urlRequestGeneral);
        }
    }


    public deleteForm(): void {


        let objectReq: any = this.objRequestGeneral;
        this.urlRequestGeneral = "/mantenimiento/configuracion/parametros/baja";
        objectReq.idGrupo = this.EliminaId;
        objectReq.idParametro = this.EliminaParametro;

        this.lanzarPeticionHttpGeneral(objectReq, this.urlRequestGeneral);
        this.showDialogAlert = false;

    }





    setPage(page: number, rango?: number, total?: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagination.getPager(total, page, rango);
        this.pagedItems = this.pagination.getPagerdata([], page);
    }


    private eliminarips(parametro: any): void {

        this.showDialogAlert = true;
        this.EliminaId = parametro.idGrupo;
        console.log('Yo soy el idElimina' + this.EliminaId);
        this.EliminaParametro = parametro.idParametro;
        console.log('Yo soy el EliminaParametro' + this.EliminaParametro);

    }


    // probes of Table  Sorter
    direction: number;
    sort(property) {
        this.isDesc = !this.isDesc; //change the direction
        this.column = property;
        let direction = this.isDesc ? 1 : -1;

        this.Parametros.sort(function(a, b) {
            if (a[property] < b[property]) {
                return -1 * direction;
            }
            else if (a[property] > b[property]) {
                return 1 * direction;
            }
            else {
                return 0;
            }
        });
    };



    public SortTableByNumber(_item: any): void {
        this.Parametros.sort(function(a: any, b: any) {
            return a[_item] - b[_item];
        });
    }
    public SortTableByString(_item: any): void {
        this.Parametros.sort(function(a: any, b: any) {
            return (a[_item] > b[_item]) ? 1 : ((b[_item] > a[_item]) ? -1 : 0);
        });
    }








}
