import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PROVIDERS
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from '../../providers/interceptor/my.interceptor';


// COMPONENTS
import { CreateFormComponent } from './create-form/create-form.component';
import { EditFormComponent } from './dialog/edit-form/edit-form.component';
import { FormviewComponent } from './formview/formview.component';
import { MakeFormComponent } from './dialog/make-form/make-form.component';
import { OrderViewComponent } from './order-view/order-view.component';

// DIALOG

// MODULES
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

// MOMENT
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


// ROUTING
import { DirectiveModule } from 'src/app/directives/directive.module';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomformRoutingModule } from './customform.routing';

// MODULES
import { SupportModule } from '../support/support.module';



@NgModule({
  imports: [
    CommonModule,
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
    CreateFormComponent,
    EditFormComponent,
    FormviewComponent,
    MakeFormComponent,
    OrderViewComponent,
  ],
  entryComponents: [
    EditFormComponent,
    MakeFormComponent,
  ],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: LOCALE_ID, useValue: 'es' },
    {provide: MAT_DATE_LOCALE, useValue: 'es'},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true },
  ],
})
export class CustomformModule { }


