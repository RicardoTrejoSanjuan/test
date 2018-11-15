import { Service } from '../../../../service/service';
import { Router } from '@angular/router';
import { Notifications } from '../../../../classGeneric/notifications';
import * as _ from 'underscore';

import { ServiceMCService } from './../../shared/services/serviceMC.service';

import { Injectable } from "@angular/core";
import { Pagination } from '../../../../classGeneric/pagination';
import { Parameter } from '../../shared/models/page';
import { MESA_CONTROL } from '../../shared/constants/constants-url';
import { Employee } from '../../shared/models/employee';
import { Column } from '../../shared/models/search';
import { CatalogosMC } from './../../shared/constants/constants-mesa-control';

@Injectable()
export class BandejaController extends Pagination {

    private serviceMC: ServiceMCService;

    constructor(private catalogos?: CatalogosMC, private service?: Service, private router?: Router, private notifications?: Notifications) {
        super();
        this.serviceMC = new ServiceMCService(service);
    };

    //Metodo para obtener la informacion en  la vista
    public getRequest(parameterSolicitud: Parameter): any {
        return this.serviceMC.callPost(this.parameterValidation(parameterSolicitud), this.urlValidation(parameterSolicitud), 3).then(result => {
            let jsonResultado = JSON.parse(JSON.stringify(result));
            if (jsonResultado.codE === 0) {
                console.log("Solicitudes MC: ", jsonResultado);
                return jsonResultado.jsonResultado;
            } else {
                this.showError(jsonResultado.codE);
                return { total: 0, rango: 30, consulta: [] };
            }
        });
    }

    private parameterValidation(_parameter: Parameter): Parameter {
        if (_parameter.estado.toString().length > 1) {
            var digit = _parameter.estado.toString()[1];
            _parameter.idEstatus = parseInt(digit);
            _parameter.idRol = _parameter.idrol;
            _parameter.estatus_sol = 2;
        }
        console.log(_parameter)
        return _parameter;
    }

    private urlValidation(_parameter: Parameter): string {
        let _url = (_parameter.estado.toString().length > 1) ? MESA_CONTROL.consultaPorRol2 : MESA_CONTROL.consultaPorRol;
        return _url;
    }

    // Metodo para consultar la disponibilidad de un  empleado
    public getAvailable(_params: Object): any {
        return this.serviceMC.callPost(_params, MESA_CONTROL.bloquea, 3).then(result => {
            let jsonResultado = JSON.parse(JSON.stringify(result));
            if (jsonResultado.codE === 0 || jsonResultado.codE === 3) {
                console.log("Access: ", jsonResultado);
                jsonResultado.jsonResultado.analist = jsonResultado.codE;
                return jsonResultado.jsonResultado;
            }
            else if (jsonResultado.codE === 2) {
                let res: any = jsonResultado.jsonResultado.shift();
                let informacion: string = 'Solicitud en revision | Revisor: ' + res.nombre + ' ' + res.apellidoPaterno + ' ' + res.apellidoMaterno + ' | Fecha: ' + res.fecha;
                this.notifications.info(informacion);
                return 0;
            } else {
                this.showError(jsonResultado.codE);
                return 0;
            }
        });
    }

    private showError(code: number): void {
        switch (code) {
            case 1:
                this.notifications.alert('Error de conexion inténtelo más tarde');
                break;
            case 4:
                this.notifications.alert('Usuario sin permisos suficientes');
                break;
            case 5:
                this.notifications.alert('Usuario no autorizado para realizar esta operación');
                break;
            default:
                this.notifications.alert('Error de conexion inténtelo más tarde');
                break;
        }
    }

    // Limpia el campo nombre si el estatus es 0
    public cleanJsonEmployee(consulta: any): any {
        return consulta.map((dato: any) => {
            if (Number(dato.estadoBloqueo) === 0) {
                dato.nombreBloqueo = '';
            }
            return dato;
        });
    }

    public getColumnsTable(): Column[] {
        return this.catalogos.getColumNameBandeja();
    }

    public getColumnsTableAsesor(): Column[] {
        return this.catalogos.getColumNameBandejaAsesor();
    }

    public fieldImage(listEmployee: Employee[]): Employee[] {
        listEmployee.map((item: Employee) => {
            item.imagen = "imagen"
        });
        return listEmployee
    }
}