/*
 * @version 1.0 (07-06-2017)
 * @author lfgonzalezr
 * @description visor de documentos de mesa de control
 * @contributors Front-end team
 */
import { Component, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DraggableDirective } from './draggable.directive';
import { Storage, Pages } from './storage';
import { Transform } from './draggable.directive';

import { B64_DOC_NOT_FOUND } from '../constants-url';

@Component({
    selector: 'visor-documentos',
    templateUrl: 'visor-documentos.component.html',
    styleUrls: ['visor-documentos.component.css']
})

export class VisorDocumentos {

    //Variable para ligar evento click a un evento fuera del componente
    @Output() GetImageBase64 = new EventEmitter();
    @Output() DownloadDocument = new EventEmitter();
    @ViewChild(DraggableDirective) documentoDraggable: DraggableDirective;
    private data: any;
    private config: Object;
    private pageDocument: any;
    private loading: boolean = true;
    private disabled: boolean = false;

    @Input() showViewer: boolean;

    constructor(private domSanitizer: DomSanitizer, private localStorage: Storage) {
        this.pageDocument = "";
        this.config = {
            downloable: false,
            controlllers: true
        };
        this.data = {
            idDocumento: null,
            rutasHttp: null,
            pagina: 0,
            total: 0,
            chrts: null
        };
    }

    public show () {
        this.showViewer = true;
    }
    public hide () {
        this.showViewer = false;
    }

    public reset(): void {
        this.localStorage.reset();
    }
    public setDisabled(): void {
        this.loading = false;
        this.disabled = true;
        this.pageDocument = this.domSanitizer.bypassSecurityTrustUrl("data:image/svg+xml;utf8;base64," + B64_DOC_NOT_FOUND);
    }
    //Configuracion de los controles visibles del visor
    public setConfig(_configuration: any): void {
        let _config: any = this.config;
        _config.downloable = this.invalid(_configuration.downloable) ? false : _configuration.downloable;
        _config.controlllers = this.invalid(_configuration.controlllers) ? true : _configuration.controlllers;
        this.config = _config;
    }
    //Carga inicial del visor de documentos
    public initVisor(_data: any): void {
        let paginas: any = this.localStorage.validateNumberPage(_data.idDocumento);
        let dataVisor: any = this.data;
        dataVisor.idDocumento = _data.idDocumento;
        dataVisor.total = _data.rutasHttp.length;
        dataVisor.rutasHttp = _data.rutasHttp;
        dataVisor.pagina = paginas.contenido;
        dataVisor.chrts = String(_data.rutasHttp.length).length;

        let validatePage: any = this.localStorage.getPage(dataVisor.idDocumento, dataVisor.pagina);
        this.disabled = false;
        if (validatePage.status) {
            this.loading = true;
            let url: any = dataVisor.rutasHttp[dataVisor.pagina - 1];
            this.GetImageBase64.emit({ url: url, idDocumento: this.data.idDocumento, page: 1 });
        } else {
            this.loading = false;
            this.pageDocument = this.domSanitizer.bypassSecurityTrustUrl("data:image/png;base64," + validatePage.contenido);
            setTimeout(() => {
                this.documentoDraggable.updateTranform(this.localStorage.getTransformation(dataVisor.idDocumento, dataVisor.pagina));
            }, 100);
        }
    }
    //Actualizacion de la imagen visible del visor
    public updateImage(_image: any, _idDocumento?: any, _page?: any): void {
        this.loading = false;
        this.pageDocument = this.domSanitizer.bypassSecurityTrustUrl("data:image/png;base64," + _image);
        if (!this.invalid(_idDocumento) && !this.invalid(_page)) {
            this.localStorage.setPage(new Pages(_idDocumento, _page, _image));
        } else {
            setTimeout(() => {
                this.documentoDraggable.updateTranform(this.localStorage.getTransformation(_idDocumento, _page));
            }, 0);
        }
    }

    private Rotate() {
        let transform: Transform = new Transform(1, 0);
        transform = this.documentoDraggable.rotate();
        this.localStorage.setTransformation(this.data.idDocumento, this.data.pagina, transform);
    }

    private Zoom(_type: any): void {
        if (_type === '+') {
            this.documentoDraggable.zoomImage(0.05);
        } else {
            this.documentoDraggable.zoomImage(-0.05);
        }
    }

    private Events(_event: any): void {
        let _data: any = this.data;
        _data.pagina = this.invalid(_data.pagina) ? 1 : _data.pagina;
        switch (_event) {
            case 'first':
                _data.pagina = 1;
                break;
            case 'previous':
                _data.pagina = _data.pagina - 1 < 1 ? 1 : _data.pagina - 1;
                break;
            case 'next':
                _data.pagina = _data.pagina + 1 < _data.total ? _data.pagina + 1 : _data.total;
                break;
            case 'last':
                _data.pagina = _data.total;
                break;
            case 'input':
                if (_data.pagina > _data.total) {
                    _data.pagina = _data.total;
                } else if (_data.pagina < 1) {
                    _data.pagina = 1;
                }
                break;
        }
        this.localStorage.updatePageVisited(_data.idDocumento, _data.pagina);
        let validatePage: any = this.localStorage.getPage(_data.idDocumento, _data.pagina);
        if (validatePage.status) {
            let url: any = _data.rutasHttp[_data.pagina - 1];
            this.loading = true;
            this.GetImageBase64.emit({ url: url, idDocumento: this.data.idDocumento, page: _data.pagina });
        } else {
            this.loading = false;
            this.pageDocument = this.domSanitizer.bypassSecurityTrustUrl("data:image/png;base64," + validatePage.contenido);
            this.documentoDraggable.updateTranform(this.localStorage.getTransformation(_data.idDocumento, _data.pagina));
        }
    }

    private Download(): void {
        this.DownloadDocument.emit({ idDocumento: this.data.idDocumento });
    }

    private invalid(_item: any): boolean {
        if (_item === null || typeof (_item) === 'undefined' || _item === "") {
            return true;
        }
        return false;
    }
}
