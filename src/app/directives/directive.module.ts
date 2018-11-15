import { NgModule } from '@angular/core';
import { OnlyAlfanumerico } from './only-alfanumerico.directive';
import { OnlyNumber } from './only-numbers.directive';

@NgModule({
    imports: [],
    declarations: [
        OnlyAlfanumerico,
        OnlyNumber
    ],
    exports: [
        OnlyAlfanumerico,
        OnlyNumber
    ]
})
export class DirectivesModule { }
