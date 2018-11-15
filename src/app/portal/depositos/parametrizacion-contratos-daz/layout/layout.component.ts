import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { DragulaService } from 'ng2-dragula';

// import { Data } from '../instituciones';
import { ClassGenerica } from '../../../../classGeneric/config';



import { Notifications} from '../../../../classGeneric/notifications';

import { Service } from '../../../../service/service';
import * as _ from 'underscore';

import {FormControl} from '@angular/forms';

@Component({
  selector: "depositos",
  templateUrl:
    "layout.component.html",
  styleUrls: []
})
export class LayoutComponent extends ClassGenerica {
  public menuLateral: Array<Object>;

  public depositosObject: any;

  public many: Array<string>;
  public many2: Array<string>;

  public arreglo: Array<any> = [];
  public arreglonuevo: any = {
    edoCuenta: []
  };

  public guardarbtn:boolean =  true;

  constructor(
    private service: Service,
    private router: Router,
    private notifications: Notifications,
    private dragulaService: DragulaService
  ) {
    super();
    this.menuLateral = this.getMenuLateral(1);
    this.menuNavigation = this.menuNavigation();

    this.depositosObject = super.getAttr("depositos");
    console.log(this.depositosObject);

    // dragulaService.drag.subscribe((value) => {
    //   this.onDrag(value.slice(1));
    // });
    dragulaService.drop.subscribe(value => {
      this.onDrop(value.slice(1));
    });
    // dragulaService.over.subscribe((value) => {
    //   this.onOver(value.slice(1));
    // });
    // dragulaService.out.subscribe((value) => {
    //   this.onOut(value.slice(1));
    // });

    this.consultascampoposicionesService();
    this.consultascampoposicionesServiceAgregados();
  }

  // public many: Array<string>;// = ['Referencia1', 'Referencia2', 'Referencia3', 'Monto de el deposito!','Monto o porcentaje','canal',];
  // public many2: Array<string>;// = ['Forma de cobro1', 'Forma de cobro2'];

  private consultascampoposicionesService(): void {
    super.loading(true);

    let path = "/depositoazteca/layout/consultascampoposicionesService/";
    let parameter: any = {
      idInstitucion: this.depositosObject.idInst,
      idPais: this.depositosObject.idPais,
      idCta: this.depositosObject.idCuenta,
      idContrato: this.depositosObject.idContratoDaz
    };
    console.log(parameter);
    this.service.post(parameter, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        console.log(object);
        if (object.codE === 0 && object.jsonResultado !== null) {
          this.many = object.jsonResultado;
        } else {
          this.notifications.error(object.msgE);
        }
      },
      error => {
        super.loading(false);
        this.notifications.error("Error de servicio");
      },
      () => super.loading(false)
    );
  }

  private consultascampoposicionesServiceAgregados(): void {
    super.loading(true);

    let path = "/depositoazteca/layout/camposconfigurados/";
    let parameter: any = {
      idInstitucion: this.depositosObject.idInst,
      idPais: this.depositosObject.idPais,
      idCta: this.depositosObject.idCuenta,
      idContrato: this.depositosObject.idContratoDaz
    };
    console.log(parameter);
    this.service.post(parameter, path, 3).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        console.log(object);
        if (object.codE === 0 && object.jsonResultado !== null) {
          this.many2 = object.jsonResultado;
        } else {
          this.notifications.error(object.msgE);
        }
      },
      error => {
        super.loading(false);
        this.notifications.error("Error de servicio");
      },
      () => super.loading(false)
    );
  }

  private onDrop(args) {
    this.arreglo = [];

    let posicion:any;

    if (args[1].id === "box2") {
      console.log("primer if");
      posicion = 1;
    }
    if (args[2].id === "box2") {
      console.log("segundo if");
      posicion = 2;
    }

    for (let item of args[posicion].children) {
      this.arreglo.push({
        idInstitucion: this.depositosObject.idInst,
        idPais: this.depositosObject.idPais,
        idCuenta: this.depositosObject.idCuenta,
        idContratoDaz: this.depositosObject.idContratoDaz,
        idCampo: Number(item.id),
        posicion: this.arreglo.length + 1
      });
    }

    console.log(this.arreglo);

    this.arreglonuevo.edoCuenta = this.arreglo;

    this.guardarbtn = false;

  }

  public Guardar() {
    let path = "/depositoazteca/edo/layout/EdoCuenta/";
    let parameter: any = this.arreglonuevo;
    console.log(parameter);

    if(parameter.edoCuenta.length !== 0){
      super.loading(true);
      this.service.post(parameter, path, 3).subscribe(
        data => {
          let object = JSON.parse(JSON.stringify(data));

          console.log(object);
          if (object.codE === 0) {
            this.notifications.success("Configuracion guardada exitosamente");
            this.consultascampoposicionesService();
            this.consultascampoposicionesServiceAgregados();
          } else {
            this.notifications.error(object.msgE);
          }
        },
        error => {
          super.loading(false);
          this.notifications.error("Error de servicio");
        },
        () => super.loading(false)
      );
    }
  }
}
