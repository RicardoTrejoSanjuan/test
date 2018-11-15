export class ObjDispersiones {
    public jsonResultado: any = null;
    public porcentajeConDispersion: number = 0;
    public porcentajeSinDispersion: number = 0;
    public datosFechaPrimera: string = 'dd-mm-aaaa';
    public datosFechaFinal: string = 'dd-mm-aaaa';
    public todasPromedio: number = 0;
    public todasMinimo: number = 0;
    public todasMaximo: number = 0;
    public ultimaPromedio: number = 0;
    public ultimaMinimo: number = 0;
    public ultimaMaximo: number = 0;
    constructor() { }

    public setValues(_data: any): void {
        this.jsonResultado = _data;
    }

    public animate(): void {
        try {
            let _data: any = this.jsonResultado;
            let dataDispersion: any = _data.datosDisp.shift();
            let dataFechas: any = _data.datosFecha.shift();
            let dataGeneral: any = _data.datosGeneral.shift();
            let dataUltima: any = _data.datosUltima.shift();
            this.porcentajeConDispersion = dataDispersion.porcentajeConDispersion;
            this.porcentajeSinDispersion = dataDispersion.porcentajeSinDispersion;
            this.datosFechaPrimera = dataFechas.fechaAnterior;
            this.datosFechaFinal = dataFechas.ultimaFecha;
            this.todasPromedio = dataGeneral.promedioGeneral;
            this.todasMinimo = dataGeneral.minimoGeneral;
            this.todasMaximo = dataGeneral.maximoGeneral;
            this.ultimaPromedio = dataUltima.promedioUltima;
            this.ultimaMinimo = dataUltima.minimoUltima;
            this.ultimaMaximo = dataUltima.maximaUltima;
        } catch (e) {
            console.log("La respuesta del servidor no es adecuada");
        }
    }

    public animateNumber(): void {
        for (let index in this) {
            if (this.hasOwnProperty(index)) {
                if (this.isIterable(index)) {
                    let top: number = this[String(index)];
                    let increase: number = this[String(index)] * 0.20;
                    this[String(index)] = 0;
                    let interval: any = setInterval(() => {
                        this[String(index)] += increase;
                        if (this[String(index)] >= top) {
                            this[String(index)] = top;
                            clearInterval(interval);
                        }
                    }, 200);
                }
            }
        }
    }

    private isIterable(_index: string): any {
        if (
            _index === 'porcentajeConDispersion' ||
            _index === 'porcentajeSinDispersion'
        ) {
            return true;
        }
        return false;
    }

}

export class DataReportesInstitucion {
    public jsonResultado: any = null;
    public datosBuroSinFirma: number = 0;
    public datosBuroConFirma: number = 0;
    public datosBuroConFirmaP: number = 0;
    public datosBuroSinFirmaP: number = 0;
    public datosCreditoCandidatosCredito: number = 0;
    public datosCreditoNoCandidatosCredito: number = 0;
    public datosCreditoCandidatosCreditoP: number = 0;
    public datosCreditoNoCandidatosCreditoP: number = 0;
    public datosEdadEdadDesviacion: number = 0;
    public datosEdadEdadMaxima: number = 0;
    public datosEdadEdadMinima: number = 0;
    public datosEdadEdadPromedio: number = 0;
    public datosGeneroPorcentajeMujeres: number = 0;
    public datosGeneroPorcentajeHombres: number = 0;
    public datosTelefEmplConTelefono: number = 0;
    public datosTelefEmplSinTelefono: number = 0;
    public datosTelefEmplConTelefonoPorcentaje: number = 0;
    public datosTelefEmplSinTelefonoPorcentaje: number = 0;
    public porcentajeCompleto: number = 0;
    public porcentajeConError: number = 0;
    public porcentajeEnProcesoIVR: number = 0;
    public porcentajeEnRevision: number = 0;
    public porcentajeEnRevisionMC: number = 0;
    public porcentajeInactivo: number = 0;
    public qtyCompleto: number = 0;
    public qtyConError: number = 0;
    public qtyEnProcesoIVR: number = 0;
    public qtyEnRevision: number = 0;
    public qtyEnRevisionMC: number = 0;
    public qtyInactivo: number = 0;

    constructor() {
    }

    public setValues(data: any): void {
        this.jsonResultado = data;
    }

