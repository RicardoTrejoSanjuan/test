import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MesaControlAvatarUsuario } from './avatar.component';

@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [
        MesaControlAvatarUsuario
    ],
    providers: [],
    exports: [
        MesaControlAvatarUsuario
    ]
})
export class AvatarModule { }
