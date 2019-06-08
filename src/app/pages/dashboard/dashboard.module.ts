import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//COMPONENTS
import { DashboardComponent } from './dashboard-list/dashboard.component';

//PROVIDERS
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from '../../providers/interceptor/my.interceptor';


//MODULES
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

//ROUTING
import { DashboardRoutingModule } from './dashboard.routing';

//SERVICES
import { ServiceModule } from 'src/app/services/service.module';
import { MessagingService } from 'src/app/services/service.index';


@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HttpClientModule,
    PipesModule,
    ServiceModule,
    SharedModule
  ],
  declarations: [DashboardComponent],
  providers: [
    MessagingService,
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true },
  ],
})
export class DashboardModule { }