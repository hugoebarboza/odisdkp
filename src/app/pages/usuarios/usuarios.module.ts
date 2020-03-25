import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PROVIDERS
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from 'src/app/providers/interceptor/index';

// MODULES
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/components/shared/shared.module';

// COMPONENTS
import { UsuariosComponent } from './components/usuarios-list/usuarios.component';
import { UsuariosDetailComponent } from './components/usuarios-detail/usuarios-detail.component';
import { UsuarioWorkComponent } from './components/usuario-work/usuario-work.component';

// DIALOG
import { AddUserComponent } from './dialog/adduser/adduser.component';
import { EditUserComponent } from './dialog/edituser/edituser.component';
import { ModalUploadImageComponent } from './dialog/modaluploadimage/modaluploadimage.component';
import { SettingUserComponent } from './dialog/setting-user/setting-user.component';
import { ShowProfileSecurityComponent } from './dialog/showprofilesecurity/showprofilesecurity.component';

// ROUTING
import { UsuariosRoutingModule } from './usuarios.routing';


// SERVICES
// import { ServiceModule } from 'src/app/services/service.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgSelectModule,
    ReactiveFormsModule,
    PipesModule,
    // ServiceModule,
    SharedModule,
    UsuariosRoutingModule,
  ],
  declarations: [
    AddUserComponent,
    EditUserComponent,
    ModalUploadImageComponent,
    SettingUserComponent,
    ShowProfileSecurityComponent,
    UsuariosComponent,
    UsuariosDetailComponent,
    UsuarioWorkComponent,
  ],
  entryComponents: [
    AddUserComponent,
    EditUserComponent,
    ModalUploadImageComponent,
    SettingUserComponent,
    ShowProfileSecurityComponent,
  ],
  providers: [
    httpInterceptorProviders
  ],
})
export class UsuariosModule { }
