import { Injectable } from '@angular/core';

@Injectable()
export class CatalogosValidacionMC {

    public getColorExpediente(_status, _stBloq): String {
        if (_status === 0) {
            if (_stBloq === 1) {
                return 'expediente-naranja.png';
            } else {
                return 'expediente-azul.png';
            }
        } else if (_status === 2) {
            return 'expediente-verde.png';
        } else if (_status === 3) {
            return 'expediente-rojo.png';
        } else {
            return 'expediente-rojo.png';
        }
    }

    public getColorDocumento(_idDocumento: number): string {
        switch (_idDocumento) {
            case 1: return 'color-naranja-01';
            case 2: return 'color-rojo-01';
            case 100: return 'color-default';
            default: return 'color-verde-01';
        }
    }
    public getColorAvatar(_status: number): string {
        if (_status === 0) { return 'iconoRojo.png'; }
        else if (_status === 3) { return 'iconoRojo.png'; }
        else if (_status === 2) { return 'iconoVerde.png'; }
        return 'iconoGris.png';
    }
    public getColorStatus(_status: number): string {
        if (_status === 0) { return 'color-rechazada'; }
        else if (_status === 3) { return 'color-rechazada'; }
        else if (_status === 2) { return 'color-liberada'; }
        return 'color-default';
    }
    public getColorDate(_status: number): string {
        if (_status === 0) { return ''; }
        else if (_status === 3) { return ''; }
        else if (_status === 2) { return 'color-liberada'; }
        return 'color-default';
    }
    public getColorTexto(_status: boolean): string {
        if (_status) { return 'color-texto'; }
        else { return 'color-texto-disabled'; }
    }

