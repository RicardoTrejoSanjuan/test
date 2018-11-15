import { Document } from './../models/document';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterMenuDoc', pure: false
})
export class FilterPipe implements PipeTransform {
    transform(listDocuments: Document[]) {
        return listDocuments.filter((doc: Document) => doc.idDocument !== 'menu');
    }
}