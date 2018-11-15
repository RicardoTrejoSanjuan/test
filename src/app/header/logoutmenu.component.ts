import { Component, OnInit} from '@angular/core';
import { Router, RouterLink} from '@angular/router';

import { ClassGenerica} from '../classGeneric/config';

import { Service } from '../service/service';



@Component({
  	selector: 'logout-menu',
    styleUrls: ['template/header.component.css'],
  	templateUrl: 'template/header.component.html',
})



export class MenuLogoutComponent extends ClassGenerica{
  constructor(
  	public router: Router,
    private service : Service,
  	){
    super();

    this.onLogout();

  }

  showAlert: boolean = false;
  MsgAlert: string;

  onLogout():void {

    super.loading(true);
    
    console.log("logout");

  	this.service.get('/AsesorBig/api/big/logout',1).subscribe(
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
