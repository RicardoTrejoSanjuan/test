import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit,ViewChild } from '@angular/core';

import { Service } from '../../../../service/service';
import { ClassGenerica } from '../../../../classGeneric/config';
import { Notifications } from '../../../../classGeneric/notifications';
import { PaginationFron } from '../../../../classGeneric/paginationFront';

import { TarjetasRemesaUtils } from '../../tarjetas-remesa';

import { FilterTable } from '../../../../pipes/pipes-portal';
import { Ng2Tables } from '../../../../ng2-tables/ng2-tables.component';
import { ConfigNgTable2, PagesHandler} from '../../../../ng2-tables/ng2-tables';

import { JsonToCsv } from '../../../../classGeneric/jsontocsv';

@Component({
    selector: "r-detalle",
    templateUrl: "remesas-detalle.component.html",
    styleUrls: ["../../tarjetas-remesa.component.css"]
})

export class RemesasDetalleComponent extends ClassGenerica implements OnInit {

    public remesa: any;
    public menuLateral: any[];
    private listaRemesaDetalle: any[];
    private utils: TarjetasRemesaUtils;

    private idResponsable: number;

    private generarCsv: boolean;
    public mostrarPaginadorTabla: boolean;

    public detalleRemesaFiltradas: Array<Object>;
    public manejadorPaginas: PagesHandler = new PagesHandler();
    public cadena:any;
    @ViewChild('tablaDetalleRemesa') tablaDetalleRemesa_vc: Ng2Tables;

    constructor(private _service: Service,private _notifications: Notifications,private _location: Location,private _router: Router,private csvExport: JsonToCsv) {
        super();

        this.menuLateral = this.getMenuLateral(1);
        this.menuNavigation = this.menuNavigation();

        this.generarCsv = false;

        this.listaRemesaDetalle = [];
        this.detalleRemesaFiltradas = [{}];

        this.remesa = super.getAttr('remesa');
        
        this.idResponsable = parseInt(super.isKeyUser(),0);
        this.utils = new TarjetasRemesaUtils(this._service);
        this.menuLateral = this.utils.obtenerMenuLateralLimpio(this.menuLateral);
    }

    ngOnInit() {
        this.consultarDetalleRemesa();
    }

    consultarDetalleRemesa(): void {

        super.loading(true);

        let objUrls: any = this.utils.urlsTarjetasModule;

        let urlRequest: string = objUrls.seccionRemesas.consultaDetalleRemesa;

        let objRequest: object = {numRemesa: this.remesa.numRemesa,numTarjeta: null,pagina: null};

        console.log(objRequest);

        this.utils.realizarPeticionHttp(objRequest,urlRequest).subscribe(
            (data: any) => {
                console.log("Respuesta de la consulta detalle de remesa -> ",data);
                let response: any = JSON.parse(JSON.stringify(data));
                if(response.codE === 0) {
                    if(!this.generarCsv) {
                        this.listaRemesaDetalle = response.jsonResultado.consulta;
                        this._notifications.success("Correcto !!!",response.msgE);
                    } else {
                        this.generarCsv = false;
                        this._notifications.success("Correcto !!!","Los datos fueron exportados a un archivo Excel");
                        this.csvExport.generateToExcel(response.jsonResultado.consulta,'Detalle_remesa_'+this.remesa.numRemesa);
                    }
                } else {
                    this._notifications.info("Aviso !!!",response.msgE);
                }
                super.loading(false);
                this.filtrarDetalleRemesa("");
            }
        );
    }

    consultarDetalleTarjeta(tarjeta_: any): void {
        super.saveData(tarjeta_, 'tarjetaRemesa');
        this._router.navigate(['./tarjetas-remesa/detalle-tarjetas']);
    }

    exportarDatosModulo(): void {
        this.generarCsv = true;
        this.consultarDetalleRemesa();
    }

    regresar(): void {
        this._location.back();
    }

    filtrarDetalleRemesa(_str: string): void {
        
        this.detalleRemesaFiltradas = new FilterTable().transform(this.listaRemesaDetalle, _str);
        
        if(this.detalleRemesaFiltradas.length > 0) {
            this.mostrarPaginadorTabla = true;
            setTimeout(() => {
                this.tablaDetalleRemesa_vc.SetTabla(new ConfigNgTable2(this.detalleRemesaFiltradas.length,10));
            },0);
        }else {
            this.mostrarPaginadorTabla = false;
        }
    }

    actualizarTablaDetalleRemesa(_conf: any):void {
        this.manejadorPaginas = _conf;
    }
}