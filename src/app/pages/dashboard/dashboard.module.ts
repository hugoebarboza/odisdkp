import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// COMPONENTS
import { DashboardComponent } from './dashboard-list/dashboard.component';
import { ProjectListComponent } from './components/project-list/project-list.component';

// MODULES
import { CoreModule } from '../../core.module';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

// ROUTING
import { DashboardRoutingModule } from './dashboard.routing';

// SERVICES
// import { MessagingService } from 'src/app/services/service.index';



@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    DashboardRoutingModule,
    HttpClientModule,
    PipesModule,
    SharedModule
  ],
  declarations: [DashboardComponent, ProjectListComponent],
  providers: [
  ],
})
export class DashboardModule { }
