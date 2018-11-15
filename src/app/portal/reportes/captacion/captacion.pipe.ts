import { Pipe } from '@angular/core';

@Pipe({
  name: "PorcentajeSolicitudes"
})
export class PorcentajeSolicitudesPipe {
  transform(valor: any, total: any): string {    
    return (valor !== null && valor !== undefined) ? (((valor * 100) / total).toFixed(2)) + "%" : "0%";
  }


  
}