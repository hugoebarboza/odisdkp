import { NgModule } from '@angular/core';

// COMPONENTS
import { ChangepasswordComponent } from './changepassword-list/changepassword.component';

// MODULES
import { SharedModule } from '../../components/shared/shared.module';


import { ChangePasswordRoutingModule } from './changepassword.routing';

@NgModule({
  imports: [
    ChangePasswordRoutingModule,
    SharedModule
  ],
  declarations: [ChangepasswordComponent],
  providers: [
  ],
})
export class ChangePasswordModule { }
