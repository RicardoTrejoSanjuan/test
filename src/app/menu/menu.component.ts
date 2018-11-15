import { Component, OnInit} from '@angular/core';
import { Router, RouterLink} from '@angular/router';

import { ClassGenerica} from '../classGeneric/config';

import { Service } from '../service/service';

const homeIcon = require('images/header/biglogo.png');

@Component({
  	selector: 'my-menu',
    styleUrls: ['template/header.component.css'],
  	templateUrl: 'template/menu.component.html',
})
export class MenuComponent extends ClassGenerica implements OnInit{
  constructor(){
    super();
  }
  ngOnInit() {
    var homeImg = <HTMLInputElement>document.getElementById('logo');
    if (homeImg !== null) {
      homeImg.src = homeIcon;
    }
  }

}
