import { Component, OnInit,ViewChild,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../../../service/service';
import { ClassGenerica } from '../../../classGeneric/config';
import { Notifications } from '../../../classGeneric/notifications';
import { HeaderModule } from '../../../header/header.module';
import { PaginationFron } from '../../../classGeneric/paginationFront';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Ng2Tables } from '../../../ng2-tables/ng2-tables.component';

import { ConfigNgTable2, PagesHandler } from '../../../ng2-tables/ng2-tables';
import { ValidationService } from '../../../validator/validation.service';

import { FilterTable } from '../../../pipes/pipes-portal';

@Component({
    selector: 'my-ips',
    templateUrl: 'seguridad.html',
})


export class SeguridadIpsComponent extends ClassGenerica implements AfterViewInit {


    @ViewChild('tablaips') tablaIps: Ng2Tables;


    public ph: PagesHandler = new PagesHandler();
    public strBusqueda: string = '';
    menuLateral: Array<Object>;
    urlRequestGeneral: String;
    objRequestGeneral: Object;
    formulario: any;
    saveItem: Boolean;
    editItem: Boolean;
    displayModal: Boolean;
    showDialogAlert: Boolean = false;
    EliminaId:  any;
    DisableId: Boolean = false;
    


    pager: any = {};
    pagedItems: Array<Object>;


    listaIps: Array<Object>;
    public Ips: Array<Object>;

    constructor( private router: Router,private formBuilder: FormBuilder,private service: Service,private notifications: Notifications,private pagination: PaginationFron){        
        super();
 
        
        this.menuLateral = this.getMenuLateral();
        this.menuNavigation = this.menuNavigation();
        let pathredirec = JSON.parse(JSON.stringify(this.menuLateral[0])).url;
        // this.router.navigate([pathredirec]);


        this.objRequestGeneral = {
            idIp: null,
            IpAddress: null,
            Descripcion: null
           
            
        };

        this.formulario = this.formBuilder.group({
            'idIp': ['', [Validators.required, ValidationService.validarNumeros]],
            'ipAddress': ['', [Validators.required]],
            'descripcion': ['', [Validators.required]]
           
            
           
        });

        this.obtenerListaIps();
       
    }
    ngAfterViewInit() {
        // this.obtenerListaIps();
    }




    private lanzarPeticionHttpGeneral(request: any, url: String): void {
        
                super.loading(true);
                this.displayModal = false;
        
                console.log("Cuerpo peticion -> ", request);
        
                this.service.post(request, url, 1).subscribe(
                    data => {
        
                        let object = JSON.parse(JSON.stringify(data));
       console.log(object);
                        if (object.codE === 0) {
                            this.obtenerListaIps();
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

    private obtenerListaIps(): void {
        super.loading(true);

        this.urlRequestGeneral = "/AsesorBig/portal/ip/consulta";

        let _requestGeneral: any = this.objRequestGeneral;
        _requestGeneral.idIp = null;

        this.service.post(_requestGeneral, this.urlRequestGeneral, 1).subscribe(
            successResponse => {

                let response = JSON.parse(JSON.stringify(successResponse));

                if (response.codE === 0 && response.jsonResultado != null) {
                    
                    this.listaIps = response.jsonResultado;
                    this.Filtrarips('');
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

    public Filtrarips(_str: string): void {
        // console.log('elder es gay');
        this.Ips = new FilterTable().transform(this.listaIps, _str);
        this.tablaIps.SetTabla(new ConfigNgTable2(this.Ips.length, 10));
    }


   


    public ActualizarTabla(_config: any): void {
        this.ph = _config;
    }

    public mostrarFormularioModal(): void {
        //Save Item
                this.displayModal = true;
                this.saveItem = true;
                this.editItem = false;
        
                this.formulario.controls['idIp'].setValue('');
                this.formulario.controls['ipAddress'].setValue('');
                this.formulario.controls['descripcion'].setValue('');
              
                
                
            }




            public mostrarDetalleModal(ips: any): void {
              // Update Item
                        this.displayModal = true;
                        this.saveItem = false;
                        this.editItem = true;
                        this.DisableId = true;


                        this.formulario.controls['idIp'].setValue(String(ips.idIP));
                        this.formulario.controls['ipAddress'].setValue(String(ips.ipAddress));
                        this.formulario.controls['descripcion'].setValue(String(ips.descripcion));
                        // this.formulario.controls['status'].setValue(String(ips.status));
                      
                       
                    }
                


            public saveForm(): void {
                
                        if (this.formulario.valid) {
                            this.urlRequestGeneral = this.saveItem ? "/AsesorBig/portal/ip/alta" : "/AsesorBig/portal/ip/actualiza";
                            this.lanzarPeticionHttpGeneral(this.formulario.value, this.urlRequestGeneral);
                        }
                    }


                    public deleteForm(): void {
                           
                       
                                let objectReq: any = this.objRequestGeneral;
                                this.urlRequestGeneral = "/AsesorBig/portal/ip/baja";
                                objectReq.idIp = this.EliminaId;
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


                    private eliminarips(ips: any):void {
                      
                        this.showDialogAlert = true;
                        this.EliminaId = ips.idIP;

                    }

























}