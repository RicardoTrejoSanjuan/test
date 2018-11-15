/*
 * @version 1.0 (07-06-2017)
 * @author lfgonzalezr
 * @description Componente para la generacion de graficas .Version 0.0.1
 * @contributors Front-end team
 */
/* IMPORTACION GENERAL */
import { Component, Input, Output, EventEmitter } from '@angular/core';

/* Importacion de la paleta de colores */
import { GRAFICAS } from '../constants/graficas';
/* Importacion de las interface para las variables de configiuración de las graficas */
import { ConfGraficaColumn } from '../interfaces/interfacesGraficas';
import { ConfGraficaPie } from '../interfaces/interfacesGraficas';
import { ConfGraficaBar } from '../interfaces/interfacesGraficas';
import { ConfGraficaPercent } from '../interfaces/interfacesGraficas';
import { ConfGraficaLine } from '../interfaces/interfacesGraficas';
import { ConfGraficaDoubleLine } from '../interfaces/interfacesGraficas';
import { ConfStockColumn } from '../interfaces/interfacesGraficas';
import { ConfGraficaBasicArea } from '../interfaces/interfacesGraficas';

@Component({
    selector: 'grafica-highchart',
    template: `
        <chart
            [options]="options"
            (click)="seleccion($event)"
            (load)="initScroll($event)"
            ></chart>
        `,
    styles: [`chart {
        display: block;
        width: 100%;
        margin: 0px auto;
        height: 100%;
    }`]
})

export class GraficaComponent {
    //Variable para ligar evento click a un evento fuera del componente
    @Output() eventClick = new EventEmitter();
    //Objeto con la informacion que mostrara la grafica
    options: Object;
    //Paleta de colores
    paletaColores: string[];
    //Driildown para eventos
    drilldown: boolean;

    constructor() {
        this.paletaColores = GRAFICAS.PALETA_COLORES;
        this.drilldown = false;
    }

    //Función para validar y cargar la grafica
    public CargarGrafica(data: any, conf: any): void {
        let op: string = conf.type;
        this.drilldown = conf.drilldown;
        if (op === 'pie') {
            this.GraficaCircular(data, conf);
        } else if (op === 'column') {
            this.GraficaColumna(data, conf);
        } else if (op === 'bar') {
            this.GraficaBarras(data, conf);
        } else if (op === 'percent') {
            this.GraficaWithPorcentaje(data, conf);
        } else if (op === 'line') {
            this.GraficaLine(data, conf);
        } else if (op === 'highstock') {
            if (conf.subType === 'column') {
                this.GraficaHighStockColumn(data, conf);
            } else if (conf.subType === 'line') {
                this.GraficaHighStockLine(data, conf);
            } else if (conf.subType === 'simple') {
                this.GraficaHighStockColumnSimple(data, conf);
            }
        } else if (op === 'doubleLine') {
            this.GraficaDoubleLine(data, conf);
        } else if(op === 'basicArea') {
            this.GraficaBasicArea(data, conf);
        } else {
            console.log('No se reconoce el tipo de grafica');
        }
    }
    //Funcion para capturar evento click sobre la grafica
    public seleccion(elemento) {
        if (this.drilldown) {
            this.eventClick.emit(elemento.point);
        } else {
            console.log('Última grafica');
        }
    }

    public initScroll(elemento) {
        if(elemento.context.scrollbar) {
            elemento.context.xAxis[0].setExtremes(0, 7);
        }
    }

