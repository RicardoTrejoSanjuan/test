//INTERFACES PARA GENERAR GRAFICAS DE HIGHCHART
export interface ConfGraficaBar {
    type: string; //tipo de grafica: bar
    title: string; //Titulo de la grafica,se muestra en la parte superior de la grafica
    subtitle: string; //Subtitulo de la grafica, Se muestra debajo del titulo principal de la grafica
    categories: string[]; //Categorias de la grafica, se muestra verticalmente en el lado izquierdo de la grafica
    titleCategories: string;// Titulo de las categorias
    titleData: string;// Titulo que se muestra paralelo(horizontal) a la informacion (grafica).
    valueSuffix: string;//Tipo de valor que se muestra en el tooltip
    widthBar: number;// Ancho de cada barra que compone la grafica
    name: string;// Nombre de los datos de cada catgoria
    drilldown: boolean;//Valor boleano que indica si la grafica generar otra grafica a parti de una seleccion
}

export interface ConfGraficaPie {
    type: string;//tipo de grafica: pie
    nameCategory: string; //Nobre de las categorias
    title: string;//Titulo de la grafuca, se muestra en la parte superior de la misma
    subtitle: string;//Subtitulo de la grafica, se  muestra debajo del titulo de la grafica
    tooltip: boolean;// Valor para mostrar u ocultar el tooltip de la grafica
    dataLabels: boolean;//Muestra u oculta la tabla generada por highchart de los datos que se estan graficando
    drilldown: boolean;//Valor boleano que indica si la grafica generar otra grafica a parti de una seleccion
    showLegends: boolean;//Muestras las legends
}

export interface ConfGraficaColumn {
    type: string;//tipo de grafica: column
    title: string;//Titulo de la grafica a mostrar
    subtitle: string;//Subtitulo de la grafica a mostrar
    categories: string[];//Categorias que se mostraran de forma vertical en la grafca. Se muestran a la izquierda de la grafica
    titleCategories: string;//titulo de las categorias horizontales
    titleVertical: string;//Titulo de las categorias. Titulo vertical
    valueSuffix: string;//texto que se muestra en el tooltip
    allowDecimals: boolean;//Valor booleano para mostrar las categorias con punto decimal o no. En falso se muestra la categorias en numeros enteros
    drilldown: boolean;//Valor boleano que indica si la grafica generar otra grafica a parti de una seleccion
    pointPadding: number;//Espacio entre las barras de las graficas
    showLegends: boolean;//Valor booleano para indicar si se muestran o no las leyendas
    formatLabel: String;//Formato de los valores que se mostraran
    tooltip: Boolean;//Muestra u oculta el tooltip de las graficas de barras
}

export interface ConfGraficaPercent {
    type: string;// tipo de grafica : percent
    title: string;//Tiltulo de la grafica
    subtitle: string;//Subtitulo de la grafica
    categories: string[];//Categorias de las graficas
    titleCategories: string; //Titulode las de Categorias
    drilldown: boolean;//Valor boleano que indica si la grafica generar otra grafica a partir de una seleccion
    horizontal: boolean;// Orientaciíon de la grafica: horizontal = true, Vertical: false
    tooltipShared: boolean;//Mostrar tooltip compartidos
    widthBar: number;// Ancho de cada barra que compone la grafica
}
//Interface que trabaja con ConfGraficaPercent. Se necesita para cargar la informacion en la grafica
export interface DataPercent {
    name: string;//Titulo de la informacion. Sera visible sobre la barra de la grafica
    data: number[];//Array con los datos a pintar en la grafica
}
//Interface para la creacion de un grafica de lineas
export interface ConfGraficaLine {
    type: string;//tipo de grafica: line
    title: string;//titulo de la grafica
    subtitle: string;//Subtitulo de la grafica
    titleScale: string;//Titulo de las categorias
    categories: string[];//Categorias de la informacion
    drilldown: boolean;//Valor boleano que indica si la grafica generar otra grafica a partir de una seleccion
    showLegends: boolean;//Valor booleano para indicar si se muestran o no las leyendas
}

export interface ConfStockColumn {
    type: String;//Tipo de la grafica: HighStock
    subType: String;
    title: String;
    subtitle: String;
    navigator: Boolean;
    scrollbar: Boolean;
    categories: String [];
    minCategories: Number;
    allowDecimals: Boolean;
    minyAxis: Number;
    titleCategoriesVertical: String;
    pointWidth: Number;
    pointPadding: Number;
    formatLabel: String;//Formato de los valores que se mostraran
    drilldown: Boolean;//Valor boleano que indica si la grafica generar otra grafica a partir de una seleccion
}

export interface ConfGraficaDoubleLine {
    type: String;//tipo de grafica: line
    title: String;//titulo de la grafica
    subtitle: String;//Subtitulo de la grafica
    categories: String[];//Categorias de la informacion
    titleScaleOne: String;
    titleScaleTwo: String;
    sufixFormatOne: String;
    sufixFormatTwo: String;
    titleSerieOne: String;
    titleSerieTwo: String;
}

export interface ConfGraficaBasicArea {
    type: String;
    title: String;
    subtitle: String;
    categories: String[];
    titleScale: String;
    titleSufixTooltip: String;
    splitTooltip: Boolean;
    drilldown: Boolean;
}
