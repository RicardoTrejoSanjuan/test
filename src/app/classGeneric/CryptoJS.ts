import { CryptoJSInterface} from '../interfaces/CryptoJS';
import { ClassGenerica, PathService} from '../classGeneric/config';
// import CryptoJS from 'crypto-js';
import * as CryptoJS from 'crypto-js';



export class CryptoJSi extends ClassGenerica implements CryptoJSInterface{
//export class CryptoJSi {
  out;
  wordArray;

  userSesion;
  keyValue;
  key;
  iv;

  data;
  rawData;
  crypttext;


  constructor(){
    super();
  }


  private RepeatCadena(cadena, longitud): any{

    this.out = cadena.toString();
    while (this.out.length < longitud){
      this.out += cadena;
    }
    return this.out.substring(0, longitud);
  }


  private KeyBase64 = (cadena): any => {
    this.wordArray = null;
    
    this.wordArray = CryptoJS.enc.Utf8.parse(this.RepeatCadena(cadena, 16));
    return CryptoJS.enc.Base64.stringify(this.wordArray);
  }

  private Hex2a(hex): any{
    var str = '';
    for (var i = 0; i < hex.length; i += 2){
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
  }


  private keyUser(): any{
    if(super.isToken()){
      this.userSesion = super.isKeyUser();
    }else{
      this.userSesion = this.encryptfechaby3();
    }
  }

  protected encryptAES (value): any{

    this.keyUser();


    this.keyValue = this.KeyBase64(this.userSesion.toString());
    this.key = CryptoJS.enc.Base64.parse(this.keyValue);
    this.iv = CryptoJS.enc.Base64.parse(this.keyValue);

    value = value.replace(/Ñ/g, "ñ");
    value = value.replace(/Ñ/g, "<N>");
    value = value.replace(/Á/g, "á");
    value = value.replace(/É/g, "é");
    value = value.replace(/Í/g, "í");
    value = value.replace(/Ó/g, "ó");
    value = value.replace(/Ú/g, "ú");

    var textencryipted = CryptoJS.AES.encrypt(value.toString(), this.key, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: this.iv,
    });
    var encrypt2Value = CryptoJS.AES.encrypt(value.toString() + '<>' + textencryipted.toString(), this.key, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: this.iv,
    });

    return encrypt2Value.toString();

  }


  protected decryptAES (value): any{

    this.data = value;
    this.keyUser();
    

    this.keyValue = this.KeyBase64(this.userSesion.toString());
    this.key = CryptoJS.enc.Base64.parse(this.keyValue);


    this.rawData = atob(this.data);
    this.iv = btoa(this.rawData);
    this.crypttext= btoa(this.rawData.substring(16));


    var plaintextArray = CryptoJS.AES.decrypt({ciphertext: CryptoJS.enc.Base64.parse(this.crypttext), salt: ""}, CryptoJS.enc.Hex.parse(this.key.toString()), {iv: CryptoJS.enc.Base64.parse(this.iv)});


    var strDesifrado = this.Hex2a(plaintextArray.toString());
    return strDesifrado.replace("<N>", "Ñ");

  }
}


