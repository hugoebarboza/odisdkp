import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// COMPONENTS
import { PaymentComponent } from './payment/payment.component';
import { PaymentReportComponent } from './payment-report/payment-report.component';

// MODULES
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

// ROUTING
import { PaymentsRoutingModule } from './payments.routing';

// DIRECTIVES
import { DirectiveModule } from 'src/app/directives/directive.module';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  imports: [
    CommonModule,
    CalendarModule,
    DirectiveModule,
    FormsModule,
    NgSelectModule,
    NgbTypeaheadModule,
    PaymentsRoutingModule,
    PipesModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [CommonModule],
  // tslint:disable-next-line:max-line-length
  declarations: [
    PaymentComponent,
    PaymentReportComponent,
  ],
  entryComponents: [],
})

export class PaymentsModule { }
