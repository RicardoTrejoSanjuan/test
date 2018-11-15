import {Component, Input} from '@angular/core';
import {Permisos} from './permisos.component';
import {ArbolComponent} from './arbol.component';
@Component({
    selector: 'tree-view',
     styleUrls: ['template/arbol.css'],
    template:   `<div class="contenedor-arbol">
                <ul class="row col-xs-12">
                    <li *ngFor="let per of permisos" class="row col-xs-12">
                        <span><input type="checkbox" [checked]="per.chk"  (click)="per.check()"  /></span>
                        <span *ngIf="per.expanded" class="icon-folder-open-o" style="font-size:20px"> </span> 
                        <span *ngIf="!per.expanded && per.child!=null" class="icon-folder-o" style="font-size:20px"> </span>
                        <span *ngIf="per.child==null" class="icon-link2" style="font-size:20px"></span>
                        <span (click)="per.toggle()"><label> &nbsp;&nbsp;{{ per.textoMenu }}</label></span>
                        <tree-view *ngIf="per.expanded" [permisos]="per.child" class="row col-xs-12" ></tree-view>
                            
                    </li>
                </ul> </div>`
})
export class TreeView{
    @Input() permisos: Array<Permisos>;
}