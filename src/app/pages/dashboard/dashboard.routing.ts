import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard-list/dashboard.component';

// Guards
import { AuthguardService } from '../../services/authguard.service';


const routes: Routes = [
  {
  path: '',
  component: DashboardComponent,
  canActivate: [AuthguardService],
  data: { path: 'dashboard', titulo: 'OCA Global - ODIS Gestión', subtitle: 'Dashboard', descripcion: 'OCA Global - ODIS Dashboard' }
  },
  { path: '**', pathMatch: 'full', redirectTo: '/notfound', data: { titulo: 'OCA Global - ODIS 404', subtitle: '', descripcion: 'OCA Global - ODIS User 404'  } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthguardService]
})
export class DashboardRoutingModule { }
