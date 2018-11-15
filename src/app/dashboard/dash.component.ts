import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ClassGenerica} from '../classGeneric/config';
import { Service } from '../service/service';

import { Notifications } from '../classGeneric/notifications';

@Component({
    selector: 'my-dashboard',
    styleUrls: ['template/menu.component.css'],
    templateUrl: 'template/dashboard.component.html',
})



export class DashboardComponent extends ClassGenerica implements OnInit{

  QueryArrayObjectMenu:Array<Object>;
  QuerychildArray = new Array();

  constructor(
    private service : Service,
    private notifications: Notifications,
    ) {
    super();

    // *******  Menu navegacion *******
    super.deletegetObject2(true);
    console.log("Dash Componet");

    let contentOrderBy = [{pahtUrl: '/dashboard',name:'Home',class:'colorBread',parentStatus:false}];
    sessionStorage.setItem('menuNavigation',super.encryptAESLocal(contentOrderBy));

  }

  	child:Array<Object>;
    path:string;




    ngOnInit(): void {
      this.permisos();
    }


    permisos(): any{

      super.loading(true);

      this.path = '/AsesorBig/api/portal/menu/permisosF';

      let object: any = {};
      // object.idUsuario = super.isKeyUser();

      // this.service.post(object,this.path,1).subscribe(
      //   data=>{
      //      let object = JSON.parse(JSON.stringify(data));
      //      if(object.codE === 0){
      //        console.log(object);

      //        let arrayRutasPermiso = this.addToArrayChild(object.jsonResultado[0]);
      //        let permisos: any = {};
      //         permisos.arbol = object.jsonResultado[0];
      //         permisos.pathArray = arrayRutasPermiso;

      //        sessionStorage.setItem('permisos',super.encryptAESLocal(permisos));
      //        this.child = this.datapermisos().child;
      //      }else{
      //       super.loading(false);
      //       this.notifications.error(object.jsonResultado);
      //      }
      //   },
      //   error=>{
      //     super.loading(false);
      //   },
      //   ()=>super.loading(false)
      //  );


      this.service.postHttpClient(object, this.path, 1).subscribe(
        result => {
          super.httpEventType(result, body => {
            let response = this.service.httpClientEncryptAES(body);
            let object = JSON.parse(JSON.stringify(response));
            super.loading(false)

            if (object.codE === 0) {
              console.log(object);

              let arrayRutasPermiso = this.addToArrayChild(object.jsonResultado[0]);
              let permisos: any = {};
              permisos.arbol = object.jsonResultado[0];
              permisos.pathArray = arrayRutasPermiso;

              sessionStorage.setItem('permisos', super.encryptAESLocal(permisos));
              this.child = this.datapermisos().child;
            } else {
              super.loading(false);
              this.notifications.error(object.jsonResultado);
            }

          });
        },
        (err: HttpErrorResponse) => {
          super.loading(false)
          let error = JSON.parse(JSON.stringify(this.service.httpErrorResponse(err)));
          this.notifications.error(error.msgAlert);
        }
      );




    }


    addToArrayChild(obj):Array<Object>{
      let childArray = this.iterarObjChield(obj.child);
      let array = [];

      for(let a in childArray){
        if(childArray.hasOwnProperty(a)){
          let object = JSON.parse(JSON.stringify(childArray[a]));
          if(object.url !== null){
            let pathSplit = (object.url.split("#").join("")).trim();
            let validPrimerCaracter = pathSplit.substring(0,1);
            if(validPrimerCaracter !== '/'){
              pathSplit = "/"+pathSplit;
            }
            array.push({url:pathSplit});
          }
        }
      }
      return array;
    }

    iterarObjChield(obj):Array<Object>{
      for (let i in obj){
        if(obj.hasOwnProperty(i)){
          let child;
          this.QuerychildArray.push({url:obj[i].url});
          if(obj[i].child !== null){
            child = obj[i].child;
            this.iterarObjChield(child);
          }
        }
      }
      return this.QuerychildArray;
    }

}
