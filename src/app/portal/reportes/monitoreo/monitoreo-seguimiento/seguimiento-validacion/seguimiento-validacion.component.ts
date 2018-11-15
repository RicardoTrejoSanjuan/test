/*
 * @version 1.0 (21-11-2017)
 * @author lfgonzalezr
 * @description Monitoreo de instituciones
 * @contributors Front-end team
 */
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ClassGenerica } from "../../../../../classGeneric/config";
import { Notifications } from "../../../../../classGeneric/notifications";
import { Service } from "../../../../../service/service";
//Variables de manejo
import { ObjHandlerMonitoreoConfiguracion } from "../../monitoreo";

@Component({
    selector: "monitoreo-seguimiento-validacion",
    templateUrl:"seguimiento-validacion.component.html",
    styleUrls: [
        "seguimiento.component.css",
        "../../monitoreo.component.css",
    ]
})
export class MonitoreoSeguimientoValidacion extends ClassGenerica {
    public objHandler: ObjHandlerMonitoreoConfiguracion = new ObjHandlerMonitoreoConfiguracion();
    private arrayFlujoTraking: Array<object> = [];
    private diasTotales: number = 0;
    private institucion: any = null;

    constructor(private router: Router, private _serv: Service, private _notif: Notifications) {
        super();
        this.institucion = super.getAttr("institucion");
        this.ConsultarTraking(this.institucion.rfcInstitucion);
    }
    private ConsultarTraking(_rfc: string): void {
        let jsonSend: object = {
            "RFCInstitucion": _rfc
        };
        let path: string = "/api/traking/institucion/consulta";
        super.loading(true);
        this._serv.post(jsonSend, path, 3).subscribe((data: any) => {
            super.loading(false);
            try {
                if (data.codE === 0) {
                    this.objHandler.setTabVisible('conRegistros');
                    this.arrayFlujoTraking = this.ValidateItems(data.jsonResultado);
                    this.diasTotales = data.diasTotales;
                } else {
                    this.objHandler.setTabVisible('sinRegistros');
                    this._notif.info(data.msgE);
                }
            } catch (e) { }
        });
    }
    private ActualizarTarea(_data: any, _idBandera: number): void {
        let jsonSend: object = {
            "RFCInstitucion": this.institucion.rfcInstitucion,
            "idFlujo": _data.idFlujo,
            "consecutivo": _data.consecutivo,
            "idTraking": _data.idTraking,
            "idBandera": _idBandera,
            "fechaInicio": _data.fechaInicio === null ? "" : _data.fechaInicio,
            "fechaFin": _data.fechaFin === null ? "" : _data.fechaFin,
            "status": _data.status,
            "usuarioModif": super.isKeyUser()
        };
        let path: string = "/api/traking/institucion/actualizacionfechas";
        super.loading(true);
        this._serv.post(jsonSend, path, 3).subscribe((data: any) => {
            super.loading(false);
            try {
                if (data.codE === 0) {
                    let msge: string =
                        _idBandera === 1
                            ? "Se ha iniciado la tarea correctamente"
                            : "Se finalizo la tarea correctamente";
                    this._notif.success(msge);
                    this.ConsultarTraking(this.institucion.rfcInstitucion);
                } else {
                    this._notif.info(data.msgE);
                }
            } catch (e) { }
        });
    }
    private ActualizarDias(_data: any, _dias: number): void {
        let jsonSend: object = {
            "RFCInstitucion": this.institucion.rfcInstitucion,
            "idFlujo": _data.idFlujo,
            "consecutivo": _data.consecutivo,
            "idTraking": _data.idTraking,
            "idDias": _dias,
            "usuarioModif": super.isKeyUser()
        };
        let path: string = '/api/traking/institucion/actualizaciondias';
        super.loading(true);
        this._serv.post(jsonSend, path, 3).subscribe((data: any) => {
            super.loading(false);
            try {
                if (data.codE === 0) {
                    this._notif.success(data.msgE);
                    this.ConsultarTraking(this.institucion.rfcInstitucion);
                } else {
                    this._notif.info(data.msgE);
                }
            } catch (e) { }
        });
    }
    private ModificarDias(_evt: any, _item: any): void {
        try {
            let dias: number = _evt.target.value;
            if (!isNaN(dias) && dias >= 1) {
                dias = Math.floor(dias);
                this.ActualizarDias(_item, dias);
            } else {
                this._notif.info('Se ha ingresado un valor incorrecto para los dias');
            }
        } catch (e) {
            this._notif.info('Se ha ingresado un valor incorrecto para los dias');
        }
    }
    private IniciarTarea(_task: any): void {
        this.ActualizarTarea(_task, 1);
    }
    private FinalizarTarea(_task: any): void {
        this.ActualizarTarea(_task, 0);
    }
    private ValidateItems(_array: Array<object>): Array<object> {
        let currentTask: boolean = false;
        let taskActve: boolean = false;
        let finalizado: boolean = true;
        this.institucion.currentArea = 'Sin Area';
        _array.forEach((item: any) => {
            item.currentTask = false;
            if ((item.idStatusEtapa === 0 || item.idStatusEtapa === 1) && !currentTask) {
                this.institucion.currentArea = item.descArea;
                currentTask = true;
                item.currentTask = true;
            }
            if (item.idStatusEtapa === 0 && !taskActve) {
                taskActve = true;
                finalizado = false;
                item.iniciar = true;
                item.finalizar = false;
            } else if (item.idStatusEtapa === 1 && !taskActve) {
                taskActve = true;
                finalizado = false;
                item.iniciar = false;
                item.finalizar = true;
            } else if (item.idStatusEtapa === 2) {
                item.iniciar = false;
                item.finalizar = false;
            }
            if(item.diasRetraso > 0){
                item.currentTask = false;
            }
        });
        if (finalizado) {
            this.institucion.currentArea = 'Finalizado';
        }
        return _array;
    }
    /* regresar al menu anterior*/
    public Regresar(): void {
        this.router.navigate(["./reportes/monitoreo/seguimiento"]);
    }
}
