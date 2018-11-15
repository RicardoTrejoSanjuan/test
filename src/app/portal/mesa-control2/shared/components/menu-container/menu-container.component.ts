import { Menu } from './../../models/menu';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'menu-container',
    template: `
        <div class="contenedor-menu fondo-contenedores"> 
            <div class="menu-opcion" *ngFor="let menu of list" [routerLink]="[menu.url]">
                <div class="icono-span {{menu.color}}">
                    <span class="{{menu.imagen}}"></span>
                </div>
                <div class="informacion {{menu.claseFondo}}">
                    <h3 class="titulo-menu">{{menu.textoMenu}}</h3>
                    <div class="progress-bar">
                        <div class="{{menu.claseIcono}}"></div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['../../../../css-menu/menu.component.css'],
    

})
export class MenuContainer {
    @Input() list: Array<Menu>;
    
    constructor(private router: Router) { }

}