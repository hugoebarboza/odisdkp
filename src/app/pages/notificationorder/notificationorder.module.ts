import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

// COMPONENTS
import { NotificationOrderComponent } from './components/notificationorder/notificationorder.component';
import { ShowLabelNotificationComponent } from './dialog/show-label-notification/show-label-notification.component';
import { ShowNotificacionComponent } from './dialog/show-notificacion/show-notificacion.component';

// DIRECTIVES
import { DirectiveModule } from 'src/app/directives/directive.module';

// MODULES
import { CoreModule } from '../../core.module';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';
import { ToastrModule } from 'ngx-toastr';


// ROUTER
import { NotificactionOrderRoutingModule } from './notificationorder.routes';


@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    DirectiveModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    MatProgressButtonsModule,
    NgbModule,
    NgSelectModule,
    PipesModule,
    ReactiveFormsModule,
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
