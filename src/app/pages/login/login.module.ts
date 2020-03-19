import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



// COMPONENTS
import { LoginComponent } from './components/login/login.component';

// MATERIAL
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// utility
import { MatProgressButtonsModule } from 'mat-progress-buttons';

// ROUTING
import { LoginRoutingModule } from './login.routing';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    LoginRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressButtonsModule.forRoot(),
    MatSlideToggleModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [],
  providers: [],
  bootstrap: [LoginComponent]
})
export class LoginModule { }
