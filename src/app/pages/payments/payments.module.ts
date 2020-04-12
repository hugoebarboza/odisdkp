import { NgModule } from '@angular/core';

// COMPONENTS
import { PaymentComponent } from './payment/payment.component';
import { PaymentReportComponent } from './payment-report/payment-report.component';

// MODULES
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../components/shared/shared.module';

// ROUTING
import { PaymentsRoutingModule } from './payments.routing';

// DIRECTIVES
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  imports: [
    CalendarModule,
    NgSelectModule,
    NgbTypeaheadModule,
    PaymentsRoutingModule,
    SharedModule,
  ],
  exports: [],
  declarations: [
    PaymentComponent,
    PaymentReportComponent,
  ],
  entryComponents: [],
})

export class PaymentsModule { }
