/*
 * @version 1.0 (18/10/2018)
 * @author rtrejo
 * @description Muestra los Tabs disponibles al usuario;
 * @contributors Front-end team
 */
import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CatalogosMC } from './../../constants/constants-mesa-control';
import { Employee } from '../../models/employee';

@Component({
    selector: 'genericTable',
    templateUrl: 'generic-table.component.html',
    styleUrls: ['../../../mesa-control2.component.css']
})
export class GenericTable {

    @Input() _records: any;
    @Input() _idTab: number;
    @Output() getAvailableParent = new EventEmitter();

    public columns: any;
    public fields: any;
    
    constructor(private catalogos: CatalogosMC) {}

    ngOnInit(): void {
        this.columns = this._records.column
        this.fields = this._records.fields
    }    

    ngOnChanges(changes: SimpleChanges) {
        this.columns = this._records.column
        this.fields = this._records.fields
    }

    // Obtener color de iconos
    private catColores(_idBloq: Number): String {
        return this.catalogos.getColorExpediente(this._idTab, _idBloq);
    }

    // Obtener expediente del cliente
    private getAvailable(event, _employee: Employee): void {
        this.getAvailableParent.emit(_employee);
    }
}