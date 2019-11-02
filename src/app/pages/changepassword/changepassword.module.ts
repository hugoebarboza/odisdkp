import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PROVIDERS
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from '../../providers/interceptor/my.interceptor';


// MODULES
// import { MaterialModule } from '../../material-module';
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
    // MaterialModule,
    PipesModule,
    ReactiveFormsModule,
    ServiceModule,
    SharedModule
  ],
  declarations: [ChangepasswordComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true },
  ],
})
export class ChangePasswordModule { }
