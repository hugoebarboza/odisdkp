import { NgModule } from '@angular/core';

// COMPONENTS
import { AtributoAlertComponent } from './atributo-alert/atributo-alert.component';
import { CreateFormComponent } from './create-form/create-form.component';
import { EditFormComponent } from './dialog/edit-form/edit-form.component';
import { EditNotificationComponent } from './atributo-alert/dialog/edit-notification/edit-notification.component';
import { FormviewComponent } from './formview/formview.component';
import { FormularioComponent } from './formulario/formulario.component';
import { ListNotificationComponent } from './atributo-alert/dialog/list-notification/list-notification.component';
import { MakeFormComponent } from './dialog/make-form/make-form.component';
import { NewAlertComponent } from './atributo-alert/dialog/new-alert/new-alert.component';
import { NewelementComponent } from './formulario/newelement/newelement.component';
import { OrderViewComponent } from './order-view/order-view.component';

// MODULES
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../components/shared/shared.module';

// ROUTING
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomformRoutingModule } from './customform.routing';

// MODULES
import { SupportModule } from '../support/support.module';

@NgModule({
  imports: [
    CustomformRoutingModule,
    NgSelectModule,
    SupportModule,
    SharedModule,
    NgbTypeaheadModule,
  ],
  declarations:
  [
    AtributoAlertComponent,
    CreateFormComponent,
    EditFormComponent,
    EditNotificationComponent,
    FormviewComponent,
    FormularioComponent,
    ListNotificationComponent,
    MakeFormComponent,
    NewAlertComponent,
    NewelementComponent,
    OrderViewComponent,
  ],
  entryComponents: [
    EditFormComponent,
    EditNotificationComponent,
    ListNotificationComponent,
    MakeFormComponent,
    NewAlertComponent
  ],
  providers: [
  ],
})
export class CustomformModule { }


