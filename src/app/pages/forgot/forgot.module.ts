import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// COMPONETS
import { ForgotpasswordComponent } from './components/forgotpassword.component';

// MATERIAL
import { MatCardModule } from '@angular/material/card';

// ROUTING
import { ForgotRoutingModule } from './forgot.routing';

// UTILITYS
import { NgxCaptchaModule } from 'ngx-captcha';


@NgModule({
  declarations: [ForgotpasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    ForgotRoutingModule,
    MatCardModule,
    NgxCaptchaModule,
    ReactiveFormsModule
  ],
  exports: [],
  providers: [],
  bootstrap: [ForgotpasswordComponent]
})
export class ForgotModule { }
