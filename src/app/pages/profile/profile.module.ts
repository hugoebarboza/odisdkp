import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PROVIDERS
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from '../../providers/interceptor/my.interceptor';

// COMPONENTS
import { ProfileComponent } from './profile-list/profile.component';

// MODULES
// import { MaterialModule } from '../../material-module';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

// ROUTING
import { ProfileRoutingModule } from './profile.routing';

// SERVICES
import { ServiceModule } from 'src/app/services/service.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    // MaterialModule,
    PipesModule,
    ProfileRoutingModule,
    ServiceModule,
    SharedModule
  ],
  declarations: [ProfileComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true },
  ],
})
export class ProfileModule { }
