/*
 * @version 1.0 (25/10/2018)
 * @author rtrejo
 * @description Interfas de documento
 * @contributors Front-end team
 */
export interface IDocument {
    idDocument?: string,
    idExpediente?: number,
    name?: string,
    rutasHttp?: string[],
    status?: number,
    icons?: string,
    claseFondo?: string,
    claseico?: string,
    claseActive?: string,
    active?: boolean
}


export class Document implements IDocument {
    constructor(
        public idDocument?: string,
        public idExpediente?: number,
        public name?: string,
        public rutasHttp?: string[],
        public status?: number,
        public icon?: string,
        public claseFondo?: string,
        public claseico?: string,
        public claseActive?: string,
        public active?: boolean
    ) { };

    public listDocuments = []

    // mapeo de un json Array to Document[]
    public setArrayDocument(_documentsList: Document[], jsonDocuments: any, infoDocuments: any): Document[] {

        this.listDocuments = infoDocuments.documentos;

        for (let key in jsonDocuments) {
            let result = this.listDocuments.find(item => { return item.idDoc == jsonDocuments[key].idDocumento });
            if (result) {
                _documentsList.push(this.setDocument(jsonDocuments[key], result.status));
            }
        };
        return _documentsList;
    }

    //Set de valores para estructura de un documento
    public setDocument(json: any, status: number): Document {
        let _document = new Document();
        _document.idDocument = json['idDocumento'];
        _document.idExpediente = json['idExpediente'];
        _document.rutasHttp = json['rutasHttp'];
        _document.icon = 'solicitud-apertura.png';
        _document.active = false;
        // _document.status = status;
        _document = this.setNameAndStatus(json['idDocumento'], _document);
        _document = this.setStyle(_document);

        return _document;
    }

    public setNameAndStatus(_key: string, _documnet: Document): Document {
        let infoDoc = this.listDocuments.find(doc => doc.idDoc == _key);
        _documnet.name = infoDoc.descr;
        _documnet.status = 1;//infoDoc.status;
        return _documnet;
    }

    public setStyle(_documnet: Document): Document {
        if (_documnet.status == 0) {
            _documnet.claseFondo = 'verde-04';
            _documnet.claseico = 'verde-04-ico';
            _documnet.claseActive = 'verde-04-active';
        } else if (_documnet.status == 1) {
            _documnet.claseFondo = 'rojo-01';
            _documnet.claseico = 'rojo-01-ico';
            _documnet.claseActive = 'rojo-01-acive';
        } else if (_documnet.status == 2) {
            _documnet.claseFondo = 'naranja-04';
            _documnet.claseico = 'naranja-04-ico';
            _documnet.claseActive = 'naranja-04-active';
        }
        return _documnet;
    } 
}