import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'searchfilter'
})

@Injectable()
export class SearchFilterPipe implements PipeTransform {
    
    transform(items: any[], field: string, value: string): any[] {
        if (!items){ return [];}
        var resultado=items.filter(it => it[field] === value);
        console.log(resultado.find(it => it.field === value));
        return resultado.find(it => it.field === value);
    }
}