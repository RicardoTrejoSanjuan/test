import { NgModule } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { Ng2Tables } from './ng2-tables.component';
import { CommonModule } from '@angular/common';
@NgModule({
    imports: [/*BrowserModule*/CommonModule],
    declarations: [Ng2Tables,],
    providers: [],
    exports: [Ng2Tables]
})
export class Ng2TablesModule { }
