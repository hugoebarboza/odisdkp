import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//INTERCEPTOR
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from '../../http-interceptors/my.interceptor';


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


//SERVICES
import { ServiceModule } from 'src/app/services/service.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    PipesModule,
    ServiceModule,
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
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true },    
  ],  
})
export class UsuariosModule { }