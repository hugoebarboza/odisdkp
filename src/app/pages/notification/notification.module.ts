import { NgModule } from '@angular/core';

// COMPONENTS
import { NotificationComponent } from './notification-list/notification.component';
import { NotificationReadComponent } from './components/notification-read/notificationread.component';
import { NotificationUnreadComponent } from './components/notification-unread/notification-unread.component';


// MODULES
import { SharedModule } from '../../components/shared/shared.module';


// ROUTING
import { NotificationRoutingModule } from './notification.routing';

@NgModule({
  imports: [
    NotificationRoutingModule,
    SharedModule
  ],
  declarations: [NotificationComponent, NotificationReadComponent, NotificationUnreadComponent],
  providers: [
  ],
})
export class NotificationModule { }
