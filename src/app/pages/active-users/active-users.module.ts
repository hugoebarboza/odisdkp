import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// COMPONENTS
import { ActiveUsersComponent } from './components/active-users/active-users.component';

// MATERIAL
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ActiveUsersComponent],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [],
  providers: [],
  bootstrap: [ActiveUsersComponent]
})
export class ActiveUsersModule { }
