export class ImagenPdfController {

    constructor(){
    
    };
    updateDataPdf(listPdf,dataPdf){
        // let activaBotonAC=true
        listPdf.filter(element => { 
            if(element.id == dataPdf.id){
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
        });
        // listPdf.filter(element => { 
        //     if(!element.bandera){
        //         activaBotonAC = false;
        //     }
        // });
        return listPdf;
    }
}