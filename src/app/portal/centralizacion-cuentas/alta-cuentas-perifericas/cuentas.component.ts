export class Cuentas{
    public numCuenta: string;
    expanded:boolean;
    child:any=null;
    todo: Cuentas[]=[];
    idInstitucion: any;
    idPais: any;
    idEstructura: any;
    numTarjeta: any;
    cuentaPeriferica: any;
    nombreTitular: any;
    estatusTarjeta: any;
    nombreEmpresa: any;
    limiteGasto:any;
    fecha: any;
    vigencia: any;
    montoDisponible:any;
    montoRemanente: any;
    saldoPeriferico: any;
    saldoDisponible: any;
    idEstaus:any;
    estructuraConsolidada:any;
    idTipoRevolvencia:any=null;
    chk:boolean;
    constructor(object,todo) {
        if (object.cuentaPeriferica===undefined) {
            this.numCuenta = object.numCuenta;
        }else{
            this.numCuenta= object.cuentaPeriferica;
        }
        if (object.child === undefined) {
            this.child=null;
        } else {
            this.child=object.child; 
        }
        if (object.idTipoRevolvencia === undefined) {
            this.idTipoRevolvencia=null;
        } else {
            this.idTipoRevolvencia=object.idTipoRevolvencia;
        }
        if (object.estructuraConsolidada === undefined) {
            this.estructuraConsolidada=null;
        } else {
            this.estructuraConsolidada=object.estructuraConsolidada;
        }
        this.idEstaus=object.idEstaus,
        this.expanded = false;
        this.todo=todo;
        this.idInstitucion= object.idInstitucion;
        this.idPais= object.idPais;
        this.numTarjeta=object.numTarjeta;
        this.cuentaPeriferica=object.cuentaPeriferica;
        this.nombreTitular=object.nombreTitular;
        this.estatusTarjeta=object.estatusTarjeta;
        this.nombreEmpresa=object.nombreEmpresa;
        this.limiteGasto=object.limiteGasto;
        this.fecha=object.fechaHora;
        this.vigencia=object.vigencia;
        this.montoDisponible=object.montoDisponible;
        this.montoRemanente=object.montoRemanente;
        this.saldoPeriferico=object.saldoPeriferico;
        this.saldoDisponible=object.saldoDisponible;
        this.chk = false;
    }
    toggle(){
        if (this.child!==null) {
             this.expanded = !this.expanded;
        }
       
    }
    /*check(){
        let newState = !this.chk;
        this.chk = newState; 
        let padre=this.todo;
        this.checkRecursive(newState);
        this.checkPadre(newState,padre);
    }*/
    addRecursive(agregar,numero){
        if (this.child!==null ) {
            this.child.forEach(d => {
                if (d.numCuenta===numero) {
                    d.child.push(agregar);
                } else {
                    d.checkRecursive(agregar,numero);
                }
            });
        } 
    }
    check(){
        let newState = !this.chk;
        this.chk = newState; 
        let padre=this.todo;
        this.checkRecursive(newState);
        //this.checkPadre(newState,padre);
    }
    checkRecursive(state){
        if (this.child!==null ) {
            this.child.forEach(d => {
                d.chk = state;
                d.checkRecursive(state);
            });
        }
    }
    
    checkPadre(state,todo){
        if (state) {
            if(todo!==null){
                todo.chk=true;
                todo.checkPadre(state,todo.todo);
            }
            
        }
        
    }
    
    
}