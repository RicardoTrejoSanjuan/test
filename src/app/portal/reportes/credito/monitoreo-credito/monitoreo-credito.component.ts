import {Component,OnInit,OnDestroy,ViewChild,ElementRef} from '@angular/core';
import {Service} from '../../../../service/service';
import {ClassGenerica} from '../../../../classGeneric/config';
import { Notifications } from '../../../../classGeneric/notifications';

@Component({
	selector: 'monitoreo-credito',
	templateUrl: 'monitoreo-credito.component.html',
	styleUrls: ['monitoreo-credito.component.css']
})

export class MonitoreoCreditoComponent extends ClassGenerica implements OnInit {

	menuLateral: Array<Object>;

	t: any;
	seno: any;
	coseno: any;

	canvasSphereWidth: any;
	canvasCilinderWidth: any;
	canvasHeight: any;

	timeoutCambiarValores: any;
	timeoutObtenerValores: any;
	timeoutMostrarEsferas: any;

  	contextSphere: CanvasRenderingContext2D;
  	contextCilinder: CanvasRenderingContext2D;

  	objPerfilamiento: any = {};
  	copiaObjPerfilamiento: any = {};

  	objResponse: any = {};

  	@ViewChild("sphere") sphere;
  	@ViewChild("cilinder") cilinder;

  	@ViewChild("ballTopStart") ballTop: ElementRef;
  	@ViewChild("ballBottomStart") ballBottom: ElementRef;
  	@ViewChild("ballMiddleStart") ballMiddle: ElementRef;

  	@ViewChild("ballMiddleCenter") ballMiddleCenter: ElementRef;
  	@ViewChild("ballMiddleEnd") ballMiddleEnd: ElementRef;

	constructor(private service: Service,private notifications: Notifications) {
		super();
        this.menuLateral = this.getMenuLateral(1);
        this.menuNavigation = this.menuNavigation();
	}

	ngOnInit() {

		this.t = 0;
        this.seno = Math.sin;
        this.coseno = Math.cos;

        let perfilamientoData: any = {
        	totalSolicitudes: null,
        	solicitudesTasa: null,
        	solicitudesPerfilamiento: null,
        	solicitudesOtorgadas: null
        };

        this.objPerfilamiento = {
        	nominaBig: JSON.parse(JSON.stringify(perfilamientoData)),
        	pensionados: JSON.parse(JSON.stringify(perfilamientoData)),
        	portabilidad: JSON.parse(JSON.stringify(perfilamientoData)),
        	rechazadosPerfilamiento: null,
        	rechazadosTasa: null,
        	totalOtorgados: null,
        	totalGeneralSolicitudes: null
        };

        this.objResponse = null;

        /*this.objResponse = {
			codE:0,
			jsonResultado: [
				{
					categoria:"PORTABILIDAD DE NÓMINA",
					idInstitucion:5383,
					idPais:1,
					nombreComercial:"BAZ PORTABILIDAD NOMINA",
					totaBuro:72,
					totalCredito:27,
					totalPerfilamiento:72,
					totalRBuroPerfil:6,
					totalRTasa:41,
					totalSolicitud:74,
					totalTasa:68
				},
				{
					categoria:"NÓMINA BIG",
					idInstitucion:5383,
					idPais:1,
					nombreComercial:"BAZ PORTABILIDAD NOMINA",
					totaBuro:72,
					totalCredito:27,
					totalPerfilamiento:72,
					totalRBuroPerfil:6,
					totalRTasa:41,
					totalSolicitud:74,
					totalTasa:68
				},
				{
					categoria:"PENSIONADOS",
					idInstitucion:5383,
					idPais:1,
					nombreComercial:"BAZ PORTABILIDAD NOMINA",
					totaBuro:72,
					totalCredito:27,
					totalPerfilamiento:72,
					totalRBuroPerfil:6,
					totalRTasa:41,
					totalSolicitud:74,
					totalTasa:68
				}
			],
			msgE:"CORRECTO",
			salt:"04-08-2017 12:00:00"
		};*/


        this.canvasSphereWidth=820; this.canvasHeight=620; this.canvasCilinderWidth=500;

    	this.contextSphere = this.sphere.nativeElement.getContext("2d");
    	this.contextCilinder = this.cilinder.nativeElement.getContext("2d");

		this.dibujarEsfera();
		this.dibujarCilindro();
		this.obtenerDatosMonitoreo();
		/*this.distribuirSolicitudes();*/
	}

