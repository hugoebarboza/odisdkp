import { NgModule } from '@angular/core';


// COMPONENTS
import { ProfileComponent } from './profile-list/profile.component';

// MODULES
import { SharedModule } from '../../components/shared/shared.module';

// ROUTING
import { ProfileRoutingModule } from './profile.routing';


@NgModule({
  imports: [
    ProfileRoutingModule,
    SharedModule
  ],
  declarations: [ProfileComponent],
  providers: [
  ],
})
export class ProfileModule { }
