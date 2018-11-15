import { ClassGenerica } from '../classGeneric/config';
import * as _ from 'underscore';

export class Pagination extends ClassGenerica {
    protected objectArrayPaginate: any[];
    private objectArrayPaginatePeticion: any[] = [];

    constructor() {
        super();
    }


    protected getPager(totalItems: number, currentPage: number = 1, rango: number = 1, pageSize: number = 10): any {
        // Calcular el total de páginas
        let totalPages = Math.ceil(totalItems / pageSize);

        let startPage: number, endPage: number;
        if (totalPages <= 10) {
            // Menos de 10 páginas por lo que se mustran todas
            startPage = 1;
            endPage = totalPages;
        } else {
            // Más de 10 páginas totales para calcular las páginas de inicio y final
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
        let pages = _.range(startPage, endPage + 1);
        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages,
            rango: rango,
            total: totalItems
        };
    }


    protected addItemToArray(pager, data, range, total): void {
        let currentPage = pager.currentPage;
        let ObjectAll = data;
        if (currentPage !== 1) {
            let countPageArray = _.where(this.objectArrayPaginate, { page: currentPage });
            if (countPageArray.length === 0) {

                let validLLenadoToArray = _.where(this.objectArrayPaginatePeticion, { rowPage: currentPage });
                let arrayLLenado = _.where(this.objectArrayPaginatePeticion, { numPeticion: validLLenadoToArray[0].numPeticion });
                currentPage = arrayLLenado[0].rowPage;
                let iterarObjectArray = this.iterarObject(ObjectAll, currentPage);
                let res = iterarObjectArray.ObjectAll;
                let pagesArray = iterarObjectArray.pageArray;
                for (let x in pagesArray) {
                    if (pagesArray.hasOwnProperty(x)) {
                        let countPageArrayItem = _.where(this.objectArrayPaginate, { page: pagesArray[x] });
                        if (countPageArrayItem.length === 0) {
                            let allPageArrayItem = _.where(res, { page: pagesArray[x] });
                            for (let x in allPageArrayItem) {
                                if (allPageArrayItem.hasOwnProperty(x)) {
                                    this.objectArrayPaginate.push(allPageArrayItem[x]);
                                }
                            }
                        }
                    }
                }
            }
        } else {
            let dataPaginate = this.objectArrayPaginatePeticion;
            if (dataPaginate.length === 0) {
                let peticionServer = Math.ceil(total / range);
                this.iterarObjectToArrayPeticionFunction(pager.totalPages, peticionServer, range);
            }
            let res = this.iterarObject(ObjectAll, currentPage);
            this.objectArrayPaginate = res.ObjectAll;
        }
    }


    private iterarObject(ObjectAll, page): any {
        let currentPage = page;
        let countPage = 0;
        let ArrayPaginatePages = [];
        for (let x in ObjectAll) {
            if (ObjectAll.hasOwnProperty(x)) {
                countPage = countPage + 1;
                ArrayPaginatePages.push(currentPage);
                ObjectAll[x].page = currentPage;
                if (countPage === 10) {
                    countPage = 0;
                    currentPage = currentPage + 1;
                }
            }
        }
        return {
            ObjectAll: ObjectAll,
            pageArray: _.unique(ArrayPaginatePages),
        };
    }


    private iterarObjectToArrayPeticionFunction(totalPages, peticion, range): any {
        let rangePage = Math.ceil(range / 10);
        let indexPage = 0;
        let numPeticiones = 1;
        for (let i = 1; i <= totalPages; i++) {
            indexPage = indexPage + 1;
            this.objectArrayPaginatePeticion.push({ numPeticion: numPeticiones, rowPage: i });
            if (indexPage === rangePage) {
                indexPage = 0;
                numPeticiones = numPeticiones + 1;
            }
        }
        return this.objectArrayPaginatePeticion;
    }


    protected pageToVisited(page): any {
        let peticionPaginate = _.where(this.objectArrayPaginatePeticion, { rowPage: page });
        if (peticionPaginate.length === 0) {
            return 1;
        } else {
            return peticionPaginate[0].numPeticion;
        }

    }

    protected resetPaginator(): void {
        this.objectArrayPaginate = [];
        this.objectArrayPaginatePeticion = [];
    }

}