	ngOnDestroy() {
		clearTimeout(this.timeoutMostrarEsferas);
		clearTimeout(this.timeoutObtenerValores);
		/*clearTimeout(this.timeoutCambiarValores);*/
	}

	obtenerDatosMonitoreo() {

		super.loading(true);

		let objRequest: any = {
			fechaInicio: null,
			fechaFin: null
		};

		let urlRequest: any = "/AsesorBig/api/interno/matenimiento/grafica/consulta/general";

		this.service.post(objRequest,urlRequest,1).subscribe(
			success => {

				this.objResponse = JSON.parse(JSON.stringify(success));

				if(this.objResponse.codE === 0) {
					this.distribuirSolicitudes();
					this.notifications.success('Monitoreo de creditos', this.objResponse.msgE);
				}else {
					this.notifications.info('Monitoreo de creditos', this.objResponse.msgE);
				}
			},
			failure => {
				this.notifications.error('Monitoreo de creditos', failure);
			},
			() => super.loading(false)
		);

		this.timeoutObtenerValores = setTimeout(() => {
			this.copiaObjPerfilamiento = JSON.parse(JSON.stringify(this.objPerfilamiento));
			console.log("Copia objeto manejador -> ",this.copiaObjPerfilamiento);
			this.obtenerDatosMonitoreo();
		},300000);		
	}

