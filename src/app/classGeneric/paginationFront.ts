import {Injectable} from '@angular/core';
import { ClassGenerica } from '../classGeneric/config';
import * as _ from 'underscore';

@Injectable()
export class PaginationFron{
    public arrayPaginate: any;


    public getPager(totalItems: number, currentPage: number = 1, rango: number = 1, pageSize: number = 10): any {
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

    public getPagerdata(object,page: number = 1):Array<Object>{
        let validObject = object;
        let validObject2 = JSON.parse(JSON.stringify(validObject));
        let array:any;
        if(validObject2.length !== 0){
            let cont = 0;
            let indexArray = 1;
            for(let item in object){
                if(object.hasOwnProperty(item)){
                    object[item].paginate = indexArray;
                    cont = cont + 1;
                    if(cont === 10){
                        cont = 0;
                        indexArray = indexArray + 1;
                    }
                }
            }
            this.arrayPaginate = object;
            return _.where(object, { paginate:  page});
        }else{
            return _.where(this.arrayPaginate, { paginate:  page});
        }
    }
}
