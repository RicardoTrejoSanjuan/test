import { Observable } from 'rxjs/Observable';
import { Service } from '../../../../service/service';
import { MESA_CONTROL } from '../../shared/constants/constants-url';
import { RevisionSolicitudService } from '../revisionSolicitud.service';
import { RubroActivo, Activo, HistorialNombres, Fechas, HandlerModal, ObjHandler } from '../captacion-mesa-control';


export class SolicitudController {
   
    constructor() {
       
    };
    getListForm() {
        let listForm = {
            "Fotografía": {
                "valor": "50%",
                "validado": false,
                "disabled": true
            },
            "numMunicipio": {
                "valor": "034",
                "disabled": false,
                "validado": true
            },
            "poblacion": {
                "valor": "EcatepecDeMorelos",
                "disabled": false,
                "validado": false
            },
            "idGenero": {
                "valor": true,
                "disabled": false,
                "validado": false
            },
            "idTipoIdentificacion": {
                "valor": true,
                "disabled": false,
                "validado": true
            },
            "estadoCivil": {
                "valor": "SOLTERO(A)",
                "disabled": false,
                "validado": true
            },
            "fcNumExtDomEmpleado": {
                "valor": "3",
                "disabled": false,
                "validado": true
            },
            "anioVigencia": {
                "valor": "2020",
                "disabled": false,
                "validado": true
            },
            "numEstado": {
                "valor": "15",
                "disabled": false,
                "validado": true
            },
            "colonia": {
                "valor": "SantaMaríaTulpetlac",
                "disabled": false,
                "validado": false
            },
            "apePaterno": {
                "valor": "Maldonado",
                "disabled": false,
                "validado": false
            },
            "rfc": {
                "valor": "MARC9109251n0",
                "disabled": false,
                "validado": true
            },
            "nombre": {
                "valor": "CarlosAlberto",
                "disabled": false,
                "validado": false
            },
            "folioNacional": {
                "valor": "",
                "disabled": false,
                "validado": true
            },
            "fcEstado": {
                "valor": "México",
                "disabled": false,
                "validado": false
            },
            "idPais": {
                "valor": true,
                "disabled": false,
                "validado": true
            },
            "edad": {
                "valor": "",
                "disabled": false,
                "validado": true
            },
            "curp": {
                "valor": "marc910925hmcldr00",
                "disabled": false,
                "validado": true
            },
            "idPaisNac": {
                "valor": true,
                "disabled": false,
                "validado": true
            },
            "fiIdTipoVivienda": {
                "valor": "2",
                "disabled": false,
                "validado": true
            },
            "nacionalidad": {
                "valor": "(null)",
                "disabled": false,
                "validado": true
            },
            "diaSelect": {
                "valor": "25",
                "disabled": false,
                "validado": true
            },
            "idMunicipio": {
                "valor": "33",
                "disabled": false,
                "validado": true
            },
            "anioRegistro": {
                "valor": "2010",
                "disabled": false,
                "validado": true
            },
            "numLocalidad": {
                "valor": "0001",
                "disabled": false,
                "validado": true
            },
            "mesSelect": {
                "valor": "1991-09",
                "disabled": false,
                "validado": true
            },
            "idEstadoNac": {
                "valor": "15",
                "disabled": false,
                "validado": true
            },
            "claveElector": {
                "valor": "MLRDCR91092515H400",
                "disabled": false,
                "validado": true
            },
            "fcPais": {
                "valor": "Mexico",
                "disabled": false,
                "validado": true
            },
            "fcTipoVivienda": {
                "valor": "Familiar",
                "disabled": false,
                "validado": true
            },
            "genero": {
                "valor": "MASCULINO",
                "disabled": false,
                "validado": false
            },
            "cp": {
                "valor": "55400",
                "disabled": false,
                "validado": false
            },
            "estado": {
                "valor": "MÃ©xico",
                "disabled": false,
                "validado": true
            },
            "apeMaterno": {
                "valor": "Rodriguez",
                "disabled": false,
                "validado": false
            },
            "folio": {
                "valor": "1503121031136",
                "disabled": false,
                "validado": true
            },
            "numEmision": {
                "valor": "02",
                "disabled": false,
                "validado": true
            },
            "numInt": {
                "valor": "29",
                "disabled": false,
                "validado": true
            },
            "anioSelect": {
                "valor": "1991",
                "disabled": false,
                "validado": true
            },
            "anioEmision": {
                "valor": "2010",
                "disabled": false,
                "validado": true
            },
            "idEstado": {
                "valor": "15",
                "disabled": false,
                "validado": false
            },
            "numExt": {
                "valor": "3",
                "disabled": false,
                "validado": true
            },
            "fecNacimiento": {
                "valor": "25-09-1991",
                "disabled": false,
                "validado": true
            },
            "idEstadoCivil": {
                "valor": true,
                "disabled": false,
                "validado": true
            },
            "fcNumIntDomEmpleado": {
                "valor": "29",
                "disabled": false,
                "validado": true
            },
            "numSeccion": {
                "valor": "1503",
                "disabled": false,
                "validado": true
            },
            "calle": {
                "valor": "ProlMexico",
                "disabled": false,
                "validado": false
            }
        }

        return listForm
    }
    getImagesGallery(documentos) {
        // let arrayListImg = [{
        //     "id": "ine",
        //     "path": "/images/mesa-control-expedientes/ine.jpg"
        // }, {
        //     "id": "pasaporte",
        //     "path": "/images/mesa-control-expedientes/pasaporte.jpg"
        // }, {
        //     "id": "visa",
        //     "path": "/images/mesa-control-expedientes/visa.jpg"
        // }, {
        //     "id": "imagenDerecha",
        //     "path": "/images/mesa-control-expedientes/cfe.jpg"
        // }
        // ]
        let arrayListImg = [];
        for (var opcImg in documentos){
            // console.log({id:documentos[opc].idDocumento,path:"/images/mesa-control-expedientes/ine.jpg"});
            arrayListImg.push({id:documentos[opcImg].idDocumento, path:"/images/mesa-control-expedientes/ine.jpg"});
        }
        return arrayListImg;
    }
    configButton(banderaForm, banderaSelfie, banderaPdf) {
        let dataBoton = {};
        if (!banderaSelfie || !banderaPdf) {
            dataBoton = {
                etiqueta: "Devolver",
                color: "rojo-02 btn-danger",
                accion: 0
            }
        } else if (!banderaForm && banderaPdf && banderaSelfie) {
            dataBoton = {
                etiqueta: "Enviar a Asesor Central",
                color: "verde-09 btn-success",
                accion: 1
            }
        } else if (banderaForm && banderaSelfie && banderaPdf) {
            dataBoton = {
                etiqueta: "Liberar",
                color: "verde-09 btn-success",
                accion: 2
            }
        };
        return dataBoton
    }
    extraeImg(imagenes,imagen = "1") {
        
        let arrayListPdf = [], imgD = {};
              
        imagenes.forEach((key) => {
            if (key.id == "2") {

                if (typeof key == 'object' && key.validado == false) {
                    imgD = { "etiqueta": "Calificar Imagen", "id": key.id, path: "/images/mesa-control-expedientes/x.png", color: "rojo-02", validado: false };
                } else {
                    imgD = { "etiqueta": "Calificar Imagen", "id": key.id, path: "/images/mesa-control-expedientes/ok.png", color: "verde-09", validado: true };
                }
            } else if (key.id == imagen) {
                if (typeof key == 'object' && key.validado == false) {
                    arrayListPdf.push({ "etiqueta": "Calificar Imagen", "id": key.id, path: "/images/mesa-control-expedientes/x.png", color: "rojo-02", validado: false });
                } else {
                    arrayListPdf.push({ "etiqueta": "Calificar Imagen", "id": key.id, path: "/images/mesa-control-expedientes/ok.png", color: "verde-09", validado: true });
                }
            }
        });
        

        arrayListPdf.push(imgD);
        return arrayListPdf;
    }
    generaImagenes(documentos){
        let listDocs = [];
        for (var opcDoc in documentos){
            listDocs.push({id:documentos[opcDoc].idDocumento,disabled:false,validado:false});
        }
        return listDocs;
    }
    integraImagenes(documentos, listFormAll){
        
        if(listFormAll["imagenes"] === undefined){
            listFormAll["imagenes"] = documentos
        }

        return listFormAll
    }
    creaGallery(listImages, listFormAll) {
        let arrayListImg = [];
        listImages.forEach((key) => {
            if (key.id === "1") {
                listFormAll.filter(element => {
                    if (element.id == key.id) {
                        //console.log({ path:key.path, id: element.id, class:(element.validado==true)?"noRequired":"required"})
                        arrayListImg.push({ path: key.path, id: element.id, class: (element.validado == true) ? "noRequired" : "required" })
                    }
                });
            }
        });

        return arrayListImg;
    }
    validImg(listImgUpdate, listImagesAll) {

        listImgUpdate.forEach((key) => {

            listImagesAll.filter(element => {
                if (element.id == key.id) {
                    element.validado = key.validado
                }
            });

        });

        let activaBotonAC = true
        listImagesAll.filter(element => {
            if (!element.validado) {
                activaBotonAC = false;
            }
        });
        return [activaBotonAC, listImagesAll];
    }
    updteListAll(listFormUpdate, listFormAll) {
        listFormUpdate.forEach((key) => {
            for (var input in listFormAll) {
                if (input == key.etiqueta) {
                    listFormAll[input].valor = key.valor;
                    listFormAll[input].validado = key.validado

                }
            }
        });
        return listFormAll;
    }
    obtieneRubro(dataImg, rubrosCalificacion){
        let rubroSelect;
        rubrosCalificacion.filter((_item: any) => {
            if (_item.idDocumento === dataImg.id) {
                rubroSelect = _item;
            }
        });
        return rubroSelect;
    }
    saveAll(dataValid, listFormAll) {
        console.log("guarda info",dataValid,listFormAll)
        
        if (dataValid === 0) {

        } else if (dataValid === 1) {

        } else if (dataValid === 2) {

        };
    }
}