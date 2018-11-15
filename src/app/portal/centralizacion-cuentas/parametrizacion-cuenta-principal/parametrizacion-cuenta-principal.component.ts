import {Component, AfterViewInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ClassGenerica} from '../../../classGeneric/config';
import {Service} from '../../../service/service';
import {Notifications} from '../../../classGeneric/notifications';
import {FormControl,FormArray} from '@angular/forms';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
import { PaginationFron } from '../../../classGeneric/paginationFront';
import { Pagination } from '../../../classGeneric/pagination';
@Component({
    selector: 'ParametrizacionCuentaPrincipal',
    styleUrls: [
        "../../mantenimiento/mantenimiento-instituciones/instituciones.component.css",
        "../../mesa-control/mesa-control.component.css",
        "../../depositos/alta-servicio-daz/alta.css"
      ],
    templateUrl: './parametrizacion-cuenta-principal.component.html'
})


export class ParametrizacionCuentaPrincipalComponent extends Pagination {
    private menuLateral: Array<Object>;
    pager: any = {};
    pagedItems: any[];
    color:any;
    numeroCuenta:any;
    formulario: FormGroup;
    listaDocumento:any;
    bandIst:boolean;
	institucion:any;
	institucionCtrl:FormControl;
    objFiltrosHandler:Object;
    listaInstituciones: any;
    instSeleccionada:any;
    consolidada:any;
    instCent:any;
    range: any;
    mostrar:boolean=false;
    deshabilitar:boolean;
    ponerPorcentaje:boolean;
    tipoEstructura:any;
    desActivar:boolean;
    listaDocumentoVigencia:any;
    descTipoRev: string;
    valores:any;
    cheComisiones:any;
    instituciones:any;
    comisionesModificadas:any=[];
    rangeT:any;
    constructor(private service: Service, private notifications: Notifications,private formBuilder: FormBuilder, private router: Router, private paginationfron: PaginationFron) {
        super();
        this.desActivar=false;
        this.deshabilitar=false;
        this.valores=[{valor:0},{valor:0},{valor:0},{valor:0},{valor:0},{valor:0}];
        this.consolidada = 1;
        this.menuNavigation = this.menuNavigation();
        this.menuLateral = this.getMenuLateral();
        this.tipoEstructura=0;
        this.bandIst=true;
        this.consultarDocumento();
        this.consultarDocumentoVigenci();
        this.formulario = this.formBuilder.group({
            'cobertura': ['0', [Validators.required]],
            'barrido': [{value: '0', disabled: this.deshabilitar}],
            'consolidado': [""],
            'comision': ['1',[Validators.required]],
            'comisionTarjeta': ['1'],
            'transBarrido': [{value: '0', disabled: this.desActivar}],
            'montPor': ['400', [Validators.required]],
            'tarifa': ['400', ],
            'limiteGasto':['',],
            'vigencia':['0', [Validators.required]],
            'AgreModi':['M', [Validators.required]],
            
        });
        this.cheComisiones={comision: false,
            comisionTarjeta: false
        };
        this.rangeT="";
        this.ponerPorcentaje=false;
        this.range={primero:"",segundo:"",tercero:""};
        this.listaDocumentoVigencia={
            listLimiteVigGasto:[]
        };
        this.listaDocumento={
            listTipoCobertura:[],
            listTipoComision:[],
            listTipoBarrido:[]
        };
        this.objFiltrosHandler = {
			agrupamientoRequest: "INSTITUCION",
			x: false,
			institucionSelected: false
        };
        this.institucionCtrl = new FormControl();
        this.instCent=super.getAttr('institucionCent');
        if(this.instCent){
            this.institucionCtrl.setValue(this.instCent.razonsocial);
            this.buscarCuentas({idPais:this.instCent.idPais,idInst:this.instCent.idInstitucion,razonsocial:this.instCent.razonsocial});
        }
        //this.buscarCuentas();
    }
    buscar(){
		this.listaInstituciones = this.filtrarInstituciones(this.institucionCtrl.value);
		
	}
    onSelectionChange(valor){

        if(valor===1){
            this.mostrar=true;
        }else{
            this.mostrar=false;
        }
    }
    buscarCuentas(inst){ 
        this.numeroCuenta={
            idPais: inst.idPais,
            idInstitucion: inst.idInst
        };
        this.instCent= inst;
        console.log(inst);
        this.listaInstituciones=[];
        super.loading(true);
        let uri="/cuentascentralizadas/cuentaprincipal/busqueda/cuenta";
		this.service.post( this.numeroCuenta, uri, 3).subscribe(
			data => {
				let object = JSON.parse(JSON.stringify(data));
				console.log(object);
				if (object.codE === 0) {
					let objResponse: any = object.jsonResultado;
					if(objResponse !== null && objResponse.length !== 0) {
                        console.log(objResponse,"aqui");
                        this.instituciones=object.jsonResultado;
						this.pager = this.paginationfron.getPager(object.jsonResultado.length, 1, 50);
						this.pagedItems = this.paginationfron.getPagerdata(object.jsonResultado);
						/*this.notifications.success("Exito !!!",object.msgE);*/
					} else {
						this.notifications.info("Aviso !!!","La respuesta fue correcta, pero vacia !!!");
					}
					
				}else {
					this.notifications.info("Aviso !!!",object.msgE);
				}
			},
			error => {
				this.notifications.error("Error !!!",error);
			},
			() => super.loading(false)
		);
    }
    setPage(page: number, rango?: number, total?: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.paginationfron.getPager(total, page, rango);
        this.pagedItems = this.paginationfron.getPagerdata([], page);
    }
    consultarDocumentoVigenci() {
        super.loading(true);
        let objRequest: any = { };
        let urlRequest: any = "/cuentascentralizadas/cuentasperifericas/catalogos/limitegasto";
        this.service.post(objRequest, urlRequest, 3).subscribe(
            data => {

                let object = JSON.parse(JSON.stringify(data));
                if (object.codE === 0) {
                    let objResponse: any = object.jsonResultado;
                    this.listaDocumentoVigencia = objResponse;
                    console.log(this.listaDocumentoVigencia);
                } else {
                    this.notifications.info("Aviso !!!", object.msgE);
                }
            },
            error => {
                this.notifications.error("Error !!!", error);
            },
            () => super.loading(false)
        );
    }
    consultarDocumento() {
        super.loading(true);

        let objRequest: any = { };
        let urlRequest: any = "/cuentascentralizadas/cuentaprincipal/caracteristicas";
        this.service.post(objRequest, urlRequest, 3).subscribe(
            data => {

                let object = JSON.parse(JSON.stringify(data));

                if (object.codE === 0) {

                    let objResponse: any = object.jsonResultado;
                    console.log(objResponse);
                    if (objResponse !== null && objResponse.length > 0) {
                        this.listaDocumento = objResponse;
                    } else {
                        this.listaDocumento = objResponse;
                    }
                } else {
                    this.notifications.info("Aviso !!!", object.msgE);
                }
            },
            error => {
                this.notifications.error("Error !!!", error);
            },
            () => super.loading(false)
        );
    }
    filtrarInstituciones(val: string) {

		let instituciones: any[] = [];
		if (this.bandIst) {
			if(val !== null && val !== undefined) {

				let _objFiltrosHandler: any = this.objFiltrosHandler;

				_objFiltrosHandler.anyoneSearchResult = false;

				if(val.length > 2) {

					super.loading(true);

					let objRequest = {cuentaEmpresa: val};

					let uriRequest = "/cuentascentralizadas/cuentaprincipal/consulta/institucion";

					this.service.post(objRequest, uriRequest,3).subscribe(
						data => {

							let objServiceResponse: any = JSON.parse(JSON.stringify(data));
							console.log(objServiceResponse);
							if (objServiceResponse.codE === 0) {

								if(objServiceResponse.jsonResultado.length > 0) {

									for (let inst of objServiceResponse.jsonResultado) {
										console.log(objServiceResponse.jsonResultado);
										instituciones.push({razonsocial: inst.razonSocial,idInst: inst.idInstitucion,idPais: inst.idPais, rfc: inst.rfc });
									}
									document.getElementById('inst').focus();
									this.institucionCtrl.setValue(this.institucionCtrl.value+" ");

								} else {
									_objFiltrosHandler.anyoneSearchResult = true;
									_objFiltrosHandler.institucionSelected = false;
								}

							} else {
								//console.log("La respuesta contiene algun fallo -> [" + objServiceResponse.msgE + "]");
								this.notifications.info('Consulta de instituciones',"El servidor respondio con algun fallo -> [" + objServiceResponse.msgE + "]");
								_objFiltrosHandler.institucionSelected = false;
							}
						},
						error => {
							//console.log("Ha ocurrido una falla en la peticion -> [" + error + "]");
							this.notifications.error('Error',"Ha ocurrido una falla en la peticion -> [" + error + "]");
						},
						() => super.loading(false)
					);
				} else {
					_objFiltrosHandler.institucionSelected = false;
				}

				this.objFiltrosHandler = _objFiltrosHandler;
			}else{
				this.institucion=0;
			}
		}
		this.bandIst=true;
    	return instituciones;
      }
    focusC(tipo){
        if (tipo===1) {
            this.formulario.controls['montPor'].setValue("");
            this.range.primero="";
        }
        if(tipo===2){
            this.formulario.controls['tarifa'].setValue("");
            this.range.segundo="";
        }
        if(tipo===3){
            this.formulario.controls['limiteGasto'].setValue("");
            this.range.tercero="";
        }
    }
    seleccionComision(){
        console.log(this.formulario.controls['comision'].value);
        if (this.formulario.controls['comision'].value==="2") {
            this.ponerPorcentaje=true;
        }else{
            this.ponerPorcentaje=false;
        }
    
    }
    seleccion(){
        console.log(this.formulario.controls['cobertura'].value);
        if (this.formulario.controls['cobertura'].value==="1") {
            this.desActivar=false;
            //this.formulario.controls['transBarrido'].reset({ value: 0, disabled: !this.desActivar });
        } else {
            this.desActivar=true;
            //this.formulario.controls['transBarrido'].reset({ value: 0, disabled: !this.desActivar });
        }
    }
    seleccionar(item){

        this.range={primero:"",segundo:"",tercero:""};

        this.tipoEstructura=item.idTipoEstrucutra;
        this.instSeleccionada=item;
        console.log(item);
        if (item.idTipoEstrucutra===1) {
            this.deshabilitar=true;
            this.formulario.controls['barrido'].reset({ value: 0, disabled: this.deshabilitar });
            this.formulario.controls['transBarrido'].reset({ value: 0, disabled: this.deshabilitar });
        }else{
            this.deshabilitar=false;
            this.formulario.controls['barrido'].reset({ value: 0, disabled: this.deshabilitar });
            this.formulario.controls['transBarrido'].reset({ value: 0, disabled: this.deshabilitar });
            this.formulario.controls['barrido'].setValue(item.idBarrido);
        }
        this.color=item.numCuenta;
        this.formulario.controls['comision'].setValue(item.idTipoComision);
        this.formulario.controls['montPor'].setValue(this.verificarDecimal(String(item.importeComision),1));
        this.formulario.controls['consolidado'].setValue(item.consolidada);
        this.formulario.controls['cobertura'].setValue(item.idCobertura);
        this.formulario.controls['limiteGasto'].setValue(this.verificarDecimal(String(item.limite_gasto),1));
        this.formulario.controls['vigencia'].setValue(item.idTipoRevolvencia);
        this.formulario.controls['comisionTarjeta'].setValue(item.idComisionTarjeta);
        this.formulario.controls['tarifa'].setValue(this.verificarDecimal(String(item.importeComisionTarjeta),1));
        this.seleccionarTipoRevolvencia();
        this.comisiones(item);
        //this.range.primero=this.verificarDecimal(String(item.importeComision),2);
        //this.range.segundo=this.verificarDecimal(String(item.importeComisionTarjeta),2);
        //this.range.tercero=this.verificarDecimal(String(item.limite_gasto),2);
        //this.formulario.controls['transBarrido'].setValue(item.idTipoRevolvencia);
    }
    verificarDecimal(numero,tipo){
        if(tipo===1){
            if (numero.indexOf(".")===-1) {
                return numero+".00";
            }else{
                let separado=numero.split(".",2);
                if (separado[1].length>=2) {
                    return numero;
                }else{
                    return numero+"0";
                }
                
            }
        }else{
            if(numero==="0"){
                return "";
            }else{
                if (numero.indexOf(".")===-1) {
                    return numero+"00";
                }else{
                    let separado=numero.split(".",2);
                    if (separado[1].length>=2) {
                        return numero;
                    }else{
                        return numero+"0";
                    }
                    
                }
            }
        }  
    }
      decimal(tipo, event){
        let tecla = (document.all) ? event.keyCode : event.which;
        let patron = /[0-9]/;
        let range;
        if (tipo===1) {
            range=this.range.primero;
        }
        if (tipo===2) {
            range=this.range.segundo;
        }
        if (tipo===3) {
            range=this.range.tercero;
        }
        if( tecla === 8 || tecla === 46 ) {
            range=range.substr(0,range.length-1);
            if (range===0) {
                console.log("tecla");
                range="";
            }
        }else{
            if ((patron.test(String.fromCharCode(tecla))) || (tecla >= 96 && tecla <= 105) ) {
                range=range+event.target.value.substr(event.target.value.length-1);
            }
        }
        console.log(range);
        let decimal=range*.01;
        let decimal2=decimal.toFixed(2);
        if (tipo===1) {
            this.formulario.controls['montPor'].setValue(decimal2);
            this.range.primero=range;
        }
        if(tipo===2){
            this.formulario.controls['tarifa'].setValue(decimal2);
            this.range.segundo=range;
        }
        if(tipo===3){
            this.formulario.controls['limiteGasto'].setValue(decimal2);
            this.range.tercero=range;
        }
        
    }
    seleccionarTipoRevolvencia(){
        console.log(this.descTipoRev);
        console.log(this.formulario.controls['vigencia'].value);
        this.listaDocumentoVigencia.listLimiteVigGasto.forEach(element => {
            console.log(element.idTipoRevolvencia);
            if (element.idTipoRevolvencia===parseInt(this.formulario.controls['vigencia'].value,0)) {
                this.descTipoRev=element.descTipoRevolvencia;
            }
        });
        console.log(this.descTipoRev);
    }
    activar(){
        super.loading(true);
        let parametros={
            idPais: this.instSeleccionada.idPais,
            idInstitucion: this.instSeleccionada.idInstitucion,
            idEstructura: this.instSeleccionada.idEstructura,
            numCuenta: this.instSeleccionada.numCuenta,
            idTipoCobertura:  parseInt(this.formulario.controls['cobertura'].value,0),
            limiteGasto: parseFloat(this.formulario.controls['limiteGasto'].value),
            idBarrido: this.formulario.controls['barrido'].value,
            idTipoRev:  parseInt(this.formulario.controls['vigencia'].value,0),
            idEstrCon: parseInt(this.formulario.controls['consolidado'].value,0),
            idTipoComision:1,//parseInt(this.formulario.controls['comision'].value,0),
            comision: 0,//parseFloat(this.formulario.controls['montPor'].value),
            comisionTarj:9,//parseInt(this.formulario.controls['comisionTarjeta'].value,0) ,
            importeComTarj:0, //parseFloat(this.formulario.controls['tarifa'].value),
            descTipoRev:this.descTipoRev,
            opcion:this.formulario.controls['AgreModi'].value
        };
        /*let parametros={
            limiteGasto: 5000,
            idTipoRev: 1,
            idEstrCon: 1,
            idTipoComision:1,
            comisionTarj: 9,
            importeComTarj: 3000,
            idPais: this.instSeleccionada.idPais,
            idInstitucion: this.instSeleccionada.idInstitucion,
            idEstructura: this.instSeleccionada.idEstructura,
            numCuenta: this.instSeleccionada.numCuenta,
            //tipoRevolvencia: this.formulario.controls['comision'].value,
            //montoMaxOperar: this.formulario.controls['montPor'].value,
            numTarjeta: null,
            consolidada: this.formulario.controls['consolidado'].value,
            idCobertura:this.formulario.controls['cobertura'].value,
            idBarrido: this.formulario.controls['barrido'].value,
            idTipoCobertura:this.formulario.controls['transBarrido'].value,
            monto:this.formulario.controls['montPor'].value,
            limiteCobertura:1,
            tipoComision:this.formulario.controls['comision'].value,
            comision: this.formulario.controls['tarifa'].value
        };*/
        console.log(parametros);
        let uri="/cuentascentralizadas/cuentaprincipal/guarda/configuracion";
		this.service.post(parametros, uri, 3).subscribe(
			data => {
				let object = JSON.parse(JSON.stringify(data));
				console.log(object);
				if (object.codE === 0) {
					let objResponse: any = object.jsonResultado;
                        this.notifications.info("Aviso !!!",object.msgE);
                        //this.buscarCuentas({idPais:parametros.idPais,idInst:parametros.idInstitucion});
                        super.saveData(this.instCent,'institucionCent');
                        console.log(this.instCent);
                        if (this.comisionesModificadas.length===0) {
                            this.router.navigate(['centralizacion-cuentas/alta-cuentas-perifericas']);
                        } else {
                            this.agregarComision(parametros);
                        }
                        //
				}else {
					this.notifications.info("Aviso !!!",object.msgE);
				}
			},
			error => {
				this.notifications.error("Error !!!",error);
			},
			() => super.loading(false)
		);
	}
	comisionesDeTarjeta(comisionesTarjeta){
        console.log(comisionesTarjeta);
        this.rangeT="";
        this.comisionesModificadas.push({idTipoComision: comisionesTarjeta.idTipoComision, montoComision: comisionesTarjeta.valor});
    }
    comisionesF(comisiones){
        console.log(comisiones);
        this.rangeT="";
        this.comisionesModificadas.push({idTipoComision: comisiones.idComision, montoComision: comisiones.valor});
    }
    habilitar(e,item){
        if (e.target.checked) {
        }else{
        }
    }
    agregarComision(item){
        super.loading(true);
        let parametros={
            idPais: item.idPais,
            idInstitucion:item.idInstitucion,
            idEstructura: item.idEstructura,
            comisiones:this.comisionesModificadas
        };
        console.log(parametros);
        let uri="/cuentascentralizadas/comisiones/guarda/tipos/comision";
		this.service.post(parametros, uri, 3).subscribe(
			data => {
				let object = JSON.parse(JSON.stringify(data));
                console.log(object);
                
                if (object.codE === 0) {
					let objResponse: any = object.jsonResultado;
                        this.notifications.info("Aviso !!!",object.msgE);
                        //this.buscarCuentas({idPais:parametros.idPais,idInst:parametros.idInstitucion});
                        //super.saveData(this.instCent,'institucionCent');
                        //console.log(this.instCent);
                        this.router.navigate(['centralizacion-cuentas/alta-cuentas-perifericas']);
				}else {
					this.notifications.info("Aviso !!!",object.msgE);
				}
			},
			error => {
				this.notifications.error("Error !!!",error);
			},
			() => super.loading(false)
		);
    }
    comisiones(item){
        super.loading(true);
        let parametros={
            idPais: item.idPais,
            idInstitucion:item.idInstitucion,
            idEstructura: item.idEstructura
        };
        console.log(parametros);
        let uri="/cuentascentralizadas/cuentaprincipal/comisiones/cuenta";
		this.service.post(parametros, uri, 3).subscribe(
			data => {
				let object = JSON.parse(JSON.stringify(data));
                console.log(object);
                
				if (object.codE === 0) {
                    let objResponse: any = object.jsonResultado;
                    this.listaDocumento.listTipoComision.forEach(element => {
                        objResponse.listDatosComision.forEach(elementC => {
                            if(element.idComision===elementC.idTipoComision){
                                element.valor=elementC.montoComision;
                            }
                        });
                    });
                    this.listaDocumento.listTipoComTarj.forEach(element => {
                        objResponse.listDatosComisionTarjeta.forEach(elementC => {
                            if(element.idTipoComision===elementC.idTipoComision){
                                element.valor=elementC.montoComision;
                            }
                        });
                    });
				}else {
					this.notifications.info("Aviso !!!",object.msgE);
				}
			},
			error => {
				this.notifications.error("Error !!!",error);
			},
			() => super.loading(false)
		);
    }
    decimalTabla(com,event){
        let tecla = (document.all) ? event.keyCode : event.which;
        let patron = /[0-9]/;
        console.log(tecla);
        if( tecla === 8 || tecla === 46 ) {
            this.rangeT=this.rangeT.substr(0,this.rangeT.length-1);
            if (this.rangeT===0) {
                console.log("tecla");
                this.rangeT="";
            }
        }else{
            console.log(this.rangeT);
            if ((patron.test(String.fromCharCode(tecla))) || (tecla >= 96 && tecla <= 105) ) {
                console.log("entra");
                this.rangeT=this.rangeT+event.target.value.substr(event.target.value.length-1);
            }
        }
        console.log(this.rangeT);
        let decimal=this.rangeT*.01;
        let decimal2=decimal.toFixed(2);
        com.valor=decimal2;
        console.log(com.valor);
    }

}
