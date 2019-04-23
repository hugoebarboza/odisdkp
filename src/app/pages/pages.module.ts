import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PAGES_ROUTES } from './pages.routes';

//UTILITY
import { AngularSplitModule } from 'angular-split';
import { TableModule } from 'ngx-easy-table';

//MATERIAL
import {MaterialModule} from '../material-module';


//PIPE MODULE
import { PipesModule } from '../pipes/pipes.module';

//MODULES
import { SharedModule } from '../components/shared/shared.module';


//PAGES
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';


@NgModule({
  imports: [
    PAGES_ROUTES,
    AngularSplitModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    PipesModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    TableModule
  ],
  declarations: [
    ChangepasswordComponent,
    DashboardComponent,
    ProfileComponent,
    UsuariosComponent,
  ],
  exports: [
    ChangepasswordComponent,
    DashboardComponent,
    ProfileComponent,
    UsuariosComponent,
  ],
})
export class PagesModule { }
