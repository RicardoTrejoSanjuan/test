import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClassGenerica } from '../../../../classGeneric/config';

@Component({
    selector: 'my-ipscomp',
    templateUrl: 'ips.html',
})


export class IpsComponent extends ClassGenerica {

    menuLateral: Array<Object>;

    constructor( private router: Router){        
        super();
        console.log('ips Component');
        this.menuLateral = this.getMenuLateral();
        this.menuNavigation = this.menuNavigation();
        
        /*
        let pathredirec = JSON.parse(JSON.stringify(this.menuLateral[0])).url;
        this.router.navigate([pathredirec]);
        */
    }

}