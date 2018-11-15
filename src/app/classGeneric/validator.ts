import { ValidatorI } from '../interfaces/validator';


export class Validator implements ValidatorI{

  tecla;
  patron;
  tecla_final;

  public solonumeros(e):boolean{


    this.tecla = (document.all) ? e.keyCode : e.which;

    // console.log(this.tecla);

    //Tecla de retroceso para borrar, siempre la permite
    if (this.tecla===8){
        return true;
    }
        
    // Patron de entrada, en este caso solo acepta numeros
    this.patron =/[0-9]/;
    this.tecla_final = String.fromCharCode(this.tecla);
    // console.log(this.tecla_final);
    // console.log(this.patron.test(this.tecla_final));
    return this.patron.test(this.tecla_final);
  }
}