    public initRubros(): any {
        let rubros: any = [
            { active: false, hidden: false, status: 'blank.gif', idRechazo: null, comentario: null, idStatusRevision: null, idDocumento: null, idRubro: 100, textoMenu: 'Identificación Oficial', icon: 'btnIDoficial.jpg', claseFondo: 'naranja-04-active', claseico: 'naranja-04-ico', claseActive: 'naranja-04-active' },
            { active: false, hidden: false, status: 'blank.gif', idRechazo: null, comentario: null, idStatusRevision: null, idDocumento: "1", idRubro: 1, textoMenu: 'Fotografia', icon: 'btnFoto.jpg', claseFondo: 'naranja-04', claseico: 'naranja-04-ico', claseActive: 'naranja-04-active' },
            { active: false, hidden: false, status: 'blank.gif', idRechazo: null, comentario: null, idStatusRevision: null, idDocumento: "1", idRubro: 2, textoMenu: 'Nombre', icon: 'btnNombre.jpg', claseFondo: 'naranja-04', claseico: 'naranja-04-ico', claseActive: 'naranja-04-active' },
            { active: false, hidden: false, status: 'blank.gif', idRechazo: null, comentario: null, idStatusRevision: null, idDocumento: "1", idRubro: 3, textoMenu: 'Vigencia', icon: 'btnVigencia.jpg', claseFondo: 'naranja-04', claseico: 'naranja-04-ico', claseActive: 'naranja-04-active' },

            { active: false, hidden: false, status: 'blank.gif', idRechazo: null, comentario: null, idStatusRevision: null, idDocumento: null, idRubro: 104, textoMenu: 'Comprobante Domicilio', icon: 'btnCdom.jpg', claseFondo: 'rojo-01-active', claseico: 'rojo-01-ico', claseActive: 'rojo-01-active' },
            { active: false, hidden: false, status: 'blank.gif', idRechazo: null, comentario: null, idStatusRevision: null, idDocumento: "2", idRubro: 5, textoMenu: 'Domicilio', icon: 'btnDatosHogar.jpg', claseFondo: 'rojo-01', claseico: 'rojo-01-ico', claseActive: 'rojo-01-active' },
            { active: false, hidden: false, status: 'blank.gif', idRechazo: null, comentario: null, idStatusRevision: null, idDocumento: "2", idRubro: 6, textoMenu: 'Vigencia', icon: 'btnVig.jpg', claseFondo: 'rojo-01', claseico: 'rojo-01-ico', claseActive: 'rojo-01-active' },

            { active: false, hidden: false, status: 'blank.gif', idRechazo: null, comentario: null, idStatusRevision: null, idDocumento: null, idRubro: 106, textoMenu: 'Documentos', icon: 'documentos.png', claseFondo: 'verde-04-active', claseico: 'verde-04-ico', claseActive: 'verde-04-active' },
            { active: false, hidden: false, status: 'blank.gif', idRechazo: null, comentario: null, idStatusRevision: null, idDocumento: "8-25", idRubro: 7, textoMenu: 'Solicitud De Apertura', icon: 'solicitud-apertura.png', claseFondo: 'verde-04', claseico: 'verde-04-ico', claseActive: 'verde-04-active' },
            { active: false, hidden: false, status: 'blank.gif', idRechazo: null, comentario: null, idStatusRevision: null, idDocumento: "8-26", idRubro: 8, textoMenu: 'Carátula De Depósito', icon: 'caratula-nomina.png', claseFondo: 'verde-04', claseico: 'verde-04-ico', claseActive: 'verde-04-active' },
            { active: false, hidden: false, status: 'blank.gif', idRechazo: null, comentario: null, idStatusRevision: null, idDocumento: "8-45", idRubro: 9, textoMenu: 'Aviso Privacidad', icon: 'aviso-privacidad.png', claseFondo: 'verde-04', claseico: 'verde-04-ico', claseActive: 'verde-04-active' },
            { active: false, hidden: false, status: 'blank.gif', idRechazo: null, comentario: null, idStatusRevision: null, idDocumento: "8-16", idRubro: 10, textoMenu: 'Consulta a Buró', icon: 'buro.png', claseFondo: 'verde-04', claseico: 'verde-04-ico', claseActive: 'verde-04-active' },
            { active: false, hidden: false, status: 'blank.gif', idRechazo: null, comentario: null, idStatusRevision: null, idDocumento: "8-6", idRubro: 11, textoMenu: 'Contrato Firmado', icon: 'contrato-firmado.jpg', claseFondo: 'verde-04', claseico: 'verde-04-ico', claseActive: 'verde-04-active' },
            // { active: false, hidden: true, status: 'blank.gif', idRechazo: null, comentario: null, idStatusRevision: null, idDocumento: -5, idRubro: 12, textoMenu: 'Contrato de Crédito', icon: 'credito.png', claseFondo: 'verde-04', claseico: 'verde-04-ico', claseActive: 'verde-04-active' },
            { active: false, hidden: false, status: 'blank.gif', idRechazo: null, comentario: null, idStatusRevision: null, idDocumento: "8-101", idRubro: 13, textoMenu: 'Formato FATCA', icon: 'credito.png', claseFondo: 'verde-04', claseico: 'verde-04-ico', claseActive: 'verde-04-active' },
            { active: false, hidden: true, status: 'blank.gif', idRechazo: null, comentario: null, idStatusRevision: null, idDocumento: "8-30", idRubro: 14, textoMenu: 'Anexo de Comisiones', icon: 'credito.png', claseFondo: 'verde-04', claseico: 'verde-04-ico', claseActive: 'verde-04-active' }
        ];
        return rubros;
    }

    public getRechazoPorRubro(_id): any {
        switch (_id) {
            case 1:
                return [
                    { id: 1, title: 'Documento no válido' },
                    { id: 2, title: 'Documento no legible' },
                    { id: 3, title: 'Foto no corresponde a Identificación Oficial' },
                    { id: 8, title: 'Otro' }];
            case 2:
                return [
                    { id: 1, title: 'Documento no válido' },
                    { id: 2, title: 'Documento no legible' },
                    { id: 4, title: 'Inconsistencia de datos' },
                    { id: 8, title: 'Otro' }];
            case 3:
                return [
                    { id: 4, title: 'Inconsistencia de datos' },
                    { id: 5, title: 'Documento no vigente' },
                    { id: 8, title: 'Otro' }];
            case 4:
                return [
                    { id: 2, title: 'Documento no legible' },
                    { id: 6, title: 'Firma diferente' },
                    { id: 8, title: 'Otro' }];
            case 5:
                return [
                    { id: 1, title: 'Documento no válido' },
                    { id: 2, title: 'Documento no legible' },
                    { id: 4, title: 'Inconsistencia de datos' },
                    { id: 8, title: 'Otro' }];
            case 6:
                return [
                    { id: 4, title: 'Inconsistencia de datos' },
                    { id: 5, title: 'Documento no vigente' },
                    { id: 8, title: 'Otro' }];
            default:
                return [
                    { id: 7, title: 'Documento incompleto o falta de datos' },
                    { id: 1, title: 'Documento no válido' },
                    { id: 2, title: 'Documento no legible' },
                    { id: 4, title: 'Inconsistencia de datos' },
                    { id: 6, title: 'Firma diferente' },
                    { id: 8, title: 'Otro' }];
        }
    }

