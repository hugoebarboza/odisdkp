import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PROVIDERS
import { HttpClientModule } from '@angular/common/http';

// COMPONENTS
import { ProfileComponent } from './profile-list/profile.component';

// MODULES
import { CoreModule } from '../../core.module';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

// ROUTING
import { ProfileRoutingModule } from './profile.routing';


@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    HttpClientModule,
    PipesModule,
    ProfileRoutingModule,
    SharedModule
  ],
  declarations: [ProfileComponent],
  providers: [
  ],
})
export class ProfileModule { }
