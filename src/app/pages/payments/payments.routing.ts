import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENT
import { PaymentComponent } from './payment/payment.component';

// Guards
import { AuthguardService } from '../../services/authguard.service';


const routes: Routes = [
  {
    path: ':id',
    component: PaymentComponent,
    canActivate: [AuthguardService],
    data: { path: 'payments', titulo: 'OCA Global - ODIS Estado de pago', subtitle: 'Centro de Soporte', descripcion: 'OCA Global - ODIS Support Managment'}
  },
  { path: '**', pathMatch: 'full', redirectTo: '/notfound', data: { titulo: 'OCA Global - ODIS 404', subtitle: '', descripcion: 'OCA Global - ODIS User 404'  } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PaymentsRoutingModule { }