    public getIdDocumento(idRubro: any): any {
        if (idRubro <= 4) {
            return 1;
        } else if (idRubro === 5 || idRubro === 6) {
            return 2;
        } else if (idRubro === 7) {
            return 3;
        } else if (idRubro === 8) {
            return 4;
        } else if (idRubro === 9) {
            return 5;
        } else if (idRubro === 10) {
            return 6;
        } else if (idRubro === 11) {
            return 7;
        } else if (idRubro === 12) {
            return 30;
        } else if (idRubro === 13) {
            return 8;
        } else if (idRubro === 14) {
            return 9;
        }
    }

    public getTitleDocumento(_idDocumento: number): any {
        switch (_idDocumento) {
            case 1: return 'identificación Oficial';
            case 2: return 'Comprobante de Domicilio';
            default: return 'Documentos';
        }
    }
    public getTitleRubro(_idRubro: number): any {
        switch (_idRubro) {
            case 1: return 'Fotografia';
            case 2: return 'Nombre';
            case 3: return 'Vigencia';
            case 4: return 'Firma';
            case 5: return 'Domicilio';
            case 6: return 'Vigencia';
            case 7: return 'Solicitud de Apertura de Cuenta';
            case 8: return 'Caratula de Deposito';
            case 9: return 'Aviso de Privacidad';
            case 10: return 'Buró de Crédito';
            case 11: return 'Contrato Firmado';
            case 12: return 'Contrato de Crédito';
            case 13: return 'Formato de Autocertificacion FATCA';
            case 14: return 'Anexo de Comisiones';
            default: return 'Rubro nuevo';
        }
    }

    public getTitleRechazo(_idRechazo: number): any {
        switch (_idRechazo) {
            case 1: return 'Documento no válido';
            case 2: return 'Documento no legible';
            case 3: return 'Foto no corresponde a Identificación Oficial';
            case 4: return 'Inconsistencia de datos';
            case 5: return 'Documento no vigente';
            case 6: return 'Firma diferente';
            case 7: return 'Documento incompleto o falta de datos';
            case 8: return 'Otro';
            default: return null;
        }
    }

    public getMsjEAlerta(_status: number): string {
        switch (_status) {
            case 2:
                return 'Usuario no autorizado para realizar la operación';
            case 3:
                return 'Se presentó un problema en los datos del cliente';
            case 4:
                return 'No es posible consultar los datos del cliente en este momento';
            case 6:
                return 'No es posible generar un código de activación en este momento';
            case 7:
                return 'El desbloqueo de cuenta no ha sido autorizado';
            case 8:
                return 'No es posible desbloquear la cuenta en este momento';
            default:
                return 'El mensaje no se obtuvo correctamente';
        }
    }

    public getNombresDocumentos(_index, _id) {
        switch (_index) {
            case 5:
                return 'Contrato Firmado';
            case 16:
                return 'Consulta a Buro de Crédito';
            case 205:
                return 'Póliza de Seguro de Vida';
            case 392:
                return 'Aviso de Privacidad';
            case 444:
                return 'Solicitud de Crédito';
            case 454:
                return 'Ticket de Disposición';
            case 455:
                return 'Carátula de Crédito Nomina';
            case 456:
                return 'Tabla de Amortización';
            case 479:
                return 'Estado de Cuenta';
            case 601:
                return 'Anexo de Comisiones';
            default:
                var nombre = _id.split(' - ')[1];
                return nombre !== null && nombre !== '' && nombre !== undefined ? nombre : 'Documento sin titulo';
        }
    }
    public getListStatus(): object[] {
        return [
            { title: 'Sin Revisar', id: 0 },
            { title: 'Revisado', id: 1 }
        ];
    }
    public getDateNew(_data: any): Date {
        if (_data !== null) {
            let separator: any = this.getSeparator(_data);
            let arr: number[] = _data.split(separator);
            let dd: number = arr.shift();
            let mm: number = arr.shift();
            let yyyy: number = arr.shift();
            let date: Date = new Date(yyyy, mm - 1, dd);
            return date;
        } else {
            return null;
        }
    }
    private getSeparator(_data: any): void {
        let regExp: RegExp = new RegExp("[/|-]");
        let result: any = _data.match(regExp);
        return result.shift();
    }
}