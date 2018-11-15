import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js';

import { DateInterface } from '../interfaces/Date';

import { Observable } from 'rxjs/Observable';

import { Path, Production } from '../interfaces/path';
import { Token } from '../interfaces/token';
import { ConfG, Login } from '../interfaces/ConfGeneral';

import { ValidatorI } from '../interfaces/validator';

import * as _ from 'underscore';

export const Environment: Production = {
  production: true
};

export const PathService = {
  "paths": [
    {
      "idPath": 1,
      "namePath": "Asesor",
      "path": "http://10.51.193.146:8080"
    },
    {
      "idPath": 2,
      "namePath": "Portal",
      "path": "http://10.51.193.146/"
    },
    {
      "idPath": 3,
      "namePath": "Mesa",
      "path": "http://10.51.193.146:80/ServiciosPortal"
    }
  ]
};

export class ClassGenerica implements Login, ConfG, Token, ValidatorI, DateInterface {
  today;
  title;
  showMenu;
  all; save; edit; deleteC;
  activateLoading;

  token;
  userKey;
  headersT;

  tecla;
  patron;
  tecla_final;

  fullName;

  dia; mes; anio; fechaEncrypt;
  QuerychildArray = new Array();
  QueryparentsArray = new Array();
  optionsNotificationsConfig = {};

  pathParents: string;

  public load_static:any;

  msgloading: any = '0';

  constructor() {
    this.loading(false);
    this.today = new Date();
    
    this.load_static = process.env.NODE_ENV === 'production' ? "PortalBig" : process.env.NODE_ENV === 'preproduction' ? 'PortalBig' : '';
  }

  public limpiarObjeto(obj: Object): any {

    let newObj: any = {};
    let objRes: any[] = [];

    for (let index in obj) {
      if (obj.hasOwnProperty(index)) {

        let data: any = obj[index];

        if (this.validarContenido(data) && typeof data !== "object") {
          newObj[index] = data;
          //console.log("Propiedad ["+index+"] llena -> ",newObj[index]);
        } else if (this.validarContenido(data) && typeof data === "object") {
          //console.log("Propiedad ["+index+"] es un objeto -> ", data);
          newObj[index] = this.limpiarObjeto(data);
          //console.log("Termina propiedad ["+index+"] -> ",newObj[index]);
        } else {
          newObj[index] = "";
          //console.log("Propiedad ["+index+"] vacia -> ",newObj[index]);
        }

      }
    }
    return newObj;
  }

  public validarContenido(_param: any) {
    return _param !== null && _param !== undefined;
  }

  public ordenarDatosDescendente(data: number[]): number[] {

    var i, j, aux;
    //recorreremos todos los elementos hasta n-1
    for (i = 0; i < (data.length - 1); i++) {
      //recorreremos todos los elementos hasta n-i, tomar en cuenta los ultimos no tiene caso ya que ya estan acomodados.
      for (j = 0; j < (data.length - 1); j++) {
        //comparamos
        if (data[j] < data[j + 1]) {
          //guardamos el numero mayor en el auxiliar
          aux = data[j];
          //guardamos el numero menor en el lugar correspondiente
          data[j] = data[j + 1];
          //asignamos el auxiliar en el lugar correspondiente
          data[j + 1] = aux;
        }
      }
    }
    return data;
  }

  public ordenarDatosAscendente(data: number[]): number[] {

    var i, j, aux;
    //recorreremos todos los elementos hasta n-1
    for (i = 0; i < (data.length - 1); i++) {
      //recorreremos todos los elementos hasta n-i, tomar en cuenta los ultimos no tiene caso ya que ya estan acomodados.
      for (j = 0; j < (data.length - 1); j++) {
        //comparamos
        if (data[j] > data[j + 1]) {
          //guardamos el numero mayor en el auxiliar
          aux = data[j];
          //guardamos el numero menor en el lugar correspondiente
          data[j] = data[j + 1];
          //asignamos el auxiliar en el lugar correspondiente
          data[j + 1] = aux;
        }
      }
    }
    return data;
  }

  protected loading(parameter): void {
    this.activateLoading = parameter;
  }

