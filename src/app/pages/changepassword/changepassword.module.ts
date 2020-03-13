import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PROVIDERS
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from '../../providers/interceptor/index';


// MODULES
import { SharedModule } from '../../components/shared/shared.module';

// PIPE MODULE
import { PipesModule } from '../../pipes/pipes.module';

import { ChangePasswordRoutingModule } from './changepassword.routing';
import { ChangepasswordComponent } from './changepassword-list/changepassword.component';

// SERVICES
import { ServiceModule } from 'src/app/services/service.module';


@NgModule({
  imports: [
    CommonModule,
    ChangePasswordRoutingModule,
    FormsModule,
    HttpClientModule,
    PipesModule,
    ReactiveFormsModule,
    ServiceModule,
    SharedModule
  ],
  declarations: [ChangepasswordComponent],
  providers: [
    httpInterceptorProviders,
  ],
})
export class ChangePasswordModule { }
