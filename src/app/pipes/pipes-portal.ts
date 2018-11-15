/*
 * @version 1.0 (05-07-2017)
 * @author lfgonzalezr
 * @description Pipes para la mesa de control
 * @contributors Front-end team
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fechas' })

export class FechasPipe implements PipeTransform {
    transform(_fecha: String, _type?: String): String {
        if (_type === undefined) {
            let newDate: String = _fecha.split(' ').shift();
            return newDate;
        }
    }
}

@Pipe({ name: 'monedaMX' })
export class MonedaMX implements PipeTransform {
    transform(_value: string) {
        if (_value !== null && _value !== '' && typeof _value !== 'undefined') {
            for (let item of _value) {
                console.log(item);
            }
        }
        return null;
    }
}

@Pipe({
    name: 'filterTable',
    pure: false
})
export class FilterTable implements PipeTransform {
    transform(registros: any, filter: any): any {
        let newArrayReg: any[] = [];
        registros.filter((item: any) => {
            if (this.aplyFilter(item, filter)) {
                newArrayReg.push(item);
            }
        });
        return newArrayReg;
    }
    private aplyFilter(_item: any, _str: string): boolean {
        for (let i in _item) {
            if (_item.hasOwnProperty(i)) {
                let strItem: string = _item[i];
                if (!this.invalid(strItem)) {
                    strItem = strItem.toString();
                    strItem = strItem.toLowerCase();
                    _str = _str.toString().toLowerCase();
                    let regexp: any = new RegExp(_str,"gi");
                    if(strItem.match(regexp) !== null){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    //Validacion de elementos
    private invalid(_item: any): boolean {
        if (_item === null || typeof (_item) === 'undefined' || _item === "" || _item === 'null') { return true; }
        return false;
    }
}
