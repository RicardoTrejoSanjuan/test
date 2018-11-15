import { Observable } from 'rxjs/Observable';
import { Service } from '../../service/service';

export const URL_EXTRA_MODULE: any = {
	tarjetasDetalle: "/tarjetas-remesa/detalle-tarjetas",
	foliosDetalle: "/tarjetas-remesa/detalle-folios",
	remesasDetalle: "/tarjetas-remesa/detalle-remesas"
};

export class TarjetasRemesaUtils {

	private service: Service;

	public urlsTarjetasModule: Object;

	constructor(serviceHttp: Service) {
		this.service = serviceHttp;


		this.urlsTarjetasModule= {
			seccionGraficaTarjetas: {
				consultaDatosGrafica: "/tarjeta/grafica/informacion/consulta",
				consultaDatosResponsable: "/tarjeta/responsable/datos/responsable"
			},
			seccionSolicitudes: {
				altaSolicitud: "/tarjeta/solicitud/alta",
				consultaSolicitudesPorResponsable: "/tarjeta/solicitud/consulta",
				recepcionarSolicitudRemesa: "/tarjeta/solicitud/recepcion",
				consultaRecepcionSolicitud: "/tarjeta/solicitud/recepcion/consulta"
			},
			seccionRemesas: {
				consultaRemesasPorEstatus: "/tarjeta/lote/consulta",
				consultaDetalleRemesa: "/tarjeta/lote/consultaremesa",
				consultaRemesasTarjetasDisponibles: "/tarjeta/lote/consulta/tarjetasdisponible"
			},
			seccionFolios: {
				altaFolio: "/tarjeta/folios/solicitud",
				consultarFoliosPorEstatus: "/tarjeta/folios/consulta",
				consultarFoliosDetalle: "/tarjeta/folios/detalle",
				actualizarEstatusFolio: "/tarjeta/folios/actualiza"
			},
			seccionResponsables: {
				consultaResponsables: "/tarjeta/responsable/consulta",
				registrarResponsables: "/tarjeta/responsable/alta",
				eliminarResponsables: "/tarjeta/responsable/elimina",
				actualizarResponsables: "/tarjeta/responsable/actualiza"
			},
			seccionTarjetasRemesa: {
				consultaTarjetasPorRemesa: "/tarjeta/informacion/tarjeta/consulta",
				consultaDetalleTarjeta: "/tarjeta/informacion/detalle/consulta"
			},
			seccionSeguimientoResponsables: {
				consultaDistribucionTarjetas: "/tarjeta/informacion/distribucion/consulta"
			},
			seccionCatalogosGenerales: {
				consultaTiposMovimientoCat: "/tarjeta/statusfolio/consulta/movimiento"
			}
		};
	}

	public obtenerMenuLateralLimpio(menu_: any): any {

		let i: number = 0;
		let menuCopy: any = JSON.parse(JSON.stringify(menu_));

		for(let item of menu_) {

			if(item.url === URL_EXTRA_MODULE.tarjetasDetalle || item.url === URL_EXTRA_MODULE.foliosDetalle || item.url === URL_EXTRA_MODULE.remesasDetalle) {
				menuCopy.splice(i,1);
				i--;
			}

			i++;
		}

		return JSON.parse(JSON.stringify(menuCopy));
	}

	/* Consumo de servicios */
    public realizarPeticionHttp = (_requestJson: any, _requestUrl: string): Observable<Object> => {

        let observableRequest: any = Observable.create(observer => {

            this.service.post(_requestJson, _requestUrl, 3).subscribe(
                (data: any) => {
                    observer.next(JSON.parse(JSON.stringify(data)));
                    observer.complete();
                },
                error => { 
                	observer.next(error); observer.complete(); 
                },
                () => { 
                	observer.next(null); observer.complete(); 
                }
            );
        });

        return observableRequest;
    }
}