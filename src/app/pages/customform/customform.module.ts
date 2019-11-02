import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PROVIDERS
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from '../../providers/interceptor/my.interceptor';


// COMPONENTS
import { FormviewComponent } from './formview/formview.component';
import { OrderViewComponent } from './order-view/order-view.component';

// DIALOG

// MODULES
// import { MaterialModule } from '../../material-module';
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
    // MaterialModule,
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
    FormviewComponent,
    OrderViewComponent,
  ],
  entryComponents: [
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


