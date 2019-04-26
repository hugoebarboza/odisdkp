import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

//MODULES
import { MaterialModule } from '../../material-module';
import { SharedModule } from '../../components/shared/shared.module';

//PIPE MODULE
import { PipesModule } from '../../pipes/pipes.module';


import { ChangePasswordRoutingModule } from './changepassword.routing';
import { ChangepasswordComponent } from './changepassword-list/changepassword.component';

@NgModule({
  imports: [
    CommonModule,
    ChangePasswordRoutingModule,
    FormsModule,
    MaterialModule,
    PipesModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [ChangepasswordComponent]
})
export class ChangePasswordModule { }