    public animate(): void {
        try {
            let data: any = this.jsonResultado;
            let datosBuro: any = data.datosBuro.shift();
            let datosCredito: any = data.datosCredito.shift();
            let datosEdad: any = data.datosEdad.shift();
            let datosGenero: any = data.datosGenero.shift();
            let datosTelef: any = data.datosTelef.shift();
            let datosEdoCta: any = data.datosEdoCta.shift();
            /* Buro */
            this.datosBuroSinFirma = datosBuro.qtySinBuro;
            this.datosBuroConFirma = datosBuro.qtyConBuro;
            this.datosBuroConFirmaP = datosBuro.porcentajeConBuro;
            this.datosBuroSinFirmaP = datosBuro.porcentajeSinBuro;
            /* Crédito */
            this.datosCreditoCandidatosCredito = datosCredito.qtyCredito;
            this.datosCreditoNoCandidatosCredito = datosCredito.qtyNoCredito;
            this.datosCreditoCandidatosCreditoP = datosCredito.porcentajeCredito;
            this.datosCreditoNoCandidatosCreditoP = datosCredito.porcentajeNoCredito;
            /* Edad */
            this.datosEdadEdadDesviacion = datosEdad.edadDesviacion;
            this.datosEdadEdadMaxima = datosEdad.edadMaxima;
            this.datosEdadEdadMinima = datosEdad.edadMinima;
            this.datosEdadEdadPromedio = datosEdad.edadPromedio;
            /* Genero */
            this.datosGeneroPorcentajeMujeres = datosGenero.porcentajeHombre;
            this.datosGeneroPorcentajeHombres = datosGenero.porcentajeMujeres;
            /* Telefono*/
            this.datosTelefEmplConTelefono = datosTelef.emplConTelefono;
            this.datosTelefEmplSinTelefono = datosTelef.emplSinTelefono;
            this.datosTelefEmplConTelefonoPorcentaje = datosTelef.porcentajeConTelefono;
            this.datosTelefEmplSinTelefonoPorcentaje = datosTelef.porcentajeSinTelefono;
            /* Status de la cuenta */
            this.porcentajeCompleto = datosEdoCta.porcentajeCompleto;
            this.porcentajeConError = datosEdoCta.porcentajeConError;
            this.porcentajeEnProcesoIVR = datosEdoCta.porcentajeEnProcesoIVR;
            this.porcentajeEnRevision = datosEdoCta.porcentajeEnRevision;
            this.porcentajeEnRevisionMC = datosEdoCta.porcentajeEnRevisionMC;
            this.porcentajeInactivo = datosEdoCta.porcentajeInactivo;
            this.qtyCompleto = datosEdoCta.qtyCompleto;
            this.qtyConError = datosEdoCta.qtyConError;
            this.qtyEnProcesoIVR = datosEdoCta.qtyEnProcesoIVR;
            this.qtyEnRevision = datosEdoCta.qtyEnRevision;
            this.qtyEnRevisionMC = datosEdoCta.qtyEnRevisionMC;
            this.qtyInactivo = datosEdoCta.qtyInactivo;
            this.animateSimple();
            this.updateCircles(true);
        } catch (e) {
            console.log("La respuesta del servidor no es adecuada");
        }
    }

    public updateCircles(_value?: boolean): void {
        let circle_1: any = document.getElementById("circle_1");
        let circle_2: any = document.getElementById("circle_2");
        let circle_3: any = document.getElementById("circle_3");
        circle_1.style.background = "linear-gradient(" + (this.datosTelefEmplSinTelefonoPorcentaje * 3.5) + "deg, rgb(241, 108, 96) 50%, #6b8fed 50%)";
        circle_2.style.background = "linear-gradient(" + (this.datosBuroConFirmaP * 3.5) + "deg, #42bd41 50%, rgba(0,0,0,0) 50%)";
        circle_3.style.background = "linear-gradient(" + (this.datosCreditoCandidatosCredito * 3.5) + "deg, #42bd41 50%, rgba(0,0,0,0) 50%)";
    }

    public animateSimple(): void {
        for (let index in this) {
            if (this.hasOwnProperty(index)) {
                if (this.isIterable(index)) {
                    let top: number = this[String(index)];
                    let increase: number = this[String(index)] * 0.05;
                    this[String(index)] = 0;
                    let interval: any = setInterval(() => {
                        this[String(index)] = Math.ceil(this[String(index)] + increase);
                        if (this[String(index)] >= top) {
                            this[String(index)] = top;
                            clearInterval(interval);
                        }
                    }, 5);
                }
            }
        }
    }

    private isIterable(_index: string): any {
        if (
            _index === 'datosEdadEdadPromedio'
        ) {
            return true;
        }
        return false;
    }
}

export class ObjFiltrosHandler {
    public institucionSelected: boolean = false;
    public graphVisible: boolean = false;
    public dataVisible: boolean = false;
    public modalVisible: boolean = false;
    public btnDownload: boolean = false;
    public bandFechas: boolean = false;
    public fechaIn: boolean = false;
    public idInstitucion: number = null;
    public nombreInstitucion: string = "";

    constructor() { }

    public setInstSelected(_value: boolean): void {
        this.institucionSelected = _value;
    }
    public getInstSelected(): boolean {
        return this.institucionSelected;
    }
    public setGraphVisible(_value: boolean): void {
        this.graphVisible = _value;
    }
    public setDataVisible(_value: boolean): void {
        this.dataVisible = _value;
    }
    public setBtnVisible(_value: boolean): void {
        this.btnDownload = _value;
    }
    public setModalVisible(_value: boolean): void {
        this.modalVisible = _value;
    }
    public setFechasVisible(_value: boolean): void {
        this.bandFechas = _value;
    }
    public getFechasVisible(): boolean {
        return this.bandFechas;
    }
    public setFechasInVisible(_value: boolean): void {
        this.fechaIn = _value;
    }
    public setInstitucion(_value: any): void {
        this.idInstitucion = _value.idInst;
        this.nombreInstitucion = _value.name;
    }
    public getIdInstitucion(): number {
        return this.idInstitucion;
    }
    public getNombreInstitucion(): string {
        return this.nombreInstitucion;
    }
}
