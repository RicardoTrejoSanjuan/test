import { NgModule } from '@angular/core';
//Importacion de modulo para manejo de forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { VisorDocumentos } from './visor-documentos.component';
import { DraggableDirective } from './draggable.directive';
import { OnlyNumber } from './only-number.directive';
import { Storage } from './storage';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        VisorDocumentos,
        DraggableDirective,
        OnlyNumber
    ],
    providers: [Storage],
    exports: [VisorDocumentos]
})
export class VisorDocumentosModule { }
