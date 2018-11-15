import { Component } from '@angular/core';
import { Router, } from '@angular/router';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ValidationService } from '../../../validator/validation.service';

import { ClassGenerica } from '../../../classGeneric/config';

import { Pagination } from '../../../classGeneric/pagination';

import { Notifications } from '../../../classGeneric/notifications';


import { Service } from '../../../service/service';

import { JsonToCsv } from '../../../classGeneric/jsontocsv';


import { PaginationFron } from '../../../classGeneric/paginationFront';

var jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: "grupos",
  templateUrl: "template/grupos.component.html",
  styleUrls: ["template/grupos.css"],
})
export class GruposComponent extends ClassGenerica {
  menuLateral: Array<Object>;
  getObjecAll: Array<Object>;
  formulario: any;
  save: boolean;
  editDelete: boolean;
  modalFormulario: boolean;
  modalAlert: boolean;

  showDialogAlert: Boolean = false;

  pager: any = {};
  pagedItems: Array<Object>;
  constructor(
    private service: Service,
    private notifications: Notifications,
    private jsonToCsv: JsonToCsv,
    private formBuilder: FormBuilder,
    private paginationfron: PaginationFron,
  ) {
    super();
    this.menuNavigation = this.menuNavigation();
    this.menuLateral = this.getMenuLateral(1);
    this.getAll();

    this.formulario = this.formBuilder.group({
      idGrupo: ["", [Validators.required, ValidationService.validarNumeros]],
      descripcion: ["", [Validators.required]],
      status: ["1", [Validators.required]]
    });
  }

  setPage(page: number, rango?: number, total?: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.paginationfron.getPager(total, page, rango);
    this.pagedItems = this.paginationfron.getPagerdata([], page);
  }

  private getAll(): void {
    super.loading(true);
    let path = "/AsesorBig/api/portal/seguridad/grupos/consulta";
    let object: any = {
      idGrupo: null
    };
    this.service.post(object, path, 1).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        if (object.codE === 0) {
          this.pager = this.paginationfron.getPager(
            object.jsonResultado.length,
            1,
            50
          );
          this.pagedItems = this.paginationfron.getPagerdata(
            object.jsonResultado
          );
        }
      },
      error => {
        super.loading(false);
        this.notifications.error("Error de servicio");
      },
      () => super.loading(false)
    );
  }

  public openForm(): void {
    this.modalFormulario = true;
    this.save = true;
    this.editDelete = false;
    this.formulario.controls["idGrupo"].setValue("");
    this.formulario.controls["descripcion"].setValue("");
    this.formulario.controls["status"].setValue("1");
  }
  public detalle(obj): void {
    this.modalFormulario = true;
    this.save = false;
    this.editDelete = true;
    this.formulario.controls["idGrupo"].setValue(String(obj.idGrupo));
    this.formulario.controls["descripcion"].setValue(String(obj.descripcion));
    this.formulario.controls["status"].setValue(String(obj.status));
  }

  public saveEditForm(): void {
    if (this.formulario.valid) {
      super.loading(true);
      this.modalFormulario = false;
      let path: string;
      if (this.save === true) {
        path = "/AsesorBig/api/portal/seguridad/grupos/alta";
      } else {
        path = "/AsesorBig/api/portal/seguridad/grupos/actualiza";
      }
      this.service.post(this.formulario.value, path, 1).subscribe(
        data => {
          let object = JSON.parse(JSON.stringify(data));
          if (object.codE === 0) {
            this.getAll();
            this.notifications.success(object.msgE);
          }
        },
        error => {
          super.loading(false);
          this.notifications.error("Error de servicio");
        }
      );
    }
  }

  public delete(): void {
    super.loading(true);
    let object: any = {
      idGrupo: String(this.formulario.controls["idGrupo"].value)
    };
    this.modalFormulario = false;
    let path: string = "/AsesorBig/api/portal/seguridad/grupos/baja";
    this.service.post(object, path, 1).subscribe(
      data => {
        let object = JSON.parse(JSON.stringify(data));
        if (object.codE === 0) {
          this.getAll();
          this.notifications.success(object.msgE);
        }
      },
      error => {
        super.loading(false);
        this.notifications.error("Error de servicio");
      }
    );
  }

  public pruebas(): void {
    var columns = ["ID", "Name", "Country"];
    var rows = [
        [1, "Shaw", "Tanzania"],
        [2, "Nelson", "Kazakhstan"],
        [3, "Garcia", "Madagascar"]
    ];


    let doc = new jsPDF('p', 'pt');

    console.log(doc);
    

    doc.autoTable(columns, rows);
    doc.text(20, 20, "Gay Martín2!");
    doc.text(20, 30, "This is client-side Javascript, pumping out a PDF.");
    doc.addPage();
    doc.text(20, 20, "http://www.coding4developers.com/");

    // Save the PDF
    doc.save("Test.pdf");
  }
}


