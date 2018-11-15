import { Injectable } from '@angular/core';
import { ClassGenerica } from '../classGeneric/config';
import json2csv from 'json2csv';

@Injectable()
export class JsonToCsv {



  public generateToExcel(object: Array<Object>, name?: string): void {
    let nameFile: string;
    if (name !== undefined) {
      nameFile = name + '.csv';
    } else {
      nameFile = 'PortalBig.csv';
    }
    let columnas: string[] = [];
    for (var key in object[0]) {
      if (object[0].hasOwnProperty(key)) {
        columnas.push(key);
      }
    }
    this.Json2csv(object, columnas, nameFile);
  }


  private Json2csv(data, fieldNames, nameFile): any {
    try {
      let result = json2csv({ data: data, fields: fieldNames });



      this.downloadFileCsv(result, nameFile);
    } catch (err) {
      // Errors are thrown for bad options, or if the data is empty and no fields are provided.
      // Be sure to provide fields if it is  possible that your data array will be empty.
      console.log(err);


    }
  }

  public generateToExcelG(object: Array<Object>, name?: string): void {
    let nameFile: string;
    if (name !== undefined) {
      nameFile = name + '.csv';
    } else {
      nameFile = 'PortalBig.csv';
    }
    let columnas: string[] = [];
    const fields = ['fechaOperacion', 'nomCteRazonSocial', 'numCuentaConc', 'idContrato', 'idRef1', 'idRef2', 'idRef3', 'idRef4', 'moneda', 'importe', 'comEmi', 'ivaComEmi', 'comDep', 'ivaComDep', 'descCanal', 'trackingNum', 'numCuentaCom', 'codTxAlnova', 'msjTxAlnova', 'codRevAlnova', 'msjRevAlnova'];
    for (var key in object[0]) {
      if (object[0].hasOwnProperty(key)) {
        columnas.push(key);
      }
    }
    this.Json2csvG(object, columnas, nameFile, fields);
  }


  private Json2csvG(data, fieldNames, nameFile, fields): any {
    try {
      let result = json2csv({ data: data, fields: fields });

      console.log('Cambio en la libreria');

      console.log(result);


      this.downloadFileCsv(result, nameFile);
    } catch (err) {
      // Errors are thrown for bad options, or if the data is empty and no fields are provided.
      // Be sure to provide fields if it is  possible that your data array will be empty.
      console.log(err);


    }
  }










  private downloadFileCsv(data, nameFile): any {
    let blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }

    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", nameFile);
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);

  }
}



