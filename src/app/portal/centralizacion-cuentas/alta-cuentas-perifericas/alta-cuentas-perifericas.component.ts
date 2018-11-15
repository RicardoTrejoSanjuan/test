import {Component, Output, EventEmitter} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ClassGenerica} from '../../../classGeneric/config';
import {Service} from '../../../service/service';
import {Notifications} from '../../../classGeneric/notifications';
import {FormControl} from '@angular/forms';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
import { PaginationFron } from '../../../classGeneric/paginationFront';
import { Pagination } from '../../../classGeneric/pagination';
import { DragulaService } from 'ng2-dragula';
import { DragulaModule } from 'ng2-dragula';
import { OnDestroy } from '@angular/core';
import 'rxjs/add/operator/takeUntil';
import {Subject} from 'rxjs/Subject';
import moment from 'moment';
import { log } from 'core-js/library/web/timers';
import {Cuentas} from './cuentas.component';
import {TreeView} from './tree-view.component';



@Component({
    selector: 'AltaCuentasPerifericas',
    styleUrls: [
        "../../mantenimiento/mantenimiento-instituciones/instituciones.component.css",
        "../../mesa-control/mesa-control.component.css",
        "../../depositos/alta-servicio-daz/alta.css"
      ],
    templateUrl: './alta-cuentas-perifericas.component.html'
})


export class AltaCuentasPerifericasComponent extends Pagination implements OnDestroy{
    private menuLateral: Array<Object>;
    modalCupones: boolean;
    pager: any = {};
    pagedItems: any[];
    pagerIns: any = {};
	pagedItemsIns: any[];
    color:any;
    numeroCuenta:any;
    configuracionCuentaBand:boolean;
    formulario: FormGroup;
    inst:any;
    insti:any;
    listaDocumento:any;
    bandIst:boolean;
	institucion:any;
    institucionCtrl:FormControl;
    institucionCuentasCtrl:FormControl;
    objFiltrosHandler:Object;
    objFiltrosHandlerCuentas:Object;
    listaInstituciones: any;
    instSeleccionada:any;
    listaInstitucionesCuentas:any;
    consolidada:any;
    private destroy$ = new Subject();
    instCent:any;
    cuentas: Array<Cuentas>;
    cuentaTemp: any;
    antigua:any;
    cuentaSelect:boolean=false;
    arrastrando:boolean=false;
    agregarElemento:boolean=false;
    tipoEstruc:any=0;
    cuentaPeriferica:any;
    nuevo=false;
    descTipoRev: string;
    numCuentaSelec:any;
    buscador:boolean;
    constructor(private service: Service, private notifications: Notifications,private formBuilder: FormBuilder, private router: Router, private paginationfronIns: PaginationFron, private paginationfron: PaginationFron, private dragulaService: DragulaService) {
        super();
        this.buscador=false;
        this.consolidada = 1;
        this.menuNavigation = this.menuNavigation(); 
        this.modalCupones=false;
        this.cuentaPeriferica=[];
        this.formulario = this.formBuilder.group({
            'limiteGasto': [0, [Validators.required]],
            'vigencia': ['0', [Validators.required]],
            'saldoCuebierto':['0', [Validators.required]],
            'numTarjeta': [{value: '', disabled: true}],
            'tipoLimiteGasto': [{value: '', disabled: true}],
            'vigenciaLimite': [{value: '', disabled: true}],
            'nombreEmpresa': [{value: '', disabled: true}],
            'nombreTiutlar': [{value: '', disabled: true}],
            'montoDisponible': [{value: '', disabled: true}],
            'montoRemanente': [{value: '', disabled: true}],
            'saldoPeriferico': [{value: '', disabled: true}],
            'saldoDisponible': [{value: '', disabled: true}],
            'vigenciaTarjeta': [{value: '', disabled: true}],
            'fechaApertura': [{value: '', disabled: true}],
            'estatusTarjeta': [{value: '', disabled: true}],
            'AgreModi': ['M', [Validators.required]]
        });
        this.institucionCuentasCtrl = new FormControl();
        this.listaInstitucionesCuentas = this.institucionCuentasCtrl.valueChanges.startWith(null).map(name => this.filtrarInstitucionesCuentas(name));
        this.consultarDocumento();
        this.listaDocumento={
            listTipoCobertura:[],
            listTipoComision:[],
            listTipoBarrido:[]
        };
        
        this.objFiltrosHandler = {
			agrupamientoRequest: "INSTITUCION",
			anyoneSearchResult: false,
			institucionSelected: false
        };
        this.objFiltrosHandlerCuentas = {
			agrupamientoRequest: "INSTITUCION",
			anyoneSearchResult: false,
			institucionSelected: false
        };
        this.bandIst=true; 
        this.institucionCtrl = new FormControl();
        this.instCent=super.getAttr('institucionCent');
        console.log(this.instCent);
        
        if(this.instCent){
            console.log(this.instCent);
            this.institucionCtrl.setValue(this.instCent.razonsocial);
            this.buscarCuentas({idPais:this.instCent.idPais,idInst:this.instCent.idInst,razonSocial:this.instCent.razonsocial});
        }
        dragulaService.drag.subscribe((value) => {
			console.log(`drag: ${value[0]}`);
			this.onDrag(value.slice(1));
		  });
		  dragulaService.drop.asObservable().takeUntil(this.destroy$).subscribe((value) => {
            console.log(`drop: ${value[0]}`);
			this.onDrop(value.slice(1));
		  });
		  dragulaService.over.subscribe((value) => {
            console.log(`over: ${value[0]}`);
           
			this.onOver(value.slice(1));
		  });
		  dragulaService.out.subscribe((value) => {
			console.log(`out: ${value[0]}`);
			this.onOut(value.slice(1));
          });
          

        //this.buscarCuentas();
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.arrastrando=false;
    }
    private onDrag(args) {
        let [e, el] = args;
        this.arrastrando=true;
        console.log(args[0].innerText=args[0].dataset.numCuenta);
	}
	  
