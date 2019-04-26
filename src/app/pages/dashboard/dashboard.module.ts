import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//COMPONENTS
import { DashboardComponent } from './dashboard-list/dashboard.component';

//MODULES
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

//ROUTING
import { DashboardRoutingModule } from './dashboard.routing';


@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    PipesModule,
    SharedModule
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }