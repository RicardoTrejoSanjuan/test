import { Component } from '@angular/core';
import { Router, } from '@angular/router';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ValidationService } from '../../../validator/validation.service';

import { ClassGenerica } from '../../../classGeneric/config';

import { Pagination } from '../../../classGeneric/pagination';

import { Notifications } from '../../../classGeneric/notifications';


import { Service } from '../../../service/service';

import { JsonToCsv } from '../../../classGeneric/jsontocsv';

import {Permisos} from './permisos.component';
import {TreeView} from './tree-view.component';

@Component({
    selector: 'grupos',
    templateUrl: 'template/arbol.component.html',
    styleUrls: ['template/arbol.css'],
})



export class ArbolComponent extends ClassGenerica {
    menuLateral: Array<Object>;
    getObjecAllGrupo: Array<Object>;
    getObjecAllRol: Array<Object>;
    formulario: any;
    save: boolean;
    editDelete: boolean;
    expanded:boolean;
    chk:boolean;
    permisos: Array<Permisos>;
    cont:number;
    antigua:any;
    asignarModulos: boolean;

    constructor(
        private service: Service,
        private notifications: Notifications,
        private formBuilder: FormBuilder,
    
    ) {
        super();
        this.menuNavigation = this.menuNavigation();
        this.menuLateral = this.getMenuLateral(1);
        this.getAll();
        this.asignarModulos=false;

        this.formulario = this.formBuilder.group({
            'idGrupo': ['', [Validators.required]],
            'idRol': ['', [Validators.required]],
            
        });
    }


     getAll(): void {
        
        super.loading(true);
        let path = '/AsesorBig/api/portal/seguridad/grupos/consulta';
        let object: any = {
            "idGrupo": null
        };
        this.service.post(object, path, 1).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                if (object.codE === 0) {
                    this.getObjecAllGrupo = object.jsonResultado;
                }
            },
            error => {
                super.loading(false);
                this.notifications.error('Error de servicio');
            },
            () => super.loading(false)
        );
    }
    
     getRol(data):void{
        super.loading(true);
        let path = '/AsesorBig/api/portal/seguridad/roles/consulta';
        let object: any = {
            "idGrupo": data,
            "idRol":null
        };
        
        this.service.post(object, path, 1).subscribe(
            data => {
                let object = JSON.parse(JSON.stringify(data));
                if (object.codE === 0) {
                    if(object.jsonResultado.length !== 0){
                        this.formulario.controls['idRol'].setValue('');
                        console.log(this.formulario.controls['idRol'].setValue(''));
                        this.getObjecAllRol = object.jsonResultado;
                        
                    }else{
                        this.getObjecAllRol = [];
                        this.notifications.info("No se encontraron resultados para su búsqueda");
                    }
                }
            },
            error => {
                super.loading(false);
                this.notifications.error('Error de servicio');
            },
            () => super.loading(false)
        );
    }



    public buscar(): void {
        if (this.formulario.valid) {
            console.log(this.formulario.value);
            this.cargarArbol();
            this.asignarModulos=true;
             
            // super.loading(true);
            // let path: string = '/AsesorBig/api/portal/seguridad/grupos/alta';
            // this.service.post(this.formulario.value, path, 1).subscribe(
            //     data => {
            //         let object = JSON.parse(JSON.stringify(data));
            //         if (object.codE === 0) {
            //             this.getAll();
            //             this.notifications.success(object.msgE);
            //         }
            //     },
            //     error => {
            //         super.loading(false);
            //         this.notifications.error('Error de servicio');
            //     }
            // );
        }
    }

    public asignar(): void {
        if (this.formulario.valid) {
            console.log(this.permisos);
            console.log(this.antigua,"esta es antigua");
            this.actualizar(this.permisos,this.antigua);
            
            // super.loading(true);
            // let path: string = '/AsesorBig/api/portal/seguridad/grupos/alta';
            // this.service.post(this.formulario.value, path, 1).subscribe(
            //     data => {
            //         let object = JSON.parse(JSON.stringify(data));
            //         if (object.codE === 0) {
            //             this.getAll();
            //             this.notifications.success(object.msgE);
            //         }
            //     },
            //     error => {
            //         super.loading(false);
            //         this.notifications.error('Error de servicio');
            //     }
            // );
        }
    }
    cargarArbol() {
    super.loading(true);
    let path: string = '/AsesorBig/api/portal/seguridad/mantenimientoMenu/consulta/permiso/rol';
    this.service.post(this.formulario.value, path, 1).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        if (object.codE === 0) {
          let _permisos = new Permisos(object.jsonResultado[0],null);
          _permisos.child=this._asignar(_permisos.child,_permisos);
          _permisos.toggle();
          this.antigua=[object.jsonResultado[0]];
          this.permisos=[_permisos];
          
        } else {
          console.log("Error al obtener los datos");
        }
      }, error => {
        console.log("error del servidor");
      },
      () => super.loading(false)
    );
  }
  //creacion de nuevo arry de objetos Permisos
  _asignar(object,todo){
      let element: any[]=[];
      if (object!==undefined) {
        for (var index = 0; index < object.length; index++) {
            element.push(new Permisos(object[index],todo));
            if(element[index].child!==null){
                element[index].child=this._asignar(element[index].child,element[index]);
            }
          
        }
      }
      return element;
  }
  
  actualizar(object,antigua){
      let element: any[]=[];
      
      if (object!==undefined) {
        for (var index = 0; index < object.length; index++) {
            
            if (object[index].chk!==antigua[index].chk) {
                console.log("hay");
                if (object[index].chk===false) {
                    antigua[index].chk=true;
                    this.eliminar(object[index]);
                    
                }
                if(object[index].chk===true){
                    antigua[index].chk=false;
                    this.agregar(object[index]);
                    
                }
            }
            if(object[index].child!==null){
                    this.actualizar(object[index].child,antigua[index].child);
                
            }
          
        }
        this.permisos[0].toggle();
      }
  }

  eliminar(object){
    super.loading(true);
    console.log("baja");
    let params: object = {
            idGrupo: this.formulario.value.idGrupo,
            idRol: this.formulario.value.idRol,
            idMenu: object.idMenu, 
    };
    console.log(params);
    let path: string = '/AsesorBig/api/portal/seguridad/permisosMenu/baja';
    this.service.post(params, path, 1).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        if (object.codE === 0) {
          console.log(object);
          this.notifications.success(object.msgE);
        } else {
          this.notifications.error(object.msgE);
        }
      }, error => {
        super.loading(false);
        this.notifications.error(object.msgE);
      },
      () => super.loading(false)
    );
  }

  agregar(object){
    super.loading(true);
    console.log("alta");
    let params: object = {
            idGrupo: this.formulario.value.idGrupo,
            idRol: this.formulario.value.idRol,
            idMenu: object.idMenu, 
    };
    console.log(params);
    let path: string = '/AsesorBig/api/portal/seguridad/permisosMenu/alta';
    this.service.post(params, path, 1).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        if (object.codE === 0) {
          console.log(object);
          this.notifications.success(object.msgE);
        } else {
          this.notifications.error(object.msgE);
        }
      }, error => {
        super.loading(false);
        this.notifications.error(object.msgE);
      },
      () => super.loading(false)
    );
  }
  
}