	private onDrop(args) {
        if(this.agregarElemento){
            let [e, el, container] = args;
            console.log(container);
            console.log(args);
            let buscar = args[1].id;
            this.cuentaTemp=new Cuentas(args[0].dataset,null);
            console.log(this.cuentaTemp);
            this.cuentaTemp.toggle();
            //this.cuentaTemp.child=this._asignar(this.cuentaTemp.child,this.cuentaTemp);
            console.log(this.cuentaTemp);
            console.log(buscar);
            this.cuentaTemp.child=[];
            if (buscar===this.cuentas[0].numCuenta) {
                this.cuentas[0].child.push(this.cuentaTemp);
            }else{
                this.cuentas[0].addRecursive(this.cuentaTemp,buscar);
            }
            //this.cuentas[0].toggle();
            console.log(this.cuentas);
            //this.openForm();
            //this.seleccionar( this.cuentaTemp);
            this.arrastrando=false;
        }  
	}
	  
	private onOver(args) {
        let [e, el, container] = args;
        this.agregarElemento=true;
		// do something
	}
	  
	private onOut(args) {
	    let [e, el, container] = args;
		this.agregarElemento=false;
    }
    private openForm() {
        console.log("abrir formulario");
        this.modalCupones = true;
        this.cuentaSelect=false;

    }
    closeForm(){
        this.modalCupones = false;      
    }


    buscar(){
		this.listaInstituciones = this.filtrarInstituciones(this.institucionCtrl.value);
    }

    cargarArbol(cuenta) {
        super.loading(true);
        let params={
            cuentaMadre: cuenta.numCuenta
        };
        let path: string = '/cuentascentralizadas/cuentaprincipal/consestrucarbol';
        this.service.post(params, path, 3).subscribe(
          data => {
            let object = JSON.parse(JSON.stringify(data));
            if (object.codE === 0) {
                let _cuentas = new Cuentas(cuenta,null);
                console.log(_cuentas);
                let objRes=[];
                object.jsonResultado.forEach(element => {
                    console.log(element);
                    objRes.push({numCuenta:element.numCuentaHija});
                });
                _cuentas.child=this._asignar(objRes,_cuentas);
                //_cuentas.toggle();
                this.antigua=[object];
                this.cuentas=[_cuentas];
                console.log(this.cuentas);
                this.cuentas[0].toggle();
            } else {
              console.log("Error al obtener los datos");
            }
          }, error => {
            console.log("error del servidor");
          },
          () => super.loading(false)
        );
        
      }

