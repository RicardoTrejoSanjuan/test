import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[OnlyAlfanumerico]'
})

export class OnlyAlfanumerico {

    constructor(private el: ElementRef) { }

    @Input() OnlyAlfanumerico: boolean;

    @HostListener('keydown', ['$event']) onKeyDown(event) {
        let e = <KeyboardEvent>event;

        console.log(e.keyCode);
        console.log(this.OnlyAlfanumerico);


        if (this.OnlyAlfanumerico) {
            if ([46, 8, 9, 27, 13, 110, 32, 186].indexOf(e.keyCode) !== -1 ||

                (e.keyCode === 8 && e.ctrlKey === true) ||
                // Allow: Ctrl+A
                (e.keyCode === 65 && e.ctrlKey === true) ||
                // Allow: Ctrl+C
                (e.keyCode === 67 && e.ctrlKey === true) ||
                // Allow: Ctrl+V
                (e.keyCode === 86 && e.ctrlKey === true) ||
                // Allow: Ctrl+X
                (e.keyCode === 88 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything             
                return;
            }

            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey) || (e.altKey) || (e.keyCode < 48) || (e.keyCode > 57 && e.keyCode < 65) || (e.keyCode > 106) || (e.keyCode === 229)) {
                console.log("Tecla especial -> ", e.keyCode);
                e.preventDefault();
            }
        }
    }
}