    //Carga grafica de pastel-Circular
    private GraficaCircular(_data: any, _conf: ConfGraficaPie): void {
        this.options = {
            chart: {
                //tipo de grafica
                type: _conf.type
            },
            // Titulo de la grafica
            title: { text: _conf.title },
            //subtitulo de las graficas
            subtitle: { text: _conf.subtitle },
            //Deshabilitamos los credito de highcharts
            credits: { enabled: false },
            //Definicion de los colores que seran usados en todas las graficas-high
            colors: this.paletaColores,
            //Tabla lateral de los contenidos de las tablas
            legend: { enabled: _conf.showLegends },
            //Configuracion del tooltip de las graficas
            tooltip: {
                enabled: _conf.tooltip,
                shared: false,
                useHTML: _conf.tooltip,
                /*headerFormat: '<small>{point.key}</small>',*/
                /*pointFormat: '<td> ' +
                '<div style="background-color: {point.color}; width: 13px; height: 13px; border-radius: 50%;"></div>' +
                '</td>' +
                '<td style="text-align: right">' +
                '<b>{point.y}</b> de un total de <b>{point.total}</b>' +
                '</td>',
                footerFormat: '</table>',
                valueDecimals: 0*/
                formatter: function () {

                    let separado: any[]=[];

                    var number1 = this.y+'', result = '';

                    separado=number1.split(".");

                    if (separado[0].indexOf(',') === -1) {

                        while (separado[0].length > 3) {
                          result = ',' + '' + separado[0].substr(separado[0].length - 3) + '' + result;
                          separado[0] = separado[0].substring(0, separado[0].length - 3);
                        }

                        result = separado[0] + result;
                        separado[0]=result;
                        result = '';
                    }

                    if(separado.length>1){
                        result= separado[0]+"."+separado[1];
                    }else{
                        result= separado[0];
                    }

                    return '<small>' + this.key + '</small><br><table><td><div style="background-color: ' + this.color + '; width: 13px; height: 13px; border-radius: 50%;"></div></td><td>&nbsp;<b>' + result + '</b> de un total de <b>' + this.total + '</b></td></table>';
                }
            },
            //Información que se muestra de forma paralela a la grafica
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: { enabled: _conf.dataLabels }
                },
                pie: {
                    cursor: 'pointer',
                    showInLegend: true
                }
            },
            //Información que se mostrara en las graficas
            series: [{
                //Nombre de las categorias
                name: _conf.nameCategory,
                //Usa diferentes colores
                colorByPoint: true,
                //Data a mostrar
                data: _data
            }]
        };
    }

    //Carga grafica de barras vertical
    private GraficaColumna(_data: any, _conf: ConfGraficaColumn): void {

        this.options = {
            chart: {
                //tipo de grafica
                type: _conf.type
            },
            // Titulo de la grafica
            title: { text: _conf.title },
            //subtitulo de las graficas
            subtitle: { text: _conf.subtitle },
            //Deshabilitamos los credito de highcharts
            credits: { enabled: false },
            colors: this.paletaColores,
            xAxis: {
                categories: _conf.categories,
                title: { text: _conf.titleCategories }
            },
            yAxis: {
                min: 0,
                title: { text: _conf.titleVertical, align: 'middle' },
                labels: { overflow: 'justify' }
            },
            //tooltip: { valueSuffix: _conf.valueSuffix },
            //Configuracion del tooltip de las graficas
            tooltip: {
                enabled: _conf.tooltip,
                shared: false,
                useHTML: _conf.tooltip,
                /*headerFormat: '<table>',
                pointFormat: '<tr>' +
                '<td><b>{point.series.name}</b></td>' +
                '</tr>' +
                '<tr>' +
                '<td style="display: flex;"><div style="background-color: {point.color}; width: 13px; height: 13px; border-radius: 50%;"></div>&nbsp;' + _conf.formatLabel + '{point.y}</td>' +
                '</tr>',
                footerFormat: '</table>',
                valueDecimals: 0*/
                formatter: function () {

                    let separado: any[]=[];

                    var number1 = this.y+'', result = '';

                    separado=number1.split(".");

                    if (separado[0].indexOf(',') === -1) {

                        while (separado[0].length > 3) {
                          result = ',' + '' + separado[0].substr(separado[0].length - 3) + '' + result;
                          separado[0] = separado[0].substring(0, separado[0].length - 3);
                        }

                        result = separado[0] + result;
                        separado[0]=result;
                        result = '';
                    }

                    if(separado.length>1){
                        result= separado[0]+"."+separado[1];
                    }else{
                        result= separado[0];
                    }

                    return '<small>' + this.series.name + '</small><br><table><td><div style="background-color: ' + this.color + '; width: 13px; height: 13px; border-radius: 50%;"></div></td><td>&nbsp;' + _conf.formatLabel + '<b>' + result + '</b></td></table>';
                }
            },

            plotOptions: {
                bar: { dataLabels: { enabled: true } },
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        /*format: _conf.formatLabel + '{y}'*/
                        formatter: function () {

                            let separado: any[]=[];

                            var number1 = this.y+'', result = '';

                            separado=number1.split(".");

                            if (separado[0].indexOf(',') === -1) {

                                while (separado[0].length > 3) {
                                  result = ',' + '' + separado[0].substr(separado[0].length - 3) + '' + result;
                                  separado[0] = separado[0].substring(0, separado[0].length - 3);
                                }

                                result = separado[0] + result;
                                separado[0]=result;
                                result = '';
                            }

                            if(separado.length>1){
                                result= separado[0]+"."+separado[1];
                            }else{
                                result= separado[0];
                            }

                            return _conf.formatLabel +''+ result;
                        }
                    }
                },
            },
            legend: {
                enabled: _conf.showLegends
            },
            series: _data
        };
    }

    //Carga grafica de barras horizontal
    private GraficaBarras(_data: any, _conf: ConfGraficaBar): void {
        console.log('GraficaBarrasHorizontal', _conf, _data);

        this.options = {
            chart: {
                //tipo de grafica
                type: _conf.type,
                inverted: true
            },
            colors: this.paletaColores,
            // Titulo de la grafica
            title: { text: _conf.title },
            //subtitulo de las graficas
            subtitle: { text: _conf.subtitle },
            //Deshabilitamos los credito de highcharts
            credits: { enabled: false },
            //Definicion de los colores que seran usados en todas las graficas-high
            xAxis: {
                min: 0,
                max: 8,
                categories: _conf.categories,
                title: { text: _conf.titleCategories },
                scrollbar: { enabled: true },
                tickLength: 285,
                tickColor: "#FFF"
                
            },
            yAxis: {
                min: 0,
                title: { text: _conf.titleData, align: 'high' },
                labels: { overflow: 'justify' }
            },
            tooltip: {
                enabled: true,
                /*valueSuffix: _conf.valueSuffix*/
                formatter: function () {

                    let separado: any[]=[];

                    var number1 = this.y+'', result = '';

                    separado=number1.split(".");

                    if (separado[0].indexOf(',') === -1) {

                        while (separado[0].length > 3) {
                          result = ',' + '' + separado[0].substr(separado[0].length - 3) + '' + result;
                          separado[0] = separado[0].substring(0, separado[0].length - 3);
                        }

                        result = separado[0] + result;
                        separado[0]=result;
                        result = '';
                    }

                    if(separado.length>1){
                        result= separado[0]+"."+separado[1];
                    }else{
                        result= separado[0];
                    }

                    return '<small>' + this.x + '</small><br><table><td>' + this.series.name + ': <b>' + result + '</b>' + _conf.valueSuffix + '</td></table>';
                }
            },
            legend: { reversed: true },
            plotOptions: {
                series: {
                    getExtremesFromAll: true,
                    pointWidth: _conf.widthBar,
                    stacking: 'percent',
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        style: {
                            fontSize:"15px",
                            textShadow: 'none',
                            textOutline:"1.5px contrast",
                            color: "black"
                        },
                        formatter: function () {

                            let separado: any[]=[];

                            var number1 = this.y+'', result = '';

                            separado=number1.split(".");

                            if (separado[0].indexOf(',') === -1) {

                                while (separado[0].length > 3) {
                                  result = ',' + '' + separado[0].substr(separado[0].length - 3) + '' + result;
                                  separado[0] = separado[0].substring(0, separado[0].length - 3);
                                }

                                result = separado[0] + result;
                                separado[0]=result;
                                result = '';
                            }

                            if(separado.length>1){
                                result= separado[0]+"."+separado[1];
                            }else{
                                result= separado[0];
                            }

                            return result;
                        }
                    }
                }

            },
            series: _data
        };
    }

    private GraficaWithPorcentaje(_data: any, _conf: ConfGraficaPercent): void {
        console.log('Graficas porc: ', _data, _conf);
        let _type: string = _conf.horizontal ? 'bar' : 'column';
        let _plotOptions: object = _conf.horizontal ? { series: { stacking: 'normal', pointWidth: 50 } } : { column: { stacking: 'percent' } };
        this.options = {
            chart: { type: _type },
            //Titulo de la grafica
            title: { text: _conf.title },
            //Subtitulo de la grafica
            subtitle: { text: _conf.subtitle },
            //Deshabilitamos los credito de highcharts
            credits: { enabled: false },
            colors: this.paletaColores,
            xAxis: { categories: _conf.categories },
            yAxis: { min: 0, title: { text: _conf.titleCategories } },
            legend: { reversed: true },
            tooltip: {
                useHTML: !_conf.tooltipShared,
                headerFormat: '',
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                /*formatter: function () {

                    let separado: any[]=[];

                    var number1 = this.y+'', result = '';

                    separado=number1.split(".");

                    if (separado[0].indexOf(',') === -1) {

                        while (separado[0].length > 3) {
                          result = ',' + '' + separado[0].substr(separado[0].length - 3) + '' + result;
                          separado[0] = separado[0].substring(0, separado[0].length - 3);
                        }

                        result = separado[0] + result;
                        separado[0]=result;
                        result = '';
                    }

                    if(separado.length>1){
                        result= separado[0]+"."+separado[1];
                    }else{
                        result= separado[0];
                    }

                    return '<span style="color:' + this.series.color + '">' + this.series.name + '</span>: <b>' + result + '</b> ('+ this.percentage.toFixed() +'%)<br/>';
                },*/
                shared: _conf.tooltipShared
            },
            plotOptions: _plotOptions,
            series: _data
        };
       /* console.log(this);*/
    }

    private GraficaLine(_data: any, _conf: ConfGraficaLine): void {
        console.log('GRAFICA DE LINEAS ');
        this.options = {
            chart: { type: _conf.type },
            title: { text: _conf.title },
            subtitle: { text: _conf.subtitle },
            //Deshabilitamos los credito de highcharts
            credits: { enabled: false },
            yAxis: { title: { text: _conf.titleScale } },
            xAxis: { categories: _conf.categories, crosshair: true },
            tooltip: {
                /*pointFormat: '<b>$ {point.y}</b>'*/
                formatter: function () {

                    let separado: any[]=[];

                    var number1 = this.y+'', result = '';

                    separado=number1.split(".");

                    if (separado[0].indexOf(',') === -1) {

                        while (separado[0].length > 3) {
                          result = ',' + '' + separado[0].substr(separado[0].length - 3) + '' + result;
                          separado[0] = separado[0].substring(0, separado[0].length - 3);
                        }

                        result = separado[0] + result;
                        separado[0]=result;
                        result = '';
                    }

                    if(separado.length>1){
                        result= separado[0]+"."+separado[1];
                    }else{
                        result= separado[0];
                    }

                    return '<small>' + this.x + '</small><br><table><td> $<b>' + result + '</b></td></table>';
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true,
                        formatter: function () {

                            let separado: any[]=[];

                            var number1 = this.y+'', result = '';

                            separado=number1.split(".");

                            if (separado[0].indexOf(',') === -1) {

                                while (separado[0].length > 3) {
                                  result = ',' + '' + separado[0].substr(separado[0].length - 3) + '' + result;
                                  separado[0] = separado[0].substring(0, separado[0].length - 3);
                                }

                                result = separado[0] + result;
                                separado[0]=result;
                                result = '';
                            }

                            if(separado.length>1){
                                result= separado[0]+"."+separado[1];
                            }else{
                                result= separado[0];
                            }

                            return '$'+result;
                        }
                    },
                    enableMouseTracking: true
                }
            },
            legend: {
                enabled: _conf.showLegends,
                align: 'center',
                verticalAlign: 'bottom'
            },
            series: _data
        };
    }

    private GraficaHighStockColumn(_data: any, _conf: ConfStockColumn): void {
        this.options = {
            chart: {
                type: _conf.subType
            },
            title: { text: _conf.title },
            subtitle: { text: _conf.subtitle },
            //Deshabilitamos los credito de highcharts
            credits: { enabled: false },
            navigator: { enabled: _conf.navigator },
            scrollbar: { enabled: _conf.scrollbar },
            xAxis: {
                categories: _conf.categories,
                min: _conf.minCategories
            },
            yAxis: {
                allowDecimals: _conf.allowDecimals,
                min: _conf.minyAxis,
                title: { text: _conf.titleCategoriesVertical }
            },
            legend: {
                align: 'center',
                x: 0,
                verticalAlign: 'bottom',
                y: 0,
                floating: false,
                backgroundColor: 'white',
                borderColor: '#CCC',
                borderWidth: 0,
                shadow: false,
                reversed: true
            },
            tooltip: {
                formatter: function() {
                    return '<b>' + this.series.name + '</b><br>' +
                        '<b>' + this.y + '</b> de un total  de : <b>' + this.point.stackTotal + '</b>';
                }
            },
            plotOptions: {
                series: {
                    pointWidth: _conf.pointWidth,
                    pointPadding: 0,
                    groupPadding: 0,
                    borderWidth: 1,
                    shadow: false
                },
                column: {
                    stacking: 'normal'
                }
            },
            series: _data
        };
    }

    private GraficaHighStockColumnSimple(_data: any, _conf: ConfStockColumn): void {
        this.options = {
            chart: {
                type: 'column'
            },
            title: { text: _conf.title },
            subtitle: { text: _conf.subtitle },
            //Deshabilitamos los credito de highcharts
            credits: { enabled: false },
            colors: this.paletaColores,
            navigator: { enabled: _conf.navigator },
            scrollbar: { enabled: _conf.scrollbar },
            xAxis: {
                categories: _conf.categories,
                min: _conf.minCategories
            },
            yAxis: {
                allowDecimals: _conf.allowDecimals,
                min: _conf.minyAxis,
                title: { text: _conf.titleCategoriesVertical },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: 'gray'
                    },
                    formatter: function() {

                        let separado: any[]=[];

                        var number1 = this.total+'', result = '';

                        separado=number1.split(".");

                        if (separado[0].indexOf(',') === -1) {

                            while (separado[0].length > 3) {
                              result = ',' + '' + separado[0].substr(separado[0].length - 3) + '' + result;
                              separado[0] = separado[0].substring(0, separado[0].length - 3);
                            }

                            result = separado[0] + result;
                            separado[0]=result;
                            result = '';
                        }

                        if(separado.length>1){
                            result= separado[0]+"."+separado[1];
                        }else{
                            result= separado[0];
                        }

                        return result;
                    }
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                enabled: false,
                formatter: function() {
                    return '<b>' + this.series.name + '</b><br>' +
                        '<b>' + this.y + '</b> de un total  de : <b>' + this.point.stackTotal + '</b>';
                }
            },
            plotOptions: {
                series: {
                    color: this.paletaColores,
                    colorByPoint: true,
                    pointWidth: _conf.pointWidth,
                    pointPadding: 0,
                    groupPadding: 0,
                    borderWidth: 1,
                    shadow: false
                    /*dataLabels: {
                        enabled: false,
                        format: _conf.formatLabel + '{y}'
                    }*/
                },
                column: {
                    stacking: 'normal'
                }
            },
            series: _data
        };
    }

    private GraficaHighStockLine(_data: any, _conf: ConfStockColumn): void {
        console.log('GraficaHighStockLine -> ');
        this.options = {
            chart: { type: _conf.subType },
            title: { text: _conf.title },
            subtitle: { text: _conf.subtitle },
            //Deshabilitamos los credito de highcharts
            credits: { enabled: false },
            navigator: { enabled: _conf.navigator },
            scrollbar: { enabled: _conf.scrollbar },
            xAxis: {
                categories: _conf.categories,
                min: _conf.minCategories
            },
            yAxis: {
                allowDecimals: _conf.allowDecimals,
                min: _conf.minyAxis,
                title: { text: _conf.titleCategoriesVertical }
            },
            legend: {
                floating: false,
                backgroundColor: 'white',
                borderColor: '#CCC',
                shadow: false,
                x: 0,
                y: 0,
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                itemWidth: 150,
                borderWidth: 0,
                itemMarginTop: 5,
                itemMarginBottom: 5
            },
            tooltip: {
                useHTML: true,
                headerFormat: '',
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>'+ _conf.formatLabel +'{point.y}</b><br>',
                shared: true
            },
            plotOptions: {
                series: {
                    pointWidth: _conf.pointWidth,
                    pointPadding: 0,
                    groupPadding: 0,
                    borderWidth: 1,
                    shadow: false
                },
                column: {
                    stacking: 'normal'
                }
            },
            series: _data
        };
    }

    private GraficaDoubleLine(_data: any, _conf: ConfGraficaDoubleLine): void {

        this.options = {
            colors: this.paletaColores,
            chart: { type: 'line' },
            title: { text: _conf.title },
            subtitle: { text: _conf.subtitle },
            //Deshabilitamos los credito de highcharts
            credits: { enabled: false },
            xAxis: [{ categories: _conf.categories }],
            yAxis: [{ // Primary yAxis
                labels: {
                    formatter: function(){
                        var number1 = this.value.toString(), result = '';
                        let separado: any[] = [];
                        separado = number1.split(".");
                        if (separado[0].indexOf(',') === -1) {
                            while (separado[0].length > 3) {
                                result = ',' + '' + separado[0].substr(separado[0].length - 3) + '' + result;
                                separado[0] = separado[0].substring(0, separado[0].length - 3);
                            }
                            result = separado[0] + result;
                            separado[0] = result;
                            result = '';
                        }
                        if (separado.length > 1) {
                            result = separado[0] + "." + separado[1];
                        } else {
                            result = separado[0];
                        }
                        //var label = this.axis.defaultLabelFormatter.call(this);
                        return result + _conf.sufixFormatTwo;
                        },  
                    style: {
                        color: '#363537'
                    }
                },
                title: {
                    text: _conf.titleScaleOne,
                    style: {
                        color: '#363537'
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: _conf.titleScaleTwo,
                    style: {
                        color: '#363537'
                    }
                },
                labels: {
                    formatter: function(){
                        var number1 = this.value.toString(), result = '';
                        let separado: any[] = [];
                        separado = number1.split(".");
                        if (separado[0].indexOf(',') === -1) {
                            while (separado[0].length > 3) {
                                result = ',' + '' + separado[0].substr(separado[0].length - 3) + '' + result;
                                separado[0] = separado[0].substring(0, separado[0].length - 3);
                            }
                            result = separado[0] + result;
                            separado[0] = result;
                            result = '';
                        }
                        if (separado.length > 1) {
                            result = separado[0] + "." + separado[1];
                        } else {
                            result = separado[0];
                        }
                        //var label = this.axis.defaultLabelFormatter.call(this);
                        return result + _conf.sufixFormatOne;
                    },  
                    style: {
                        color: '#363537'
                    }
                },
                opposite: true
            }],

            tooltip: {
                shared: false
            },

            series: [{
                name: _conf.titleSerieOne,
                type: 'line',
                yAxis: 1,
                data: _data.dataSerieOne,
                tooltip: {
                    pointFormatter:function(){
                        var number1 = this.y.toString(), result = '';
                        let separado: any[] = [];
                        separado = number1.split(".");
                        if (separado[0].indexOf(',') === -1) {
                            while (separado[0].length > 3) {
                                result = ',' + '' + separado[0].substr(separado[0].length - 3) + '' + result;
                                separado[0] = separado[0].substring(0, separado[0].length - 3);
                            }
                            result = separado[0] + result;
                            separado[0] = result;
                            result = '';
                        }
                        if (separado.length > 1) {
                            result = separado[0] + "." + separado[1];
                        } else {
                            result = separado[0];
                        }
                        //var label = this.axis.defaultLabelFormatter.call(this);
                        return '<span style="font-weight: bold; color: {series.color}">'+this.series.name+'</span>: <b>'+result + _conf.sufixFormatOne + ' </b> ';
                    },  
                     //'<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f} ' + _conf.sufixFormatOne + ' </b> '
                }
            }, {
                name: _conf.titleSerieTwo,
                type: 'line',
                data: _data.dataSerieTwo,
                tooltip: {
                    pointFormatter:function(){
                        var number1 = this.y.toString(), result = '';
                        let separado: any[] = [];
                        separado = number1.split(".");
                        if (separado[0].indexOf(',') === -1) {
                            while (separado[0].length > 3) {
                                result = ',' + '' + separado[0].substr(separado[0].length - 3) + '' + result;
                                separado[0] = separado[0].substring(0, separado[0].length - 3);
                            }
                            result = separado[0] + result;
                            separado[0] = result;
                            result = '';
                        }
                        if (separado.length > 1) {
                            result = separado[0] + "." + separado[1];
                        } else {
                            result = separado[0];
                        }
                        //var label = this.axis.defaultLabelFormatter.call(this);
                        return '<span style="font-weight: bold; color: {series.color}">'+this.series.name+'</span>: <b>'+result + _conf.sufixFormatTwo + ' </b> ';
                    },  
                     //'<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f} ' + _conf.sufixFormatOne + ' </b> '
                }
            }]
        };
    }

    private GraficaBasicArea(_data: any, _conf: ConfGraficaBasicArea): void {

        this.options = {
            chart: {
                type: 'area'
            },
            title: {
                text: _conf.title
            },
            subtitle: {
                text: _conf.subtitle
            },
            xAxis: {
                allowDecimals: false,
                categories: _conf.categories
            },
            yAxis: {
                title: {
                    text: _conf.titleScale
                },
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                }
            },
            colors: this.paletaColores,
            credits: { 
                enabled: false 
            },
            tooltip: {
                split: _conf.splitTooltip,
                pointFormat: '<b>{point.y:,.0f}</b> '+_conf.titleSufixTooltip+' {series.name}'
            },
            plotOptions: {
                area: {
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            series: _data
        };
    }

    /*private BigNumbersFormatter(num: number): any {
        let separado: any[]=[];

        var number1 = this.y+'', result = '';

        separado=number1.split(".");

        if (separado[0].indexOf(',') === -1) {

            while (separado[0].length > 3) {
              result = ',' + '' + separado[0].substr(separado[0].length - 3) + '' + result;
              separado[0] = separado[0].substring(0, separado[0].length - 3);
            }

            result = separado[0] + result;
            separado[0]=result;
            result = '';
        }

        if(separado.length>1){
            result= separado[0]+"."+separado[1];
        }else{
            result= separado[0];
        }

        return result;
    }*/
    
}

