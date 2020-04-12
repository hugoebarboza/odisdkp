import { NgModule } from '@angular/core';

// COMPONENTS
import { NotificationOrderComponent } from './components/notificationorder/notificationorder.component';
import { ShowLabelNotificationComponent } from './dialog/show-label-notification/show-label-notification.component';
import { ShowNotificacionComponent } from './dialog/show-notificacion/show-notificacion.component';


// MODULES
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../components/shared/shared.module';
import { ToastrModule } from 'ngx-toastr';


// ROUTER
import { NotificactionOrderRoutingModule } from './notificationorder.routes';


@NgModule({
  imports: [
    MatProgressButtonsModule,
    NgbModule,
    NgSelectModule,
    NotificactionOrderRoutingModule,
    SharedModule,
    ToastrModule.forRoot(),
  ],
  declarations: [
    NotificationOrderComponent,
    ShowLabelNotificationComponent,
    ShowNotificacionComponent,
  ],
  exports: [
  ],
  entryComponents: [
    ShowLabelNotificationComponent,
    ShowNotificacionComponent
  ],
  providers: [
    NgbActiveModal,
  ],
})
export class NotificationOrderModule { }
