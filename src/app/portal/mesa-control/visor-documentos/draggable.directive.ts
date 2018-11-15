import {
    Directive,
    HostListener,
    ElementRef,
    Renderer
} from '@angular/core';

class Position {
    constructor(public x: number, public y: number) { }
}

export class Transform {
    constructor(private escale: number, private grades: number) { }
}

@Directive({ selector: '[ngDraggable]' })

export class DraggableDirective {

    private draggable: boolean = false;
    private origin: Position = null;
    private escale: number = 1;
    private grades: number = 0;

    constructor(private el: ElementRef, private renderer: Renderer) { }

    // Support Mouse Events:
    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        //event.stopPropagation();
        this.draggable = true;
        this.origin = this.getPosition(event.clientX, event.clientY);
    }
    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (this.draggable) {
            this.moveTo(event.clientX, event.clientY);
        }
    }
    @HostListener('document:mouseup')
    onMouseUp() {
        this.draggable = false;
    }
    @HostListener('document:mouseleave')
    onMouseLeave() {
        this.draggable = false;
    }
    @HostListener('wheel', ['$event'])
    onMouseWheel(event: MouseEvent) {
        let _evt: any = event;
        _evt.preventDefault();
        if (_evt.wheelDeltaY > 3) {
            this.escale += 0.05;
            this.zoom(this.escale);
        }
        if (_evt.wheelDeltaY < -3) {
            this.escale -= 0.05;
            this.zoom(this.escale);
        }
    }
    private getPosition(x: number, y: number): any {
        let left: number = Number(this.el.nativeElement.style.left.replace('px', ''));
        let top: number = Number(this.el.nativeElement.style.top.replace('px', ''));
        if (window) {
            let _left: any = window.getComputedStyle(this.el.nativeElement, null).getPropertyValue('left');
            let _top: any = window.getComputedStyle(this.el.nativeElement, null).getPropertyValue('top');
            left = Number(_left.replace('px', ''));
            top = Number(_top.replace('px', ''));
        }
        return new Position(x - left, y - top);
    }
    public zoomImage(_increase: number): void {
        this.escale += _increase;
        this.zoom(this.escale);
    }
    private zoom(_escala: number): void {
        if (_escala < 0.09) {
            _escala = 0.09;
        } else if (_escala > 3.5) {
            _escala = 3.5;
        }
        this.escale = _escala;
        this.renderer.setElementStyle(this.el.nativeElement, 'transform', `scale(${this.escale}, ${this.escale}) rotate(${this.grades}deg)`);
    }
    public rotate(): any {
        this.grades += 90;
        this.grades = this.grades >= 360 ? this.grades % 90 : this.grades;
        this.renderer.setElementStyle(this.el.nativeElement, 'transform', `scale(${this.escale}, ${this.escale}) rotate(${this.grades}deg)`);
        return new Transform(this.escale, this.grades);
    }

    public updateTranform(_transform: any): any {
        this.grades = _transform.grades;
        this.renderer.setElementStyle(this.el.nativeElement, 'transform', `scale(${_transform.escale}, ${_transform.escale}) rotate(${_transform.grades}deg)`);
    }

    private moveTo(x: number, y: number): void {
        this.renderer.setElementStyle(this.el.nativeElement, 'left', `${x - this.origin.x}px`);
        this.renderer.setElementStyle(this.el.nativeElement, 'top', `${y - this.origin.y}px`);
    }

}
