import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//COMPONENTS
import { DashboardComponent } from './dashboard-list/dashboard.component';

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
    PipesModule,
    ServiceModule,
    SharedModule
  ],
  declarations: [DashboardComponent],
  providers: [MessagingService],
})
export class DashboardModule { }