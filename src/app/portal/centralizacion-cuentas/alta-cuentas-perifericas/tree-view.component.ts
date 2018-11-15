import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Cuentas} from './cuentas.component';
import {AltaCuentasPerifericasComponent} from './alta-cuentas-perifericas.component';
import { DragulaService } from 'ng2-dragula';
import { DragulaModule } from 'ng2-dragula';
@Component({
    selector: 'tree-view',
    styleUrls: ['./arbol.css'],
    template:   `<div class="contenedor-arbol"> 
                <ul class="row col-xs-12" >
                    <li *ngFor="let per of cuentas" class="row col-xs-12" >
                        <span (click)="per.toggle()" *ngIf="per.expanded" class="icon-address-card" style="font-size:26px; color: #17177d "> </span> 
                        <span><input type="checkbox" [checked]="per.chk"  (click)="per.check()"  /></span>
                        <span (click)="per.toggle()" *ngIf="!per.expanded && per.child!=null" class="icon-address-card" style="font-size:20px"> </span>
                        <span (click)="per.toggle()" *ngIf="per.child === null && per.idEstaus != null"  style="font-size: 23px;" [style.color] = "per.idEstaus === 0 ? 'red' : 'green'" class="icon-credit-card"></span>
                        <span ><label (click)="getItem(per)" style="cursor: pointer;"> &nbsp;&nbsp;{{ per.numCuenta }}</label></span>
                        <div *ngIf="arrastrando && per.expanded"  class="col-xs-12" id="{{per.numCuenta}}" [dragula]='"another-bag"' [dragulaModel]='pagedItems' onmouseover="this.style.background='#10a0a045';"   onmouseout="this.style.background='white';" 
                        style=" height: 17px; border: outset;border-width: 0px 0px 1px 1px;"></div>
                        <tree-view *ngIf="per.expanded" [arrastrando]="arrastrando" [cuentas]="per.child" class="row col-xs-12"  (seleccion)=getItem($event)></tree-view>
                    </li>
                </ul> </div>`
})
export class TreeView{
    @Input() arrastrando: boolean;
    @Input() cuentas: Array<Cuentas>;
    @Output() seleccion: EventEmitter<any> = new EventEmitter();
    
    constructor(){
    }

    getItem(item){
        this.seleccion.emit(item);
    }
}