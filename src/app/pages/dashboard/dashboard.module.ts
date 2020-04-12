import { NgModule } from '@angular/core';

// COMPONENTS
import { DashboardComponent } from './dashboard-list/dashboard.component';
import { ProjectListComponent } from './components/project-list/project-list.component';

// MODULES
import { SharedModule } from '../../components/shared/shared.module';

// ROUTING
import { DashboardRoutingModule } from './dashboard.routing';

@NgModule({
  imports: [
    DashboardRoutingModule,
    SharedModule
  ],
  declarations: [DashboardComponent, ProjectListComponent],
  providers: [
  ],
})
export class DashboardModule { }
