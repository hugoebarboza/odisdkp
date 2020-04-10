import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// COMPONENTS
import { ChangepasswordComponent } from './changepassword-list/changepassword.component';

// MODULES
import { CoreModule } from '../../core.module';
import { SharedModule } from '../../components/shared/shared.module';

// PIPE MODULE
import { PipesModule } from '../../pipes/pipes.module';

import { ChangePasswordRoutingModule } from './changepassword.routing';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    ChangePasswordRoutingModule,
    FormsModule,
    HttpClientModule,
    PipesModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [ChangepasswordComponent],
  providers: [
  ],
})
export class ChangePasswordModule { }
