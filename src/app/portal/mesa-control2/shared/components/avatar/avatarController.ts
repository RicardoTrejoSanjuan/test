import { MESA_CONTROL } from './../../constants/constants-url';
import { ServiceMCService } from './../../services/serviceMC.service';
import { ClassGenerica } from './../../../../../classGeneric/config';
import { Service } from '../../../../../service/service';
import { Notifications } from '../../../../../classGeneric/notifications';

export class AvatarController extends ClassGenerica {

    constructor(private service: Service, private serviceMC?: ServiceMCService, private notifications?: Notifications) {
        super();
        this.serviceMC = new ServiceMCService(service);
    };

    // Metodo para consultar la foto de un usuario
    public getPhoto(_params: any): any {
        return this.serviceMC.callPost(_params, MESA_CONTROL.recuperaFoto, 3).then(result => {
            let jsonResultado = JSON.parse(JSON.stringify(result));
            if (jsonResultado.codE === 0) {
                return jsonResultado.jsonResultado.contenido;
            } else {
                // this.notifications.info('Mesa Control', 'Cliente no cuenta con foto');
                return 0;
            }
        });
    }

    public validatePhoto(base64: any): boolean {
        try {
            let regexp: any = new RegExp("/9j/4AAQ", "gi");
            let res: any = base64.match(regexp);
            return res.length > 1;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    public AdjustePhoto(base64: any): any {
        try {
            let newFoto: string = "/9j/4AAQ";
            let res: any = base64.split("/9j/4AAQ");
            res.shift();
            newFoto = newFoto.concat(res.shift());
            return newFoto;
        } catch (e) {
            console.log(e);
            return "";
        }
    }
}