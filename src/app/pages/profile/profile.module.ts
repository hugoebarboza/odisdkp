import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

//COMPONENTS
import { ProfileComponent } from './profile-list/profile.component';

//MODULES
import { MaterialModule } from '../../material-module';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

//ROUTING
import { ProfileRoutingModule } from './profile.routing';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    PipesModule,
    ProfileRoutingModule,
    SharedModule
  ],
  declarations: [ProfileComponent]
})
export class ProfileModule { }