import { Component, OnInit} from '@angular/core';
import { Router, RouterLink} from '@angular/router';

import { ClassGenerica} from '../classGeneric/config';

import { Service } from '../service/service';

const homeIcon = require('images/header/biglogo.png');

@Component({
  	selector: 'logout-menu',
    styleUrls: ['template/header.component.css'],
  	templateUrl: 'template/menu.component.html',
})



export class MenuLogoutComponent extends ClassGenerica{
  public descipcionMenuHeader: string;
  constructor(
  	public router: Router,
    private service : Service,
  	){
    super();

    if (this.getParentsData() !== null) {
      this.descipcionMenuHeader = this.getParentsData().name;
    }



    this.onLogout();

    window.onload = () => {
      var homeImg = <HTMLInputElement>document.getElementById('logo');
      console.log(homeImg);
      if (homeImg !== null) {
        homeImg.src = homeIcon;
      }
    };

  }

  showAlert: boolean = false;
  MsgAlert: string;

  onLogout():void {

  	super.loading(true);

  	this.service.get('AsesorBig/api/big/logout',1).subscribe(
  		    data => {
            let object = JSON.parse(JSON.stringify(data));

  		    	if(object.codE === 0){
                  super.delteAllSessionStorage();
	                this.router.navigate(['./login']);
	            }else{
	                this.MsgAlert = object.msgE;
	                this.showAlert = true;
	            }
            },
            error => {
              super.delteAllSessionStorage();
              this.router.navigate(['./login']);
              this.MsgAlert = error;
              this.showAlert = true;
              super.loading(false);
            },
            () => super.loading(false)
  	);
    
  }
}
