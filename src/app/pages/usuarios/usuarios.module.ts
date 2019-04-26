import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//MODULES
import { MaterialModule } from '../../material-module';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

//COMPONENTS
import { UsuariosComponent } from './usuarios-list/usuarios.component';

//DIALOG
import { AddUserComponent } from './dialog/adduser/adduser.component';
import { EditUserComponent } from './dialog/edituser/edituser.component';
import { ModalUploadImageComponent } from './dialog/modaluploadimage/modaluploadimage.component';
import { ShowProfileSecurityComponent } from './dialog/showprofilesecurity/showprofilesecurity.component';

//ROUTING
import { UsuariosRoutingModule } from './usuarios.routing';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    PipesModule,
    SharedModule,
    UsuariosRoutingModule,
  ],
  declarations: [
    AddUserComponent,
    EditUserComponent,
    ModalUploadImageComponent,
    ShowProfileSecurityComponent,
    UsuariosComponent
  ],
  entryComponents: [
    AddUserComponent,
    EditUserComponent,
    ModalUploadImageComponent,
    ShowProfileSecurityComponent,
  ],  
})
export class UsuariosModule { }