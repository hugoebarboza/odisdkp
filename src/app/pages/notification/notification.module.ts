import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PROVIDERS
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from '../../providers/interceptor/index';

// COMPONENTS
import { NotificationComponent } from './notification-list/notification.component';
import { NotificationReadComponent } from './components/notification-read/notificationread.component';
import { NotificationUnreadComponent } from './components/notification-unread/notification-unread.component';


// MODULES
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';


// ROUTING
import { NotificationRoutingModule } from './notification.routing';

// SERVICES
import { ServiceModule } from 'src/app/services/service.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NotificationRoutingModule,
    PipesModule,
    ServiceModule,
    SharedModule
  ],
  declarations: [NotificationComponent, NotificationReadComponent, NotificationUnreadComponent],
  providers: [
    httpInterceptorProviders
  ],
})
export class NotificationModule { }
