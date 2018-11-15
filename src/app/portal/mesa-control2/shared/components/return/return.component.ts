import { Component, Input, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'return',
    template: `
    <ng-template [ngIf]="value" [ngIfElse]="return">
        <div class="cont-boton-regresar" [ngClass]="{'regresar-menu': classActive === false}">
            <div class="boton-regresar" (click)="returnEvent()">
                <img src="{{load_static}}/images/header/back.png" alt="regresar">
                Regresar
            </div>
        </div>
    </ng-template>

    <ng-template #return>
        <div class="contenedor-btn-regresar">
            <div class="btn-regresar">
                <div class="regresar" (click)="returnEvent()">
                    <img src="{{load_static}}/images/header/back.png" alt="regresar">
                    Regresar
                </div>
            </div>
        </div>
    </ng-template>`,
    styles: [require('../../../../css-menu/menu.component.css'), require('../../../mesa-control2.component.css')]
})
export class Return {
    @Input() value: boolean;
    @Input() classActive: boolean;
    @Input() model: NgModel;

    constructor(private router: Router) { }

    ngOnInit(): void { }

    public returnEvent() {
        this.router.navigate([this.model]);
    }
}