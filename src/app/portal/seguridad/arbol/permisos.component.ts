export class Permisos{
    public textoMenu: string;
    files: any[];
    expanded:boolean;
    child:any[];
    chk:boolean;
    claseFondo:any;
    claseIcono:any;
    color:string;
    descripcion:any;
    idMenu:number;
    idMenuParent:number;
    imagen:any;
    status:number;
    url:string;
    todo: Permisos[]=[];
    band: boolean=true;
    constructor(object,todo) {
        this.textoMenu= object.textoMenu;
        this.files= object.files;
        this.expanded=object.expanded;
        this.child=object.child;
        this.claseFondo=object.claseFondo;
        this.claseIcono=object.claseIcono;
        this.color=object.color;
        this.descripcion=object.descripcion;
        this.idMenu=object.idMenu;
        this.idMenuParent=object.idMenuParent;
        this.imagen=object.imagen;
        this.status=object.status;
        this.url=object.url;
        this.textoMenu = object.textoMenu;
        this.files = object.files;
        this.child = object.child;
        this.expanded = false;
        this.chk = object.chk;
        this.todo=todo;
    }
    toggle(){
        if (this.child!==null) {
             this.expanded = !this.expanded;
        }
       
    }
    check(){
        let newState = !this.chk;
        this.chk = newState; 
        let padre=this.todo;
        this.checkRecursive(newState);
        this.checkPadre(newState,padre);
    }
    checkRecursive(state){
        if (this.child!==null ) {
            this.child.forEach(d => {
                d.chk = state;
                d.checkRecursive(state);
            });
        }
    }
    
    checkPadre(state,todo){
        if (state) {
            if(todo!==null){
                todo.chk=true;
                todo.checkPadre(state,todo.todo);
            }
            
        }
        
    }
    
    
}