	distribuirSolicitudes() {

		if(super.isValid(this.objResponse)) {

			if(this.objResponse.jsonResultado !== null && this.objResponse.jsonResultado.length > 0) {

				for(let obj of this.objResponse.jsonResultado) {

					switch (obj.categoria) {
						case "NÓMINA BIG":
							this.objPerfilamiento.nominaBig.totalSolicitudes = obj.totalSolicitud;
							this.objPerfilamiento.nominaBig.solicitudesPerfilamiento = obj.totalRBuroPerfil;
							this.objPerfilamiento.nominaBig.solicitudesTasa = obj.totalRTasa;
							this.objPerfilamiento.nominaBig.solicitudesOtorgadas = obj.totalCredito;
							break;
						case "PENSIONADOS":
							this.objPerfilamiento.pensionados.totalSolicitudes = obj.totalSolicitud;
							this.objPerfilamiento.pensionados.solicitudesPerfilamiento = obj.totalRBuroPerfil;
							this.objPerfilamiento.pensionados.solicitudesTasa = obj.totalRTasa;
							this.objPerfilamiento.pensionados.solicitudesOtorgadas = obj.totalCredito;
							break;
						case "PORTABILIDAD DE NÓMINA":
							this.objPerfilamiento.portabilidad.totalSolicitudes = obj.totalSolicitud;
							this.objPerfilamiento.portabilidad.solicitudesPerfilamiento = obj.totalRBuroPerfil;
							this.objPerfilamiento.portabilidad.solicitudesTasa = obj.totalRTasa;
							this.objPerfilamiento.portabilidad.solicitudesOtorgadas = obj.totalCredito;
							break;
						
						default:
							// code...
							break;
					}
				}

				this.objPerfilamiento.rechazadosPerfilamiento = this.objPerfilamiento.nominaBig.solicitudesPerfilamiento+this.objPerfilamiento.pensionados.solicitudesPerfilamiento+this.objPerfilamiento.portabilidad.solicitudesPerfilamiento;
				this.objPerfilamiento.rechazadosTasa = this.objPerfilamiento.nominaBig.solicitudesTasa+this.objPerfilamiento.pensionados.solicitudesTasa+this.objPerfilamiento.portabilidad.solicitudesTasa;
				this.objPerfilamiento.totalOtorgados = this.objPerfilamiento.nominaBig.solicitudesOtorgadas+this.objPerfilamiento.pensionados.solicitudesOtorgadas+this.objPerfilamiento.portabilidad.solicitudesOtorgadas;
				this.objPerfilamiento.totalGeneralSolicitudes = this.objPerfilamiento.nominaBig.totalSolicitudes+this.objPerfilamiento.pensionados.totalSolicitudes+this.objPerfilamiento.portabilidad.totalSolicitudes;
				// Se evalua si el objeto de copia de la respuesta de la consulta contiene los atributos siguientes
				if(this.copiaObjPerfilamiento.rechazadosPerfilamiento && this.copiaObjPerfilamiento.rechazadosTasa && this.copiaObjPerfilamiento.totalOtorgados && this.copiaObjPerfilamiento.totalGeneralSolicitudes) {// Inicia if que comprueba si existen las propiedades en el objeto
					
					
					let totalSolicitudesNominaBig_actual: any = this.objPerfilamiento.nominaBig.totalSolicitudes;
					let totalSolicitudesNominaBig_anterior: any = this.copiaObjPerfilamiento.nominaBig.totalSolicitudes;
					let diferenciaSolicitudesNominaBig: any = totalSolicitudesNominaBig_actual - totalSolicitudesNominaBig_anterior;
					/* Se devuelve el numero de solicitudes de nomina big que se tenia al comienzo*/
					this.objPerfilamiento.nominaBig.totalSolicitudes = totalSolicitudesNominaBig_anterior;

					let totalSolicitudesPensionados_actual: any = this.objPerfilamiento.pensionados.totalSolicitudes;
					let totalSolicitudesPensionados_anterior: any = this.copiaObjPerfilamiento.pensionados.totalSolicitudes;
					let diferenciaSolicitudesPensionados: any = totalSolicitudesPensionados_actual - totalSolicitudesPensionados_anterior;
					/* Se devuelve el numero de solicitudes de pensionados que se tenia al comienzo*/
					this.objPerfilamiento.pensionados.totalSolicitudes = totalSolicitudesPensionados_anterior;


					let totalSolicitudesPortabilidad_actual: any = this.objPerfilamiento.portabilidad.totalSolicitudes;
					let totalSolicitudesPortabilidad_anterior: any = this.copiaObjPerfilamiento.portabilidad.totalSolicitudes;
					let diferenciaSolicitudesPortabilidad: any = totalSolicitudesPortabilidad_actual - totalSolicitudesPortabilidad_anterior;
					/* Se devuelve el numero de solicitudes de portabilidad que se tenia al comienzo*/
					this.objPerfilamiento.portabilidad.totalSolicitudes = totalSolicitudesPortabilidad_anterior;


					/* Solicitudes de perfilamiento en las tres categorias (NominaBig,Pensionados y Portabilidad)*/

					let perfilamientoNominaBig_actual: any = this.objPerfilamiento.nominaBig.solicitudesPerfilamiento;
					let perfilamientoNominaBig_anterior: any = this.copiaObjPerfilamiento.nominaBig.solicitudesPerfilamiento;
					let diferenciaPerfilamientoNominaBig: any = perfilamientoNominaBig_actual - perfilamientoNominaBig_anterior;

					let perfilamientoPensionados_actual: any = this.objPerfilamiento.pensionados.solicitudesPerfilamiento;
					let perfilamientoPensionados_anterior: any = this.copiaObjPerfilamiento.pensionados.solicitudesPerfilamiento;
					let diferenciaPerfilamientoPensionados: any = perfilamientoPensionados_actual - perfilamientoPensionados_anterior;

					let perfilamientoPortabilidad_actual: any = this.objPerfilamiento.portabilidad.solicitudesPerfilamiento;
					let perfilamientoPortabilidad_anterior: any = this.copiaObjPerfilamiento.portabilidad.solicitudesPerfilamiento;
					let diferenciaPerfilamientoPortabilidad: any = perfilamientoPortabilidad_actual - perfilamientoPortabilidad_anterior;


					/* Solicitudes de tasa en las tres categorias (NominaBig,Pensionados y Portabilidad)*/

					let tasaNominaBig_actual: any = this.objPerfilamiento.nominaBig.solicitudesTasa;
					let tasaNominaBig_anterior: any = this.copiaObjPerfilamiento.nominaBig.solicitudesTasa;
					let diferenciaTasaNominaBig: any = tasaNominaBig_actual - tasaNominaBig_anterior;

					let tasaPensionados_actual: any = this.objPerfilamiento.pensionados.solicitudesTasa;
					let tasaPensionados_anterior: any = this.copiaObjPerfilamiento.pensionados.solicitudesTasa;
					let diferenciaTasaPensionados: any = tasaPensionados_actual - tasaPensionados_anterior;

					let tasaPortabilidad_actual: any = this.objPerfilamiento.portabilidad.solicitudesTasa;
					let tasaPortabilidad_anterior: any = this.copiaObjPerfilamiento.portabilidad.solicitudesTasa;
					let diferenciaTasaPortabilidad: any = tasaPortabilidad_actual - tasaPortabilidad_anterior;


					/* Solicitudes de otrogados en las tres categorias (NominaBig,Pensionados y Portabilidad)*/

					let otorgadosNominaBig_actual: any = this.objPerfilamiento.nominaBig.solicitudesOtorgadas;
					let otorgadosNominaBig_anterior: any = this.copiaObjPerfilamiento.nominaBig.solicitudesOtorgadas;
					let diferenciaotorgadosNominaBig: any = otorgadosNominaBig_actual - otorgadosNominaBig_anterior;

					let otorgadosPensionados_actual: any = this.objPerfilamiento.pensionados.solicitudesOtorgadas;
					let otorgadosPensionados_anterior: any = this.copiaObjPerfilamiento.pensionados.solicitudesOtorgadas;
					let diferenciaotorgadosPensionados: any = otorgadosPensionados_actual - otorgadosPensionados_anterior;

					let otorgadosPortabilidad_actual: any = this.objPerfilamiento.portabilidad.solicitudesOtorgadas;
					let otorgadosPortabilidad_anterior: any = this.copiaObjPerfilamiento.portabilidad.solicitudesOtorgadas;
					let diferenciaotorgadosPortabilidad: any = otorgadosPortabilidad_actual - otorgadosPortabilidad_anterior;


					// Inicia if totalGeneralSolicitudes
					if(this.objPerfilamiento.totalGeneralSolicitudes > this.copiaObjPerfilamiento.totalGeneralSolicitudes) {

						/* Se asigna como nuevo valor el numero de solicitudes del ciclo anterior*/
						this.objPerfilamiento.totalGeneralSolicitudes = this.copiaObjPerfilamiento.totalGeneralSolicitudes;
						
						if(totalSolicitudesNominaBig_actual > totalSolicitudesNominaBig_anterior) {

							console.log("[Total][NominaBig] {anterior: "+totalSolicitudesNominaBig_anterior+",actual: "+totalSolicitudesNominaBig_actual+",diferencia: "+diferenciaSolicitudesNominaBig+"}");

							for(let index = 1; index <= diferenciaSolicitudesNominaBig; index++) {
								this.mostrarSolicitudesNuevas(index, 'NOMINABIG');
							}
						}

						if(totalSolicitudesPensionados_actual > totalSolicitudesPensionados_anterior) {

							console.log("[Total][Pensionados] {anterior: "+totalSolicitudesPensionados_anterior+",actual: "+totalSolicitudesPensionados_actual+",diferencia: "+diferenciaSolicitudesPensionados+"}");

							for(let index = 1; index <= diferenciaSolicitudesPensionados; index++) {
								this.mostrarSolicitudesNuevas(index, 'PENSIONADOS');
							}
						}

						if(totalSolicitudesPortabilidad_actual > totalSolicitudesPortabilidad_anterior) {

							console.log("[Total][Portabilidad] {anterior: "+totalSolicitudesPortabilidad_anterior+",actual: "+totalSolicitudesPortabilidad_actual+",diferencia: "+diferenciaSolicitudesPortabilidad+"}");

							for(let index = 1; index <= diferenciaSolicitudesPortabilidad; index++) {
								this.mostrarSolicitudesNuevas(index, 'PORTABILIDAD');
							}
						}

					}

					// Inicia if rechazadosPerfilamiento
					if(this.objPerfilamiento.rechazadosPerfilamiento > this.copiaObjPerfilamiento.rechazadosPerfilamiento) {

						let solicitudesNuevas: number = 0;

						/* Se asigna como nuevo valor el numero de solicitudes del ciclo anterior*/
						this.objPerfilamiento.rechazadosPerfilamiento = this.copiaObjPerfilamiento.rechazadosPerfilamiento;

						// Se evalua si el numero de solicitudes de nomina big actual es mayor al numero de solicitudes de nomina big anterior
						if(perfilamientoNominaBig_actual > perfilamientoNominaBig_anterior) {

							solicitudesNuevas += diferenciaPerfilamientoNominaBig;

							console.log("[Perfilamiento][NominaBig] {anterior: "+perfilamientoNominaBig_anterior+",actual: "+perfilamientoNominaBig_actual+",diferencia: "+(diferenciaPerfilamientoNominaBig)+"}");
						}

						// Se evalua si el numero de solicitudes de pensionados actual es mayor al numero de solicitudes de pensionados anterior
						if(perfilamientoPensionados_actual > perfilamientoPensionados_anterior) {

							solicitudesNuevas += diferenciaPerfilamientoPensionados;

							console.log("[Perfilamiento][Pensionados] {anterior: "+perfilamientoPensionados_anterior+",actual: "+perfilamientoPensionados_actual+",diferencia: "+(diferenciaPerfilamientoPensionados)+"}");
						}

						// Se evalua si el numero de solicitudes de portabilidad actual es mayor al numero de solicitudes de portabilidad anterior
						if(perfilamientoPortabilidad_actual > perfilamientoPortabilidad_anterior) {

							solicitudesNuevas += diferenciaPerfilamientoPortabilidad;

							console.log("[Perfilamiento][Portabilidad] {anterior: "+perfilamientoPortabilidad_anterior+",actual: "+perfilamientoPortabilidad_actual+",diferencia: "+(diferenciaPerfilamientoPortabilidad)+"}");
						}

						if(solicitudesNuevas > 0) {
							for(let index = 1; index <= solicitudesNuevas; index++) {
									this.mostrarSolicitudesNuevas(index, 'PERFILAMIENTO');
							}
						}

					}
					// Termina if rechazadosPerfilamiento

					// Inicia if rechazadosTasa
					if(this.objPerfilamiento.rechazadosTasa > this.copiaObjPerfilamiento.rechazadosTasa) { 

						let solicitudesNuevas: number = 0;

						/* Se asigna como nuevo valor el numero de solicitudes del ciclo anterior*/
						this.objPerfilamiento.rechazadosTasa = this.copiaObjPerfilamiento.rechazadosTasa;

						// Se evalua si el numero de solicitudes de nomina big actual es mayor al numero de solicitudes de nomina big anterior
						if(tasaNominaBig_actual > tasaNominaBig_anterior) {

							solicitudesNuevas += diferenciaTasaNominaBig;

							console.log("[Tasa][NominaBig] {anterior: "+tasaNominaBig_anterior+",actual: "+tasaNominaBig_actual+",diferencia: "+(diferenciaTasaNominaBig)+"}");
						}

						// Se evalua si el numero de solicitudes de pensionados actual es mayor al numero de solicitudes de pensionados anterior
						if(tasaPensionados_actual > tasaPensionados_anterior) {

							solicitudesNuevas += diferenciaTasaPensionados;

							console.log("[Tasa][Pensionados] {anterior: "+tasaPensionados_anterior+",actual: "+tasaPensionados_actual+",diferencia: "+(diferenciaTasaPensionados)+"}");
						}

						// Se evalua si el numero de solicitudes de portabilidad actual es mayor al numero de solicitudes de portabilidad anterior
						if(tasaPortabilidad_actual > tasaPortabilidad_anterior) {

							solicitudesNuevas += diferenciaTasaPortabilidad;

							console.log("[Tasa][Portabilidad] {anterior: "+tasaPortabilidad_anterior+",actual: "+tasaPortabilidad_actual+",diferencia: "+(diferenciaTasaPortabilidad)+"}");														
						}

						if(solicitudesNuevas > 0) {
							for(let index = 1; index <= solicitudesNuevas; index++) {
									this.mostrarSolicitudesNuevas(index, 'TASA');
							}
						}
						
					}
					// Termina if rechazadosTasa

					// Inicia if totalOtorgados
					if(this.objPerfilamiento.totalOtorgados > this.copiaObjPerfilamiento.totalOtorgados) {

						let solicitudesNuevas: number = 0;

						/* Se asigna como nuevo valor el numero de solicitudes del ciclo anterior*/
						this.objPerfilamiento.totalOtorgados = this.copiaObjPerfilamiento.totalOtorgados;

						// Se evalua si el numero de solicitudes de nomina big actual es mayor al numero de solicitudes de nomina big anterior
						if(otorgadosNominaBig_actual > otorgadosNominaBig_anterior) {

							solicitudesNuevas += diferenciaotorgadosNominaBig;

							console.log("[Otorgados][NominaBig] {anterior: "+otorgadosNominaBig_anterior+",actual: "+otorgadosNominaBig_actual+",diferencia: "+(diferenciaotorgadosNominaBig)+"}");
						}

						// Se evalua si el numero de solicitudes de pensionados actual es mayor al numero de solicitudes de pensionados anterior
						if(otorgadosPensionados_actual > otorgadosPensionados_anterior) {

							solicitudesNuevas += diferenciaotorgadosPensionados;

							console.log("[Otorgados][Pensionados] {anterior: "+otorgadosPensionados_anterior+",actual: "+otorgadosPensionados_actual+",diferencia: "+(diferenciaotorgadosPensionados)+"}");
						}

						// Se evalua si el numero de solicitudes de portabilidad actual es mayor al numero de solicitudes de portabilidad anterior
						if(otorgadosPortabilidad_actual > otorgadosPortabilidad_anterior) {

							solicitudesNuevas += diferenciaotorgadosPortabilidad;

							console.log("[Otorgados][Portabilidad] {anterior: "+otorgadosPortabilidad_anterior+",actual: "+otorgadosPortabilidad_actual+",diferencia: "+(diferenciaotorgadosPortabilidad)+"}");													
						}

						if(solicitudesNuevas > 0) {
							for(let index = 1; index <= solicitudesNuevas; index++) {
								this.mostrarSolicitudesNuevas(index, 'OTORGADOS');
							}
						}
						
					}
					// Termina if totalOtorgados

					console.log("------------------------------------------------------------------------------------------------------------");

				} // Temrina if que comprueba si existen las propiedades en el objeto

			}else {
				this.notifications.info('Monitoreo de creditos', "La consulta no arrojo ningun resultado");
			}
		}

			/*this.timeoutCambiarValores = setTimeout(() => this.cambiarValoresRespuesta(),20000);*/
		
/*			this.timeoutObtenerValores = setTimeout(() => {
				this.copiaObjPerfilamiento = JSON.parse(JSON.stringify(this.objPerfilamiento));
				console.log("Copia objeto manejador -> ",this.copiaObjPerfilamiento);
				this.distribuirSolicitudes();
			},30000);*/
	}

/*	cambiarValoresRespuesta() {
		for(let index = 0; index < this.objResponse.jsonResultado.length; index++) {
			let randomIntOne: any = Math.floor((Math.random() * 10) + 1);
			let randomIntTwo: any = Math.floor((Math.random() * 10) + 1);
			let randomIntThree: any = Math.floor((Math.random() * 10) + 1);
			let randomIntFour: any = Math.floor((Math.random() * 10) + 1);
			this.objResponse.jsonResultado[index].totalSolicitud += randomIntOne + randomIntTwo;
			this.objResponse.jsonResultado[index].totalRBuroPerfil += randomIntThree + randomIntFour;
			this.objResponse.jsonResultado[index].totalRTasa += randomIntThree + randomIntOne;
			this.objResponse.jsonResultado[index].totalCredito += randomIntFour + randomIntTwo;
		}
	}*/

