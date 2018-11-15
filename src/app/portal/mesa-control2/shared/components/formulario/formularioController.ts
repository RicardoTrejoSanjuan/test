export class FormularioController {

    constructor() {

    };

    listForm(listForm) {
        var listAllForm = Object.keys(listForm);
        let arrayListForm = [];

        listAllForm.forEach((key) => {
            if (typeof listForm[key] == 'object' && listForm[key].validado === false) {
                if( key !== "imagenes"){
                    arrayListForm.push({ "etiqueta": key, "valor": listForm[key].valor, path:"/images/mesa-control-expedientes/x.png", color:"rojo-02",validado:0});
                }
            }
        });

        return arrayListForm
    }
    convertValidacion(value,listForm){
        let activaBotonAC = true, foto=false;
        listForm.filter(element => { 
            if (element.etiqueta == value.etiqueta){
                if(element.color=="rojo-02"){
                    element.path="/images/mesa-control-expedientes/ok.png";
                    element.color="verde-09";
                    element.validado=true;
                }else if(element.color=="verde-09"){
                    element.path="/images/mesa-control-expedientes/x.png";
                    element.color="rojo-02"
                    element.validado=false;
                }
            }
            if(element.etiqueta=="Fotografía"){
                foto = (element.color=="verde-09") ? true : false;
            }
            if(!element.validado){
                activaBotonAC = false;
            }
        });
        listForm.filter(element => { 
            if(!element.validado){
                activaBotonAC = false;
            }
        });
        return [listForm,activaBotonAC,foto];
    }
}