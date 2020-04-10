import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { CoreModule } from '../../core.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

// ROUTING
import { DirectiveModule } from 'src/app/directives/directive.module';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomformRoutingModule } from './customform.routing';

// MODULES
import { SupportModule } from '../support/support.module';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    DirectiveModule,
    FormsModule,
    PipesModule,
    ReactiveFormsModule,
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


