import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// COMPONENT
import { MonitorListComponent } from './components/monitor-list/monitor-list.component';

// MODULE
import { CoreModule } from 'src/app/core.module';
import { SharedModule } from '../../components/shared/shared.module';

// ROUTER
import { MonitorRoutingModule } from './monitor-routing.module';



@NgModule({
  declarations: [MonitorListComponent],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    MonitorRoutingModule,
  ]
})
export class MonitorModule { }