  protected addShowToken(): string {
    if (this.sessionToParse() != null) {
      return this.token = this.sessionToParse().token;
    } else {
      return this.token = null;
    }
  }
  protected isToken(): boolean {
    if (this.sessionToParse() != null) {
      if (this.token = this.sessionToParse().token != null) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  protected isKeyUser(): string {
    if (this.sessionToParse() != null) {
      return this.userKey = this.sessionToParse().keyUser;
    } else {
      return this.userKey = null;
    }
  }

  private sessionToParse(): any {
    if (sessionStorage.getItem('session')) {
      if (this.decryptAESLocal(sessionStorage.getItem('session')) !== '') {
        return JSON.parse(this.decryptAESLocal(sessionStorage.getItem('session')));
      }
    } else {
      return null;
    }

  }

  public haspermiso(): any {
    if (sessionStorage.getItem('permisos')) {
      return true;
    } else {
      return false;
    }
  }


  protected datapermisos(): any {
    if (sessionStorage.getItem('permisos')) {
      try {
        let permisos = JSON.parse(this.decryptAESLocal(sessionStorage.getItem('permisos')));
        return permisos.arbol;
      } catch (err) {
      }
    }
  }

  public getFullName(): string {
    if (this.datapermisos() !== undefined) {
      this.fullName = "" + this.datapermisos().nombre + " " + this.datapermisos().apPaterno + " " + this.datapermisos().apMaterno;
      return this.fullName;
    }
  }

  public rolUser(): string {
    if (this.datapermisos() !== undefined) {
      let rol = this.datapermisos().rolUsr;
      return rol;
    }
  }


  protected delteAllSessionStorage(): any {
    sessionStorage.removeItem('permisos');
    sessionStorage.removeItem('session');
    sessionStorage.removeItem('menuNavigation');
    sessionStorage.removeItem('menuLateral');
    sessionStorage.removeItem('parentsData');
    sessionStorage.removeItem('menuRespaldo');
    sessionStorage.removeItem('getObjectDos');
    sessionStorage.removeItem('MesaControlData');
    this.deletegetObject(true);

  }

  protected deletegetObject(param): void {
    if (param === true) {
      sessionStorage.removeItem('getObject');
    }
  }

  protected deletegetObject2(param): void {
    if (param === true) {
      sessionStorage.removeItem('getObjectDos');
    }
  }

  /* Funciones para compartir informacion entre componentes de mesa de control*/
  protected saveData(_data: any, _name?: string): void {
    let MesaControlData: any = sessionStorage.getItem('MesaControlData');
    if (MesaControlData !== null) {
      let dataSession: any = JSON.parse(this.decryptAESLocal(MesaControlData));
      let datos: any = dataSession.datos;
      let indexAux: number = dataSession.indexAux;
      if (typeof (_name) === 'string') {
        datos[_name] = _data;
      } else {
        if (_data !== null && typeof (_data) !== undefined) {
          if (_data instanceof Array) {
            datos['array' + indexAux] = _data;
            indexAux++;
          } else if (_data instanceof Object) {
            for (let item in _data) {
              if (_data.hasOwnProperty(item)) {
                datos[item] = _data[item];
              }
            }
          } else {
            datos[_data] = _data;
          }
        }
      }
      sessionStorage.setItem('MesaControlData', this.encryptAESLocal(dataSession));
    } else {
      let dataSession: any = { datos: {}, indexAux: 0 };
      sessionStorage.setItem('MesaControlData', this.encryptAESLocal(dataSession));
      this.saveData(_data, _name);
    }
  }

  protected getAttr(_elemento?: string): any {
    let MesaControlData: any = sessionStorage.getItem('MesaControlData');
    if (MesaControlData !== null) {
      let dataSession: any = JSON.parse(this.decryptAESLocal(MesaControlData));
      if (typeof (_elemento) === 'undefined') {
        return dataSession.datos;
      } else {
        let datos: any = dataSession.datos;
        for (let item in datos) {
          if (datos.hasOwnProperty(item)) {
            if ((_elemento.toString()).toUpperCase() === (item.toString()).toUpperCase()) {
              return datos[item];
            }
          }
        }
        return null;
      }
    } else {
      return null;
    }
  }

  protected getNames(): any {
    let MesaControlData: any = sessionStorage.getItem('MesaControlData');
    let arr: string[] = [];
    if (MesaControlData !== null) {
      let dataSession: any = JSON.parse(this.decryptAESLocal(MesaControlData));
      let data: any = dataSession.datos;
      for (let index in data) {
        if (data.hasOwnProperty(index)) {
          arr.push(index);
        }
      }
    }
    return arr;
  }


  protected strUpperCase(_str: string): string {
    try {
      let arrStr: Array<string> = _str.toLowerCase().split(' ');
      for (var i = 0; i < arrStr.length; i++) {
        arrStr[i] = arrStr[i].charAt(0).toUpperCase() + arrStr[i].slice(1);
      }
      return arrStr.join(' ');
    } catch (e) {
      return 'Nombre No Asignado';
    }
  }
  /* Funciones para compartir informacion entre componentes de mesa de control*/

  //Validación de elementos
  protected isValid(_item: any): boolean {
    if (_item === null || typeof (_item) === 'undefined' || _item === "" || _item === 'null') { return false; }
    return true;
  }
  protected headersfunct(): any {
    this.headersT = new Headers({ 'Content-Type': 'application/json; charset=UTF-8' });
    let options = new RequestOptions({ headers: this.headersT });
    return options;
  }

  public encryptfechaby3(): any {
    this.fechaEncrypt = this.today.getDate() + "" + ("0" + (this.today.getMonth() + 1)).slice(-2) + "" + this.today.getFullYear();
    this.fechaEncrypt = (+this.fechaEncrypt) * 3;
    //corrección Elder
    return '/e7G/2YGsebzvcaIQCD1lQ==';
    //return this.fechaEncrypt;
  }


  protected encryptAESLocal(cadena): any {

    let string = JSON.stringify(cadena);
    let key = this.encryptfechaby3().toString();

    let encrypted = CryptoJS.AES.encrypt(string, key);
    return encrypted.toString();
  }

  protected decryptAESLocal(cadena): any {

    let key = this.encryptfechaby3().toString();
    let decrypted = CryptoJS.AES.decrypt(cadena, key);
    return decrypted.toString(CryptoJS.enc.Utf8);

  }

  protected childRouter(data): any {
    if (this.datapermisos() !== undefined) {

      let child = this.datapermisos().child;


      for (var item in child) {
        if (child.hasOwnProperty(item)) {
          if (data === (child[item].url).split("#").join("")) {
            return child[item].child;
          }
        }
      }


    }

  }

  public solonumeros(e): boolean {
    this.tecla = (document.all) ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (this.tecla === 13 || this.tecla === 8 || this.tecla === 9 || this.tecla === 37 || this.tecla === 39) {
      return true;
    }
    if (this.tecla >= 96 && this.tecla <= 105) {
      return true;
    }

    // Patron de entrada, en este caso solo acepta numeros
    this.patron = /[0-9]/;
    this.tecla_final = String.fromCharCode(this.tecla);
    return this.patron.test(this.tecla_final);
  }

  protected getObject(): any {
    if (sessionStorage.getItem('getObject')) {
      return JSON.parse(this.decryptAESLocal(sessionStorage.getItem('getObject')));
    } else {
      return null;
    }
  }


  protected delteSessionStorage(data): void {
    sessionStorage.removeItem(data);
  }

  protected getObjectDos(): any {
    if (sessionStorage.getItem('getObjectDos')) {
      return JSON.parse(this.decryptAESLocal(sessionStorage.getItem('getObjectDos')));
    } else {
      return null;
    }
  }

  public menuNavigation(): any {
    if (sessionStorage.getItem('menuNavigation')) {
      return JSON.parse(this.decryptAESLocal(sessionStorage.getItem('menuNavigation')));
    } else {
      return null;
    }
  }

  protected procesarPaht(length, paht, namePaht): any {
    let lengthParameter = ((length + 1) - 1);
    let arrayMenu = this.menuNavigation();

    arrayMenu.push({ id: lengthParameter, pahtUrl: paht, name: namePaht });
    sessionStorage.setItem('menuNavigation', this.encryptAESLocal(arrayMenu));

  }

  protected setMenuRespaldo(datos): void {
    sessionStorage.setItem('menuRespaldo', this.encryptAESLocal(datos));
  }

  public getMenuRespaldo(): any {
    if (sessionStorage.getItem('menuRespaldo')) {
      return JSON.parse(this.decryptAESLocal(sessionStorage.getItem('menuRespaldo')));
    } else {
      return null;
    }
  }

  protected setparentsData(datos): void {
    sessionStorage.setItem('parentsData', this.encryptAESLocal(datos));
  }

  public getParentsData(): any {
    if (sessionStorage.getItem('parentsData')) {
      return JSON.parse(this.decryptAESLocal(sessionStorage.getItem('parentsData')));
    } else {
      return null;
    }
  }

  protected setMenuLateral(datos): void {
    sessionStorage.setItem('menuLateral', this.encryptAESLocal(datos));
  }

  protected getMenuLateral(parameter: number = 0): any {
    if (sessionStorage.getItem('menuLateral')) {
      if (this.decryptAESLocal(sessionStorage.getItem('menuLateral')) !== '') {
        let objectMenu = JSON.parse(this.decryptAESLocal(sessionStorage.getItem('menuLateral')));
        if (parameter === 0) {
          return objectMenu;
        } else {
          return this.getMenuRespaldo();
        }
      }
    } else {
      return null;
    }
  }

  protected getChildrenByPathPadre(previousUrl): void {
    if (this.datapermisos() !== undefined) {
      let obj = this.datapermisos().child;
      let path = previousUrl.substring(1);
      let childArray = this.iterarObjPadre(path, obj)[0];
    }
  }

  private iterarObjPadre(path, obj): any {
    //Agreamos la barra para igualar con la ruta de bas de datos
    let paht2 = '/' + path;
    let menuActual: any = {};
    for (let i in obj) {
      if (obj.hasOwnProperty(i)) {
        let urlToValidar = obj[i].url;
        if (paht2 === urlToValidar) {
          let menuNavigation = this.menuNavigation();

          //Consultamos si la ruta donde esté ya existe en el array de rutas
          let countMenuNavigation = menuNavigation.filter((element) => {
            return element.pahtUrl === obj[i].url;
          });

          //Agregamos la ruta al menu de navagacion si no esxite y agregamos el estatus a el padre actual
          if (countMenuNavigation.length === 0) {
            menuNavigation.push({ pahtUrl: '', name: '/', class: 'colorBread', parentStatus: false });
            let _isparents: boolean = false;
            if (obj[i].idMenu === this.pathParents) {
              _isparents = true;
            }
            menuNavigation.push({ pahtUrl: obj[i].url, name: obj[i].descripcion, class: 'colorBread', parentStatus: _isparents });
            menuActual = { pahtUrl: obj[i].url, name: obj[i].descripcion, class: 'colorBread', parentStatus: _isparents };
          }

          //obtenemos los items que sean padres
          let countParentStatus = menuNavigation.filter((element) => {
            return element.parentStatus === true;
          });
          let countclean = 0;
          let auxMenuNavigationClean = [];
          for (let x in menuNavigation) {
            if (menuNavigation.hasOwnProperty(x)) {
              if (menuNavigation[x].pahtUrl === paht2) {
                auxMenuNavigationClean.push(menuNavigation[x]);
                countclean = 1;
              }
              if (countclean === 0) {
                auxMenuNavigationClean.push(menuNavigation[x]);
              }
            }
          }
          menuNavigation = auxMenuNavigationClean;
          //Reacorremos el array para eliminar las rutas que ya no se esten visitando
          let aux = 0;
          let countparents = 0;
          let auxMenuNavigation = [];
          for (let y in menuNavigation) {
            if (menuNavigation.hasOwnProperty(y)) {
              //Validamos las padres activos que se han recorrido contanto,
              if (menuNavigation[y].parentStatus === true) {
                countparents = countparents + 1;
              }
              //Agregamos a el nuevo array todos los item hasta el ultimo padre
              if (countparents <= countParentStatus.length) {
                auxMenuNavigation.push(menuNavigation[y]);
                this.setparentsData(auxMenuNavigation[auxMenuNavigation.length - 1]);
              }
              //Contador para validar la cantidad de item para agregar a e array, para que ya no se inserten los item despues de el ultimo padre
              if (countparents >= countParentStatus.length) {
                countparents = countparents + 1;
              }
            }
          }
          //Consultamos si ya existe la url en el array pricipal
          let arrayvalidpath = _.where(auxMenuNavigation, { pahtUrl: menuActual.pahtUrl });
          //Si no existe agregarla a el array y mostrarlo en el template
          if (arrayvalidpath.length === 0) {
            if (menuActual.pahtUrl !== undefined) {
              auxMenuNavigation.push({ pahtUrl: '', name: '/', class: 'colorBread', parentStatus: false });
              auxMenuNavigation.push(menuActual);
            }
          }
          sessionStorage.setItem('menuNavigation', this.encryptAESLocal(auxMenuNavigation));
        } else {
          let child;
          if (obj[i].child !== null) {
            child = obj[i].child;
            this.iterarObjPadre(path, child);
          }
        }
      }
    }
    return this.QueryparentsArray;
  }

  protected getChildrenByPath(previousUrl): any {
    if (this.datapermisos() !== undefined) {
      let obj = this.datapermisos().child;
      let _path = previousUrl.substring(1);
      let path = '/' + _path;
      let childArray = this.iterarObj(path, obj);
      let array = [];
      for (let a in childArray) {
        if (childArray.hasOwnProperty(a)) {
          let object = JSON.parse(JSON.stringify(childArray[a]));
          if (object.url !== null) {
            let pathSplit = (object.url.split("#").join("")).trim();
            let validPrimerCaracter = pathSplit.substring(0, 1);
            if (validPrimerCaracter !== '/') {
              pathSplit = "/" + pathSplit;
            }
            array.push({ url: pathSplit, textoMenu: object.textoMenu, imagen: object.imagen, claseFondo: object.claseFondo, claseIcono: object.claseIcono });
          }
        }
      }
      return array;
    }
  }

  private iterarObj(path, obj): any {
    for (let i in obj) {
      if (obj.hasOwnProperty(i)) {
        let urlToValidar = obj[i].url;
        let pos = urlToValidar.search(path);
        if (pos === 0 && urlToValidar !== path) {
          this.pathParents = obj[i].idMenuParent;
          this.QuerychildArray.push({ url: obj[i].url, textoMenu: obj[i].textoMenu, imagen: obj[i].imagen, claseFondo: obj[i].claseFondo, claseIcono: obj[i].claseIcono });
        }
        let child;
        if (obj[i].child !== null) {
          child = obj[i].child;
          this.iterarObj(path, child);
        }
      }
    }
    return this.QuerychildArray;
  }

  public optionsNotifications = {
    position: ["top", "right"],
    lastOnBottom: true,
  };

  public comasNumero(numero) {
    var number1 = numero.toString(), result = '';
    let separado: any[] = [];
    separado = number1.split(".");
    if (separado[0].indexOf(',') === -1) {
      while (separado[0].length > 3) {
        result = ',' + '' + separado[0].substr(separado[0].length - 3) + '' + result;
        separado[0] = separado[0].substring(0, separado[0].length - 3);
      }
      result = separado[0] + result;
      separado[0] = result;
      result = '';
    }
    if (separado.length > 1) {
      result = separado[0] + "." + separado[1];
    } else {
      result = separado[0];
    }
    return result;
  }

  public httpEventType(result, nex):void{
    if (result.type === 0) {
      setTimeout(() => {
        this.msgloading = '20%';
      }, 200);
    } else if (result.type === 1) {
      setTimeout(() => {
        this.msgloading = '45%';
      }, 200);
    } else if (result.type === 2) {
      setTimeout(() => {
        this.msgloading = '75%';
      }, 300);
    } else if (result.type === 3) {
      setTimeout(() => {
        this.msgloading = '100%';
      }, 200);
    } else if (result.type === 4) {
      setTimeout(() => {
        this.msgloading = '0%';
        nex(result.body);
      }, 400);
    }
  }

  /**
   * name
   */
  // public load_static():string {
  //   const devMode = process.env.NODE_ENV
  //   let load_static = "";
  //   if (devMode === 'production') {
  //     load_static = "PortalBig";
  //   }
  //   return load_static;
  // }


}

@Injectable()
export class AuthGuard extends ClassGenerica implements CanActivate {
  constructor(protected router: Router) {
    super();
  }

  canActivate(AuthGuard) {

    console.log(AuthGuard);
    
    let pathVisit = AuthGuard._routerState.url;

    if (sessionStorage.getItem('menuLateral')) {
      sessionStorage.removeItem('menuLateral');
      this.QuerychildArray = new Array();
    }

    let child = this.getChildrenByPath(pathVisit);

    this.getChildrenByPathPadre(pathVisit);
    this.setMenuLateral(child);
    if (child !== undefined) {
      if (child.length !== 0) {
        this.setMenuRespaldo(child);
      }
    }

    if (pathVisit === '/dashboard' || pathVisit === '/mesa-control' || pathVisit === '/mesa-control2') {
      sessionStorage.removeItem('parentsData');
    } else {
      if (this.datapermisos() !== undefined) {
        let permisos = JSON.parse(this.decryptAESLocal(sessionStorage.getItem('permisos')));

        let countPermiso = 0;
        for (let i in permisos.pathArray) {
          if (permisos.pathArray.hasOwnProperty(i)) {
            if (pathVisit === permisos.pathArray[i].url) {
              countPermiso = countPermiso + 1;
            }
          }
        }
        if (countPermiso !== 0) {
          return true;
        } else {
          return false;
        }
      }
    }

    console.log(super.isToken());
    

    if (super.isToken()) {
      return true;
    } else {
      this.router.navigate(['./login']);
      return false;
    }
  }
}