	mostrarSolicitudesNuevas(index: any,category: string) {

		this.timeoutMostrarEsferas = setTimeout(() => {
			switch (category) {
				case "NOMINABIG":
					this.objPerfilamiento.nominaBig.totalSolicitudes += 1;
					this.ballTop.nativeElement.style.animation = "arribaAbajo 1s normal forwards ease-in-out";
					setTimeout(() => {this.ballTop.nativeElement.style.animation = "none";},index * 900);
					break;
				case "PENSIONADOS":
					this.objPerfilamiento.pensionados.totalSolicitudes += 1;
					this.ballMiddle.nativeElement.style.animation = "derecha 1s normal forwards ease-in-out";
					setTimeout(() => {this.ballMiddle.nativeElement.style.animation = "none";},index * 900);
					break;
				case "PORTABILIDAD":
					this.objPerfilamiento.portabilidad.totalSolicitudes += 1;
					this.ballBottom.nativeElement.style.animation = "abajoArriba 1s normal forwards ease-in-out";
					setTimeout(() => {this.ballBottom.nativeElement.style.animation = "none";},index * 900);
					break;
				case "PERFILAMIENTO":	
					this.objPerfilamiento.rechazadosPerfilamiento += 1;
					break;
				case "TASA":
					this.objPerfilamiento.rechazadosTasa += 1;
					this.ballMiddleCenter.nativeElement.style.animation = "derechaMedia 1s normal forwards ease-in-out";
					setTimeout(() => {this.ballMiddleCenter.nativeElement.style.animation = "none";},index * 900);
					break;
				case "OTORGADOS":
					this.objPerfilamiento.totalOtorgados += 1;
					this.ballMiddleEnd.nativeElement.style.animation = "derechaFin 1s normal forwards ease-in-out";
					setTimeout(() => {this.ballMiddleEnd.nativeElement.style.animation = "none";},index * 900);
					break;
				default:
					console.log("La categoria no coincide con ninguna de las establecidas");
					break;
			}

		},index * 1000);
	}

