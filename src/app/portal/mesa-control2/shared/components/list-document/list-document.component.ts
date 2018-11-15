
/*
 * @version 1.0 (23-10-2018)
 * @author rtrejo
 * @description Componente utilizado para mostrar la lista de dosumentos faltantes o inexistentes
 * @contributors Front-end team
 */
import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CatalogosMC } from './../../constants/constants-mesa-control';
import { Document } from './../../models/document';

@Component({
    selector: 'list-document-mc',
    templateUrl: 'list-document.component.html',
    styleUrls: ['../../../mesa-control2.component.css']
})

export class ListDocument {

    @Input() _currentlyDocument: Document;
    @Input() _listDocuments: Document[];
    @Output() setCurrentlyDocument = new EventEmitter();

    public initialized = false;

    constructor(private catalogos?: CatalogosMC) {
    }

    ngOnInit(): void {
        this.initialized = true;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.initialized) {
            this.changeDocument(this._currentlyDocument);
        }
    }

    // hace el cambio del documento actual
    private changeDocument(_document: Document): any {
        let oldRubro: Document = this.getActive();
        if (oldRubro.idDocument != _document.idDocument) {
            this.updateStatus(_document.idDocument);
            this.setCurrentlyDocument.emit(_document);
        }
    }

    //Recupera documento actualmente visualizado
    public getActive(): any {
        return this._listDocuments.find(doc => doc.active == true);
    }

    // Actualiza la clase del rubro
    private updateStatus(id: string): void {
        this._listDocuments.map(document => {
            if (document.idDocument == id) {
                document.active = true;
                document.claseFondo = document.claseFondo + "-active";
            } else {
                document.active = false
                if (document.claseFondo.indexOf("-active") != -1) {
                    document.claseFondo = document.claseFondo.replace("-active", "");
                }
            }
        });
    }
}