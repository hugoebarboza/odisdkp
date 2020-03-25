import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// COMPONENTS
import { ActiveUsersComponent } from './components/active-users/active-users.component';

@NgModule({
  declarations: [ActiveUsersComponent],
  imports: [
    CommonModule
  ],
  exports: [],
  providers: [],
  bootstrap: [ActiveUsersComponent]
})
export class ActiveUsersModule { }