	dibujarEsfera() {

		requestAnimationFrame(()=> {
			this.dibujarEsfera();
		});

		var ctx = this.contextSphere;
	    var cx=400,cy=300;
		var Z=0, X=0, p=0, q=0, s=0;
		
		ctx.fillRect(0,0,2e3,2e3);
		ctx.fillStyle = '#000000';

		for(var i=999;i--;){
			ctx.clearRect(cx+1/(Z=3+this.coseno(p=i+this.t)*this.seno(q=i/31))*(X=this.seno(p)*this.seno(q))*cx,cy+this.coseno(q)/Z*cx,s=20/Z/Z,s);
		}

		this.t-=.0059;	  	
	}

	dibujarCilindro() {

		requestAnimationFrame(()=> {
			this.dibujarCilindro();
		});

		var ctx = this.contextCilinder;
	    var cx=250,cy=300;
		var Z=0, X=0, p=0, q=0, s=0;
		
		ctx.fillRect(0,0,2e3,2e3);
		ctx.fillStyle = '#000000';

		for(var i=99;i--;){
			ctx.clearRect(cx+1/(Z=3+this.coseno(p=i+this.t)*this.seno(q=i/31))*(X=this.seno(p))*cx,cy+this.coseno(q)/Z*cx,s=30/Z/Z,s);
		}

		this.t-=.0029;	  	
	}
}
