// Clase que define el valor en años de una edad y si esta disponible para elegir
export class Edad {
    constructor(private edad: number, private status: boolean) { }
}
// Clase que construye y obtiene los rangos disponibles para las edades
export class EdadValidate {
    // Array que almacenara los objetos de edades
    public registros: any[] = [];
    // Constructor que inicializa los valores del array de edades
    constructor() {
        // De 1 hasta 100 se va insertando el objeto de edad con su respectivo valor en años y su disponibilidad inicial
        for (let i: number = 1; i <= 100; i++) {
            this.registros.push(new Edad(i, true));
        }
    }
    // Funcion que asigna, por medio de la funcion update, el valor en años que ya son utilizadas por otros registros
    public set(_data: any): void {
        // Se recorre cada objeto de la variable que se recibe
        for (let item of _data) {
            // Por cada objeto se obtiene el rango de edades, indicando con un boolean que no estan disponibles y se envia a la funcion update
            this.update(new Edad(item.edadMin, false), new Edad(item.edadMax, false));
        }
    }
    // Funcion que asigna a no disponibles, los años que se encuentran dentro del rango de edades recibidas como parametros de la funcion
    private update(_edadMin: any, _edadMax: any): void {
        // Se crea un filtro para el array de edades
        this.registros.filter((item: any) => {
            // Se evalua si el año del objeto edad esta dentro del rango entre la edad minima y la maxima, si ese es el caso su estatus pasa a false
            if (item.edad >= _edadMin.edad && item.edad <= _edadMax.edad) {
                item.status = false;
            }
        });
    }
    public getMin(): number[] {
        let arr: number[] = [];
        for (let i of this.registros) {
            if (i.status) {
                arr.push(i.edad);
            }
        }
        return arr;
    }
    public getMax(_edad: number): number[] {
        let arr: number[] = [];
        for (let i = _edad - 1; i < this.registros.length; i++) {
            let edad: any = this.registros[i];
            if (edad.status) {
                arr.push(edad.edad);
            } else {
                break;
            }
        }
        return arr;
    }
    public getAll(): number[] {
        let arr: number[] = [];
        for (let i = 1; i <= 100; i++) {
            arr.push(i);
        }
        return arr;
    }
}

/* ============================================================================================================ */


export class Periodicidad {
    constructor(private descripPeriodo: string, private idPeridocidadPago: number) { }
}

export class PeriodicidadValidate {
    public registros: Periodicidad[] = [];
    constructor() {}
    public set(_data: any) {

        let found, x, y;
        let oldArray: any;
        let newArray: any;

        //Se ietra sobre el arreglo que contiene la informacion
        for (x = 0; x < _data.length; x++) {
            found = false;
            oldArray = _data[x];
            // Por cada valor del arreglo original se itera el contenido del arreglo nuevo
            for (y = 0; y < this.registros.length; y++) {

                newArray = this.registros[y];

                // Si el valor de la posicion obtenida en el arreglo original es igual a la del arreglo nuevo se marca una bandera
                if (oldArray.idPeridocidadPago === newArray.idPeridocidadPago) {
                    found = true;
                    break;
                }
            }    
            // Si los valores no son iguales se agrega al nuevo arreglo
            if (!found) {
                this.registros.push(new Periodicidad(oldArray.descripPeriodo,oldArray.idPeridocidadPago));
            }
        }
    }
}

/* ============================================================================================================ */

export class Producto {
    constructor(private descripcionProducto: string, private idProducto: number) { }
}

export class ProductoValidate {
    public registros: Producto[] = [];
    constructor() {}
    public set(_data: any) {

        let found, x, y;
        let oldArray: any;
        let newArray: any;

        //Se ietra sobre el arreglo que contiene la informacion
        for (x = 0; x < _data.length; x++) {
            found = false;
            oldArray = _data[x];
            // Por cada valor del arreglo original se itera el contenido del arreglo nuevo
            for (y = 0; y < this.registros.length; y++) {

                newArray = this.registros[y];

                // Si el valor de la posicion obtenida en el arreglo original es igual a la del arreglo nuevo se marca una bandera
                if (oldArray.idProducto === newArray.idProducto) {
                    found = true;
                    break;
                }
            }    
            // Si los valores no son iguales se agrega al nuevo arreglo
            if (!found) {
                this.registros.push(new Producto(oldArray.descripcion,oldArray.idProducto));
            }
        }
    }
}

export class RangoValidate {

    private esRangoMaximoValido: boolean = false;
    private esRangoMinimoValido: boolean = false;
    private sonRangosValidos: boolean = false;

    constructor() {}

    public validarRangosMinimoMaximo(_rangoUno: number,_rangoDos: number): boolean {

        this.resetearValores();

        if(_rangoUno != null && _rangoDos != null) {

            if(_rangoDos > _rangoUno) {
                this.esRangoMinimoValido = true;
                this.esRangoMaximoValido = true;
            } 
            if(_rangoUno > _rangoDos) {
                this.esRangoMinimoValido = false;
                this.esRangoMaximoValido = true;
            }
            if(_rangoUno === _rangoDos) {
                this.esRangoMinimoValido = false;
                this.esRangoMaximoValido = false;
            }  
            if(_rangoUno === 0 && _rangoDos > 0){
                this.esRangoMaximoValido = true;
                this.esRangoMinimoValido = false;
            } 
            if(_rangoDos === 0 && _rangoUno > 0) {
                this.esRangoMinimoValido = true;
                this.esRangoMaximoValido = false;
            } 

            this.sonRangosValidos = this.esRangoMinimoValido && this.esRangoMaximoValido;

            /*console.log("Minimo ["+_rangoUno+"] -> ",this.esRangoMinimoValido);
            console.log("Maximo ["+_rangoDos+"] -> ",this.esRangoMaximoValido);
            console.log("Resultado de ["+_rangoUno+"-"+_rangoDos+"] -> ",this.sonRangosValidos);*/
        }

        return this.sonRangosValidos;
    }

    public esMinimoValido(): boolean {
        return this.esRangoMinimoValido;
    }
    public esMaximoValido(): boolean {
        return this.esRangoMaximoValido;
    }
    public esRangoValido() : boolean {
        return this.sonRangosValidos; 
    }
    private resetearValores(): void {
        this.esRangoMaximoValido = false;
        this.esRangoMinimoValido = false;
        this.sonRangosValidos = false;
    }
}