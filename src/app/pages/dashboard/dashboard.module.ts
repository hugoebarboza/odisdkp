import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// COMPONENTS
import { DashboardComponent } from './dashboard-list/dashboard.component';
import { ProjectListComponent } from './components/project-list/project-list.component';

// PROVIDERS
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from '../../providers/interceptor/index';


// MODULES
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

// ROUTING
import { DashboardRoutingModule } from './dashboard.routing';

// SERVICES
// import { MessagingService } from 'src/app/services/service.index';



@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HttpClientModule,
    PipesModule,
    SharedModule
  ],
  declarations: [DashboardComponent, ProjectListComponent],
  providers: [
    httpInterceptorProviders,
    // MessagingService,
  ],
})
export class DashboardModule { }
