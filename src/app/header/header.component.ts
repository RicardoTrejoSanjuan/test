import { Component, OnInit} from '@angular/core';

import { ClassGenerica} from '../classGeneric/config';

const biglogo = require('images/header/biglogo.png');

@Component({
  	selector: 'header',
    styleUrls: ['template/header.component.css'],
  	templateUrl: 'template/header.component.html',
})



export class MenuComponent extends ClassGenerica implements OnInit{

public descipcionMenuHeader: string;

  constructor(){
    super();
        if(this.getParentsData() !== null){
          this.descipcionMenuHeader = this.getParentsData().name;
    }
  }

  ngOnInit() {
    var homeImg = <HTMLInputElement>document.getElementById('biglogo');
    if (homeImg !== null) {
      homeImg.src = biglogo;
    }
  }

}