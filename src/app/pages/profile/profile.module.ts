import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PROVIDERS
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from '../../providers/interceptor/index';

// COMPONENTS
import { ProfileComponent } from './profile-list/profile.component';

// MODULES
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

// ROUTING
import { ProfileRoutingModule } from './profile.routing';

// SERVICES
// import { ServiceModule } from 'src/app/services/service.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    PipesModule,
    ProfileRoutingModule,
    // ServiceModule,
    SharedModule
  ],
  declarations: [ProfileComponent],
  providers: [
    httpInterceptorProviders,
  ],
})
export class ProfileModule { }
