import {Component, AfterViewInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ClassGenerica} from '../../classGeneric/config';
import {Service} from '../../service/service';
import {Notifications} from '../../classGeneric/notifications';
import {FormControl} from '@angular/forms';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
@Component({
    selector: 'my-seguridad',
    styleUrls: ['templates/beneficios.css'],
    templateUrl: 'templates/beneficios.component.html',
})


export class BeneficiosComponent extends ClassGenerica {
    private titulos = ["Comercios", "Alta de Comercio", "Configuración de Promociones", "Asignación de Ofertas"];
    public titulo: String;
    public modalFormulario: boolean;
    public comerciosArray : any;
    institucionCtrl:FormControl;
    listaInstituciones: any;
    objFiltrosHandler: Object;
    institucion:any;
    formulario: FormGroup;
    jsonRequest:object;
    bandInst:boolean;
    tipoBusqueda:any;
    isAvailable:boolean;
    arrayInstituciones:any;
    
    constructor(private service: Service, private notifications: Notifications,private formBuilder: FormBuilder, private router: Router) {
        super();
        this.tipoBusqueda="";
        this.arrayInstituciones=[];
        this.titulo = this.titulos[0];
        this.isAvailable=false;
        this.modalFormulario = false;
        this.menuNavigation = this.menuNavigation();
        this.institucionCtrl = new FormControl();
        this.listaInstituciones = this.institucionCtrl.valueChanges.startWith(null).map(name => this.filtrarInstituciones(name));
        //this.buscar();
        this.objFiltrosHandler = {
			agrupamientoRequest: "INSTITUCION",
			anyoneSearchResult: false,
			institucionSelected: false
        };
        this.institucion=0;
        this.formulario = this.formBuilder.group({
            'institucion':[''],
			'nombreComercio': ['',[Validators.required]],
			'logo': [''],
        });
        this.jsonRequest={
            idInstitucion:null,
            idPais:null,
            nombreComercio:null,
            logo:""
        };
        this.bandInst=false;
        super.saveData("",'institucion');
        super.saveData("",'oferta');
    }

    private buscar(cadena: String) {
        var longCadena = cadena.length;

        if (longCadena > 2) {
            super.loading(true);
            let dataService = {"cadenaBusqueda": cadena};
            this.service.post(dataService, '/api/modulocupones/comercio/consulta', 3).subscribe(
                data => {
                    let object = JSON.parse(JSON.stringify(data));
                    console.log(object);
                    if (object.codE === 0) {
                        this.comerciosArray = object.jsonResultado;
                        console.log(object);
                    } else {
                        this.notifications.error(object.msgE);
                    }
                },
                error => {
                    this.notifications.error("Error en el callback");
                    console.log("error callback");
                },
                () => super.loading(false)
            );
        }else{
            this.comerciosArray=null;
        }
    }

    private openForm() {
        console.log("abrir formulario");
        this.modalFormulario = true;

    }
    private mostrarConfiguracion(seleccionado) {
        super.saveData(seleccionado,'comercio');
        console.log(super.getAttr('comercio'));
       this.router.navigate(['beneficios/configuracion']);
    }
    filtrarInstituciones(val: string) {
        let instituciones: any[] = [];
            if(val !== null && val !== undefined) {

                let _objFiltrosHandler: any = this.objFiltrosHandler;

                _objFiltrosHandler.anyoneSearchResult = false;

                if(val.length > 2) {

                    super.loading(true);

                    let objRequest = {cadenaBusqueda: val};

                    let uriRequest = "/api/modulocupones/comercio/consulta/institucion";

                    this.service.post(objRequest, uriRequest,3).subscribe(
                        data => {

                            let objServiceResponse: any = JSON.parse(JSON.stringify(data));

                            if (objServiceResponse.codE === 0) {

                                if(objServiceResponse.jsonResultado.length > 0) {

                                    for (let inst of objServiceResponse.jsonResultado) {
                                        console.log(objServiceResponse.jsonResultado);
                                        instituciones.push({name: inst.razonSocial,idInst: inst.idInstitucion,idPais: inst.idPais });
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

                this.objFiltrosHandler = _objFiltrosHandler;
            }else{
                this.institucion=0;
            }
        return instituciones;
    }
    getInstitucion(idInstitucion){
		this.institucion=idInstitucion;
        console.log(this.institucion);
        this.formulario.controls['nombreComercio'].setValue(this.institucion.name);
        this.jsonRequest = {
            idInstitucion: this.institucion.idInst,
            idPais: this.institucion.idPais,
            nombreComercio:this.formulario.controls['nombreComercio'].value,
            logo:""
        };
        this.bandInst=true;
        console.log(this.jsonRequest);
    }
    guardarComercio(){
		if(this.formulario.valid) {
            super.loading(true);
            if (!this.bandInst) {
                this.jsonRequest = {
                    idInstitucion: null,
                    idPais: null,
                    nombreComercio:this.formulario.controls['nombreComercio'].value,
                    logo:""
                };
            }
			let objRequest: any = this.jsonRequest;

			console.log(objRequest);

			let urlRequest: any = "/api/modulocupones/comercio/alta";

			this.service.post(objRequest, urlRequest, 3).subscribe(
	            data => {

	                let object = JSON.parse(JSON.stringify(data));
	                console.log(object);
	                if (object.codE === 0) {
                        this.notifications.success("Exito !!!",object.msgE);
                        
	                } else {
						this.notifications.info("Aviso !!!",object.msgE);
					}
	            },
	            error => {
	                this.notifications.error("Error !!!",error);
				},
				() => super.loading(false)
            );
        }
        this.closeForm();
    }
    closeForm(){
        this.formulario.controls['institucion'].setValue("");
        this.formulario.controls['nombreComercio'].setValue("");
        this.formulario.controls['logo'].setValue("");
        this.modalFormulario = false;
    }
    changeBusqueda(){
        if (this.tipoBusqueda==="") {
            this.isAvailable=false;
        }else{
            this.isAvailable=true;
        }
    }
    private buscarInst(cadena: String) {
        var longCadena = cadena.length;

        if (longCadena > 2) {
            super.loading(true);
            let dataService = {"cadenaBusqueda": cadena};
            this.service.post(dataService, '/api/modulocupones/comercio/consulta/institucion', 3).subscribe(
                data => {
                    let object = JSON.parse(JSON.stringify(data));
                    console.log(object);
                    if (object.codE === 0) {
                        this.arrayInstituciones = object.jsonResultado;
                        console.log(this.arrayInstituciones);
                    } else {
                        this.notifications.error(object.msgE);
                    }
                },
                error => {
                    this.notifications.error("Error en el callback");
                    console.log("error callback");
                },
                () => super.loading(false)
            );
        }else{
            this.comerciosArray=null;
        }
    }
    mostrarOfertasInst(seleccionado){
        super.saveData(seleccionado,'institucion');
        console.log(super.getAttr('institucion'));
       this.router.navigate(['beneficios/asignacion']);
    }
}