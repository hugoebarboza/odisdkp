import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// COMPONENTS
import { RegisterComponent } from './components/register.component';

// UTILITYS
import { NgxCaptchaModule } from 'ngx-captcha';

// ROUTER
import { RegisterRoutingModule } from './register.routing';


@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgxCaptchaModule,
    ReactiveFormsModule,
    RegisterRoutingModule
  ],
  exports: [],
  providers: [],
  bootstrap: [RegisterComponent]
})
export class RegisterModule { }