      //creacion de nuevo arry de objetos Cuentas
      _asignar(object,todo){
          let element: any[]=[];
          if (object!==undefined) {
            console.log(object);
            for (var index = 0; index < object.length; index++) {
                element.push(new Cuentas(object[index],todo));
                if(element[index].child!==null){
                    element[index].child=this._asignar(element[index].child,element[index]);
                }
              
            }
          }
          return element;
      }

    buscarCuentas(inst){
        console.log(inst);
        this.inst=inst.razonSocial; 
        this.numeroCuenta={
            idPais: inst.idPais,
            idInstitucion: inst.idInst
        };
        this.listaInstituciones=[];
        console.log(inst);
        super.loading(true);
        let uri="/cuentascentralizadas/cuentasperifericas/consulta/cuentas";
		this.service.post( this.numeroCuenta, uri, 3).subscribe(
			data => {
				let object = JSON.parse(JSON.stringify(data));
				console.log(object);
				if (object.codE === 0) {
					let objResponse: any = object.jsonResultado;
					if(objResponse !== null && objResponse.length !== 0) {
						console.log(objResponse,"aqui");
						this.pager = this.paginationfron.getPager(object.jsonResultado.length, 1, 50);
                        this.pagedItems = this.paginationfron.getPagerdata(object.jsonResultado);
                        this.pagerIns= {};
                        this.pagedItemsIns=[];
                        this.cuentas=[];
                        this.configuracionCuentaBand=false;
                        this.nuevo=false;
                        this.cuentaSelect=false;
						console.log(this.pager,"aqui");
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
    consultarDocumento() {
        super.loading(true);
        let objRequest: any = { };
        let urlRequest: any = "/cuentascentralizadas/cuentasperifericas/catalogos/limitegasto";
        this.service.post(objRequest, urlRequest, 3).subscribe(
            data => {

                let object = JSON.parse(JSON.stringify(data));
                if (object.codE === 0) {
                    let objResponse: any = object.jsonResultado;
                    this.listaDocumento = objResponse;
                    console.log(this.listaDocumento);
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

					let objRequest = {institucion: val};

					let uriRequest = "/cuentascentralizadas/cuentasperifericas/consulta/institucion";

					this.service.post(objRequest, uriRequest,3).subscribe(
						data => {

							let objServiceResponse: any = JSON.parse(JSON.stringify(data));
							console.log(objServiceResponse);
							if (objServiceResponse.codE === 0) {

								if(objServiceResponse.jsonResultado.length > 0) {

									for (let inst of objServiceResponse.jsonResultado) {
										console.log(objServiceResponse.jsonResultado);
										instituciones.push({razonSocial: inst.razonSocial,idInst: inst.idInstitucion,idPais: inst.idPais, rfc: inst.rfc });
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
      seleccionar(item){
            console.log(this.instSeleccionada);
            console.log(item);
            
            this.cuentaSelect=true;
            this.numCuentaSelec=item;
            //this.cuentaPeriferica=item;
            //this.instSeleccionada=item;
            //this.color=item.numCuenta;
            //this.cargarArbol(item);
            this.formulario.controls['limiteGasto'].setValue(this.instSeleccionada.limiteGasto);
            
            if (item.idTipoRevolvencia===null) {
                this.formulario.controls['vigencia'].setValue(this.instSeleccionada.idTipoRevolvencia);
            }else{
                this.formulario.controls['vigencia'].setValue(item.idTipoRevolvencia);
            }
            if (item.idEstaus===0) {
                this.formulario.controls['limiteGasto'].setValue(this.instSeleccionada.limiteGasto);
            }else{
                this.formulario.controls['limiteGasto'].setValue(item.limiteGasto);
            }
            
            if (item.estructuraConsolidada===null) {
                this.formulario.controls['saldoCuebierto'].setValue(this.instSeleccionada.estructuraConsolidada);
            }else{
                this.formulario.controls['saldoCuebierto'].setValue(item.estructuraConsolidada);
            }
            this.formulario.controls['numTarjeta'].setValue(item.numTarjeta);
            //this.formulario.controls['tipoLimiteGasto'].setValue(item.idTipoRevolvencia);
            this.formulario.controls['vigenciaLimite'].setValue(item.progVigenciaLimite);
            this.formulario.controls['nombreEmpresa'].setValue(item.nombreEmpresa);
            this.formulario.controls['nombreTiutlar'].setValue(item.nombreTitular.replace(/   /g,""));
            this.formulario.controls['montoDisponible'].setValue(item.montoDisponible.trim());
            this.formulario.controls['montoRemanente'].setValue(item.montoRemanente.trim());
            this.formulario.controls['saldoPeriferico'].setValue(item.saldoPeriferico.trim());
            this.formulario.controls['saldoDisponible'].setValue(item.saldoDisponible.trim());
            this.formulario.controls['vigenciaTarjeta'].setValue(item.vigencia);
            this.formulario.controls['fechaApertura'].setValue(item.fecha);
            this.formulario.controls['estatusTarjeta'].setValue(item.estatusTarjeta);
            this.listaDocumento.listLimiteVigGasto.forEach(element => {
                if (element.idTipoRevolvencia===parseInt(this.formulario.controls['vigencia'].value,0)) {
                    this.descTipoRev=element.descTipoRevolvencia;
                }
            });
            console.log(this.descTipoRev);
            /*super.loading(true);
            let objRequest: any = {numCuenta: item.numCuenta};
            let urlRequest: any = "/cuentascentralizadas/cuentaprincipal/consctaperiferica";
            this.service.post(objRequest, urlRequest, 3).subscribe(
                data => {
                    let object = JSON.parse(JSON.stringify(data));
                    if (object.codE === 0) {
                        let objResponse: any = object.jsonResultado[0];
                        console.log(objResponse);
                        console.log(this.listaDocumento);
                        console.log(object);
                        this.formulario.controls['limiteGasto'].setValue(item.monto);
                        this.formulario.controls['vigencia'].setValue(item.idLimiteCobertura);
                        this.formulario.controls['saldoCuebierto'].setValue(item.individualSaldoCub);
                        this.formulario.controls['numTarjeta'].setValue(item.numTarjeta);
                        this.formulario.controls['tipoLimiteGasto'].setValue(item.idTipoRevolvencia);
                        this.formulario.controls['vigenciaLimite'].setValue(item.progVigenciaLimite);
                        this.formulario.controls['nombreEmpresa'].setValue(item.nombreEmpresa);
                        this.formulario.controls['nombreTiutlar'].setValue(item.nombreTitular);
                        this.formulario.controls['montoDisponible'].setValue(item.montoDisponible);
                        this.formulario.controls['montoRemanente'].setValue(item.montoRemanente);
                        this.formulario.controls['saldoPeriferico'].setValue(item.saldoPeriferico);
                        this.formulario.controls['saldoDisponible'].setValue(item.saldoDisponible);
                        this.formulario.controls['vigenciaTarjeta'].setValue(item.vigencia);
                        this.formulario.controls['fechaApertura'].setValue(item.fech);
                    } else {
                        this.notifications.info("Aviso !!!", object.msgE);
                    }
                },
                error => {
                    this.notifications.error("Error !!!", error);
                },
                () => super.loading(false)
            );*/
      }
    consultarCuentas(item){
        console.log(item);
        this.tipoEstruc=item.idTipoEstruc;
        this.instSeleccionada=item;
        for (let index = 0; index <  this.listaDocumento.listLimiteVigGasto.length; index++) {
            console.log(this.listaDocumento.listLimiteVigGasto[index].idTipoRevolvencia);
            if (this.listaDocumento.listLimiteVigGasto[index].idTipoRevolvencia===this.instSeleccionada.idTipoRevolvencia) {
                console.log(this.instSeleccionada.idTipoRevolvencia);
                this.instSeleccionada.descTipoRevolvencia=this.listaDocumento.listLimiteVigGasto[index].descTipoRevolvencia;
            }
        }
        console.log(this.instSeleccionada);
        this.color=item.numCuenta;
        this.configuracionCuentaBand=true;
        let parametros={
            numCuenta:item.numCuenta
        };
        this.cuentas=[new Cuentas(item,null)];
        super.loading(true);
        console.log(parametros);
        let uri="/cuentascentralizadas/cuentasperifericas/consultactas/linea";
		this.service.post(parametros, uri, 3).subscribe(
			data => {
				let object = JSON.parse(JSON.stringify(data));
				let objResponse: any = object.jsonResultado;
				if (object.codE === 0 && objResponse.length!==0) {
                    this.nuevo=true;
                    objResponse=objResponse.filter((item: any) => {
                        if (item.cuentaPeriferica !== null) {
                            return item; 
                        }
                    });
                    console.log(objResponse,"aqui");
                    if(this.tipoEstruc!==2){
                    this.pagerIns = this.paginationfronIns.getPager(objResponse.length, 1, 50);
                    this.pagedItemsIns = this.paginationfronIns.getPagerdata(objResponse);
                }
                    

                    objResponse.forEach(element => {
                        element.limiteGasto=this.formatter(element.limiteGasto.trim());
                        element.montoDisponible=this.formatter(element.montoDisponible.trim());
                        element.montoRemanente=this.formatter(element.montoRemanente.trim());
                        element.saldoDisponible=this.formatter(element.saldoDisponible.trim());
                        element.saldoPeriferico=this.formatter(element.saldoPeriferico.trim());
                        element.vigencia=element.vigencia.trim();
                        if (element.vigencia==="M") {
                            element.vigencia="Mensual";
                        }
                        if (element.vigencia==="D") {
                            element.vigencia="Diaria";
                        }
                        if (element.vigencia==="P") {
                            element.vigencia="Permanente";
                        }
                        if (element.vigencia==="Q") {
                            element.vigencia="Quincenal";
                        }
                        if (element.vigencia==="S") {
                            element.vigencia="Semanal";
                        }
                    });;
                    this.cuentas[0].child=this._asignar(objResponse,this.cuentas);
                    this.antigua=[objResponse];
                    this.cuentas=[this.cuentas[0]];
                    console.log(this.cuentas);
                    this.cuentas[0].toggle();
					
				}else {
                    this.notifications.info("Aviso !!!",object.msgE);
                    super.loading(false);
				}
			},
			error => {
                this.notifications.error("Error !!!",error);
                super.loading(false);
			},
			() => this.consultarCuentasPerifericas(this.instSeleccionada.numCuenta)
        );
    }
    consultarCuentasPerifericas(item){
        let parametros={
            numCuenta:item
        };
        super.loading(true);
        console.log(parametros);
        let uri="/cuentascentralizadas/cuentasperifericas/consctaperiferica";
		this.service.post(parametros, uri, 3).subscribe(
			data => {
				let object = JSON.parse(JSON.stringify(data));
				let objResponse: any = object.jsonResultado;
				if (object.codE === 0 && objResponse.length!==0) {
                    console.log(objResponse);
                    for (let index = 0; index < objResponse.length; index++) {
                        this.comparar(objResponse[index],this.cuentas);
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
    comparar(comparacion,cuentas){
        for (let index = 0; index < cuentas.length; index++) {
                if(cuentas[index].numCuenta===comparacion.numCuenta){
                        cuentas[index].limiteGasto;
                        cuentas[index].estructuraConsolidada=comparacion.estructuraConsolidada;
                        cuentas[index].idTipoRevolvencia=comparacion.idTipoRevolvencia;
                        cuentas[index].limiteGasto=comparacion.limiteGasto;
                        cuentas[index].idEstaus=comparacion.idEstaus;
                }else{
                    if (cuentas[index].child!=null) {
                        this.comparar(comparacion,cuentas[index].child);
                    }
                }
            
        }
    }
    setPageInst(page: number, rango?: number, total?: number) {
        if (page < 1 || page > this.pagerIns.totalPages) {
            return;
        }
        this.pagerIns = this.paginationfronIns.getPager(total, page, rango);
        this.pagedItemsIns = this.paginationfronIns.getPagerdata([], page);
	}

      agregar(heredar){
        super.loading(true); 
        let parametros:any;
        if (!heredar) {
            this.listaDocumento.listLimiteVigGasto.forEach(element => {
                if (element.idTipoRevolvencia===parseInt(this.formulario.controls['vigencia'].value,0)) {
                    this.descTipoRev=element.descTipoRevolvencia;
                }
            });
            
            this.cuentaPeriferica.push({numCuenta:this.numCuentaSelec.numCuenta,numTarjetaAsociada:this.formulario.controls['numTarjeta'].value,aliastarj:"alias",titular:this.formulario.controls['nombreTiutlar'].value,opcion:"M"});
            parametros={
                idPais:this.instSeleccionada.idPais,
                idInstitucion:this.instSeleccionada.idInstitucion,
                cuentas:this.cuentaPeriferica,
                idEstructura:this.instSeleccionada.idEstructura,        
                idPaisM:this.instSeleccionada.idPais,            
                idInstitucionM:this.instSeleccionada.idInstitucion,                 
                limiteGasto:parseFloat(this.formulario.controls['limiteGasto'].value),
                idVigLimiteGasto:parseInt(this.formulario.controls['vigencia'].value,0), //----idTipoRevolvencia  
                idSaldoCub:this.formulario.controls['saldoCuebierto'].value,
                descLimiteGasto:this.descTipoRev,
                numCuentaM:this.instSeleccionada.numCuenta
            };
        }else{
            this.listaDocumento.listLimiteVigGasto.forEach(element => {
                if (element.idTipoRevolvencia===parseInt(this.instSeleccionada.idTipoRevolvencia,0)) {
                    this.descTipoRev=element.descTipoRevolvencia;
                }
            });
            parametros={ 
                idPais:this.instSeleccionada.idPais,
                idInstitucion:this.instSeleccionada.idInstitucion,
                cuentas:this.cuentaPeriferica,
                idEstructura:this.instSeleccionada.idEstructura,        
                idPaisM:this.instSeleccionada.idPais,            
                idInstitucionM:this.instSeleccionada.idInstitucion,                 
                limiteGasto:this.instSeleccionada.limiteGasto,
                idVigLimiteGasto:this.instSeleccionada.idTipoRevolvencia, 
                idSaldoCub:this.instSeleccionada.estructuraConsolidada,
                descLimiteGasto:this.descTipoRev,
                numCuentaM:this.instSeleccionada.numCuenta
            };
        }
        console.log(parametros);
        let uri="/cuentascentralizadas/cuentasperifericas/guarda/cuentas";
		this.service.post(parametros, uri, 3).subscribe(
			data => {
				let object = JSON.parse(JSON.stringify(data));
				console.log(object);
				if (object.codE === 0) {
					let objResponse: any = object.jsonResultado;
                        this.notifications.info("Aviso !!!",object.msgE);
                        this.formulario.controls['AgreModi'].setValue(0);
				}else {
                    this.notifications.info("Aviso !!!",object.msgE);
                    super.loading(false);
				}
			},
			error => {
                this.notifications.error("Error !!!",error);
                super.loading(false);
			},
			() => this.consultarCuentas(this.instSeleccionada)
        );
        this.cuentaSelect=false;
        this.closeForm();
        this.cuentaPeriferica=[];
        //this.cuentas[0].toggle();*/
    }
    heredar(){
        let cuentas=this.cuentas[0].child;
        console.log(cuentas);
        let opcion="";
        for (let index = 0; index < cuentas.length; index++) {
            if (cuentas[index].chk) {
                if (cuentas[index].idEstaus===1) {
                    opcion='M';
                }
                if (cuentas[index].idEstaus===0) {
                    opcion='A';
                }
                this.cuentaPeriferica.push({numCuenta:cuentas[index].cuentaPeriferica,numTarjetaAsociada:cuentas[index].numTarjeta,aliastarj:"alias",titular:cuentas[index].nombreTitular,opcion:"M"});
            }
        }
        this.agregar(true);
        console.log(this.cuentaPeriferica);
    }

    formatter(y) {
        
        let separado: any[]=[];

        var number1 = y+'', result = '';

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
    
    filtrarInstitucionesCuentas(val: string) {
        let instituciones: any[] = [];
            if(val !== null && val !== undefined && !this.buscador) {

                let _objFiltrosHandler: any = this.objFiltrosHandlerCuentas;

                _objFiltrosHandler.anyoneSearchResult = false;

                if(val.length > 2) {

                    super.loading(true);

                    let objRequest = {institucion: val};

                    let uriRequest = "/cuentascentralizadas/altaserv/coninstitucion";

                    this.service.post(objRequest, uriRequest,3).subscribe(
                        data => {

                            let objServiceResponse: any = JSON.parse(JSON.stringify(data));

                            if (objServiceResponse.codE === 0) {

                                if(objServiceResponse.jsonResultado.length > 0) {

                                    for (let inst of objServiceResponse.jsonResultado) {
                                        console.log(objServiceResponse.jsonResultado);
                                        instituciones.push({name: inst.razonSocial,idInst: inst.idInstitucion,idPais: inst.idPais, rfc: inst.rfc, idAlnova: inst.idClienteAlnova, idBea: inst.idClienteBea });
                                    }

                                } else {
                                    _objFiltrosHandler.anyoneSearchResult = true;
                                    _objFiltrosHandler.institucionSelected = false;
                                    this.notifications.info('No se encontraron coincidencias de instituciones');
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

                this.objFiltrosHandlerCuentas = _objFiltrosHandler;
            }else{
                this.institucion=0;
            }
        return instituciones;
    }
    buscarCuentasInst(inst){
		this.buscador=true;
        this.insti=inst;
        console.log( this.insti);
		this.listaInstituciones=[];
		super.loading(true);
		let objRequest = {
			idPais: inst.idPais,
			idInst: inst.idInst,
			//idEstructura: this.estructuraCtrl.value,
			//razonsocial: this.inst.name,
			//rfc: this.inst.rfc,
			//idclientealn: this.inst.idAlnova,
			//idclientebea: this.inst.idBea,
		};
		console.log(objRequest);
        let uri="/cuentascentralizadas/altaserv/conxinstctalnova";
		this.service.post(objRequest, uri, 3).subscribe(
			data => {
				let object = JSON.parse(JSON.stringify(data));
				console.log(object);
				if (object.codE === 0) {
					let objResponse: any = object.jsonResultado;
					if(objResponse !== null || objResponse.length !== 0) {
						console.log(objResponse,"aqui");
						/*let quitados=this.quitarInst(object.jsonResultado);
						if (quitados.length===0) {
							this.notifications.info("Aviso !!!","No se encontraron cuentas para esta institución");
						}*/
                        this.pagerIns = this.paginationfronIns.getPager(objResponse.length, 1, 50);
                        this.pagedItemsIns = this.paginationfronIns.getPagerdata(objResponse);
                        console.log(this.pager,"aqui");
                        this.buscador=false;
						/*this.notifications.success("Exito !!!",object.msgE);+*/
					} else {
                        this.notifications.info("Aviso !!!","La respuesta fue correcta, pero vacia !!!");
                        this.buscador=false;
					}
					
				}else {
                    this.notifications.info("Aviso !!!",object.msgE);
                    this.buscador=false;
				}
			},
			error => {
                this.notifications.error("Error !!!",error);
                this.buscador=false;
			},
			() => super.loading(false)
        );
        
    }
    
}
