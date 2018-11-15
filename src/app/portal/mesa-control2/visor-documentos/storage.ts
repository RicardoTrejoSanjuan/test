import { Injectable } from '@angular/core';

@Injectable()

export class Storage {
    private Storage: Pages[] = [];
    private PagesDocumentos: PageDocument[] = [];
    private Transformations: Transformation[] = [];

    public setPage(_page: Pages) {
        this.Storage.push(_page);
    }
    public getPage(_idDocumento: number, _page: number): ValidatePage {
        let page: ValidatePage = new ValidatePage(true, null);
        this.Storage.filter((item: any) => {
            if (_idDocumento === item.idDocumento && _page === item.page) {
                let newPage: ValidatePage = new ValidatePage(false, item.contenido);
                page = newPage;
            }
        });
        return page;
    }
    public validateNumberPage(_idDocumento: number): ValidatePage {
        let page: any = new ValidatePage(true, 1);
        this.PagesDocumentos.filter((item: any) => {
            if (item.idDocumento === _idDocumento) {
                page = new ValidatePage(false, item.page);
            }
        });
        if (page.status) {
            this.PagesDocumentos.push(new PageDocument(_idDocumento, 1));
        }
        return page;
    }

    public updatePageVisited(_idDocumento: number, _page: number): void {
        this.PagesDocumentos.filter((item: any) => {
            if (_idDocumento === item.idDocumento) {
                item.page = _page;
            }
        });
    }
    public setTransformation(_idDocumento: number, _page: number, transform: any): void {
        let existe: boolean = false;
        this.Transformations.filter((item: any) => {
            if (item.idDocumento === _idDocumento && item.page === _page) {
                existe = true;
                item.escale = transform.escale;
                item.grades = transform.grades;
            }
        });
        if (!existe) {
            this.Transformations.push(new Transformation(_idDocumento, _page, transform.escale, transform.grades));
        }
    }

    public getTransformation(_idDocumento: number, _page: number): any {
        let newTransformation: any = new Transformation(_idDocumento, _page, 1, 0);
        this.Transformations.filter((item: any) => {
            if (_idDocumento === item.idDocumento && _page === item.page) {
                newTransformation.grades = item.grades;
                newTransformation.escale = item.escale;
            }
        });
        return newTransformation;
    }

    public reset(): void {
        this.Storage = [];
        this.PagesDocumentos = [];
        this.Transformations = [];
    }
}


/* CLASES PARA CONTROL DE VISOR */
export class Pages {
    constructor(private idDocumento, private page, private contenido) { }
}

export class ValidatePage {
    constructor(private status: boolean, private contenido: any) { }
}

export class PageDocument {
    constructor(private idDocumento: number, private page: number) { }
}

export class Transformation {
    constructor(private idDocumento: number, private page: number, private escale: number, private grades: number) { }
}
