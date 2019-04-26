import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard-list/dashboard.component';

// Guards
import { AuthguardService } from '../../services/authguard.service';


const routes: Routes = [
  { 
  path:'', 
  component: DashboardComponent, 
  canActivate: [AuthguardService],
  data: { path: 'dashboard', titulo: 'OCA Global - ODIS Gestion', subtitle: 'Dashboard', descripcion: 'OCA Global - ODIS Dashboard' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }