import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GraficaComponent } from './graficas-highchart.component';
import { RouterModule} from '@angular/router';

/* Importacion de highcharts */
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';

declare var require: any;

export function highchartsFactory() {
    const hc = require('highcharts');
    const dd = require('highcharts/modules/drilldown');
    dd(hc);

    return hc;
}


@NgModule({
    imports: [
        BrowserModule,
        ChartModule,
        RouterModule
    ],
    declarations: [
        GraficaComponent
    ],
    providers: [
        {
            provide: HighchartsStatic,
            useFactory: highchartsFactory
        }
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: [GraficaComponent]
})
export class GraficaModule { }
