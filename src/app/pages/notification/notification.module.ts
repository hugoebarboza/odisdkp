import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// COMPONENTS
import { NotificationComponent } from './notification-list/notification.component';
import { NotificationReadComponent } from './components/notification-read/notificationread.component';
import { NotificationUnreadComponent } from './components/notification-unread/notification-unread.component';


// MODULES
import { CoreModule } from '../../core.module';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';


// ROUTING
import { NotificationRoutingModule } from './notification.routing';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    HttpClientModule,
    NotificationRoutingModule,
    PipesModule,
    SharedModule
  ],
  declarations: [NotificationComponent, NotificationReadComponent, NotificationUnreadComponent],
  providers: [
  ],
})
export class NotificationModule { }
