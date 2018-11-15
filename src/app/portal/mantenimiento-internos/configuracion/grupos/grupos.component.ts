import { Component, OnInit,ViewChild,AfterViewInit } from '@angular/core';
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


@Component({
    selector: 'my-configuracionmi',
    templateUrl: 'grupos.html',
})

export class GruposComponent extends ClassGenerica implements AfterViewInit {


        @ViewChild('tablagrupos') tablaGrupos: Ng2Tables;
        @ViewChild('tablalistas') tablaListas: Ng2Tables;



        public ph: PagesHandler = new PagesHandler();
        public ph2: PagesHandler = new PagesHandler();
        public strBusqueda: string = '';
        menuLateral: Array<Object>;
        urlRequestGeneral: String;
        objRequestGeneral: Object;
        formulario: any;
        saveItem: Boolean;
        editItem: Boolean;
        displayModal: Boolean;
        displayModal2: Boolean;
        showDialogAlert: Boolean = false;
        EliminaId:  any;
        DisableId: Boolean = false;
        idGrupo: any;
        status: any;



        pager: any = {};
        pagedItems: Array<Object>;


        listaGrupos: Array<Object>;
        grupoId: Array<Object>;
        public Grupo: Array<Object>;

        constructor( private router: Router,private formBuilder: FormBuilder,private service: Service,private notifications: Notifications,private pagination: PaginationFron){
            super();


            this.menuLateral = this.getMenuLateral(1);
            this.menuNavigation = this.menuNavigation();


            this.objRequestGeneral = {
                idGrupo: null
            };

            this.formulario = this.formBuilder.group({
                'idGrupo': ['', [Validators.required, ValidationService.validarNumeros]],
                'descripcion': ['', [Validators.required]],
                'status':['']

            });

            this.obtenerListaGrupos();
           
        }
        ngAfterViewInit() {
            // this.obtenerListaGrupos();
        }


        public SortTableByNumber(_item: any): void {
            this.Grupo.sort(function(a: any, b: any) {
                return a[_item] - b[_item];
            });
        }
        public SortTableByString(_item: any): void {
            this.Grupo.sort(function(a: any, b: any) {
                return (a[_item] > b[_item]) ? 1 : ((b[_item] > a[_item]) ? -1 : 0);
            });
        }

        private lanzarPeticionHttpGeneral(request: any, url: String): void {

                    super.loading(true);
                    this.displayModal = false;

                    console.log("Cuerpo peticion -> ", request);

                    this.service.post(request, url, 3).subscribe(
                        data => {

                            let object = JSON.parse(JSON.stringify(data));
                                 console.log(JSON.stringify(data));
                            if (object.codE === 0) {
                                this.obtenerListaGrupos();
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

        private obtenerListaGrupos(): void {
            super.loading(true);

            this.urlRequestGeneral = "/mantenimiento/configuracion/grupos/consulta";

            let _requestGeneral: any = this.objRequestGeneral;
            console.log(_requestGeneral);

            _requestGeneral.idGrupo = null;

            this.service.post(_requestGeneral, this.urlRequestGeneral, 3).subscribe(
                successResponse => {

                    let response = JSON.parse(JSON.stringify(successResponse));

                    if (response.codE === 0 && response.jsonResultado != null) {

                        this.listaGrupos = response.jsonResultado;
                        //console.log(this.listaGrupos);
                        this.Filtrargrupos('');
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
        public Filtrargrupos(_str: string): void {
            this.Grupo = new FilterTable().transform(this.listaGrupos, _str);

            this.tablaGrupos.SetTabla(new ConfigNgTable2(this.Grupo.length, 10));
        }






        public ActualizarTabla(_config: any): void {
            this.ph = _config;
        }



        public mostrarFormularioModal(): void {

                    this.displayModal = true;
                    this.saveItem = true;
                    this.editItem = false;

                    this.formulario.controls['idGrupo'].setValue('');
                    this.formulario.controls['descripcion'].setValue('');
                    this.formulario.controls['descripcion'].setValue('');



                }




                public mostrarDetalleModal(grupos: any): void {

                            this.displayModal = true;
                            this.saveItem = false;
                            this.editItem = true;
                            this.DisableId = true;

                            this.formulario.controls['idGrupo'].setValue(String(grupos.idGrupo));
                            this.formulario.controls['descripcion'].setValue(String(grupos.descripcion));
                            this.formulario.controls['status'].setValue(String(grupos.status));




                        }

                        private consultaId(grupos: any):void {
                            this.displayModal2 = true;
                              this.showDialogAlert = false;
                              this.idGrupo = grupos.idGrupo;

                                  this.urlRequestGeneral = "/mantenimiento/configuracion/grupos/parametros/consulta";

                                  let _requestGeneral: any = this.objRequestGeneral;

                                  _requestGeneral.idGrupo = this.idGrupo;

                                  this.service.post(_requestGeneral, this.urlRequestGeneral, 3).subscribe(
                                      successResponse => {

                                          let response = JSON.parse(JSON.stringify(successResponse));

                                          if (response.codE === 0 && response.jsonResultado != null) {

                                              this.grupoId = response.jsonResultado;

                                              this.FiltrarListas('');


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

                          private FiltrarListas(_str: string): void {
                            //Nueva tabla 2
                            this.tablaListas.SetTabla(new ConfigNgTable2(this.grupoId.length, 5));
                        }

                        public ActualizarTabla2(_config: any): void {
                            this.ph2 = _config;
                        }

                        public mostrarListaModal(Grupo: any): void {
                            // Update Item
                                      this.displayModal2 = true;


                                  }



                public saveForm(): void {

                            if (this.formulario.valid) {

                                this.urlRequestGeneral = this.saveItem ? "/mantenimiento/configuracion/grupos/alta" : "/mantenimiento/configuracion/grupos/actualiza";
                                this.lanzarPeticionHttpGeneral(this.formulario.value, this.urlRequestGeneral);

                            }
                        }


                        public deleteForm(): void {


                                    let objectReq: any = this.objRequestGeneral;
                                    this.urlRequestGeneral = "/mantenimiento/configuracion/grupos/baja";
                                    objectReq.idGrupo = this.EliminaId;
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


                        private eliminarips(Grupo: any):void {

                            this.showDialogAlert = true;
                            this.EliminaId = Grupo.idGrupo;

                        }
























    }
