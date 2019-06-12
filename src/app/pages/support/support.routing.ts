import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//COMPONENT
import { SupportComponent } from './support-list/support.component';

//Guards
import { AuthguardService } from '../../services/authguard.service';

const routes: Routes = [
  {
    path: '',
    component: SupportComponent,
    canActivate: [AuthguardService],
    data: { path: 'support', titulo: 'OCA Global - ODIS Soporte de usuario', subtitle: 'Soporte del Usuario', descripcion: 'OCA Global - ODIS Support Managment'} 
  },
  { path:'**', pathMatch: 'full', redirectTo: '/notfound', data: { titulo: 'OCA Global - ODIS 404', subtitle: '', descripcion: 'OCA Global - ODIS User 404'  } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthguardService]
})
export class SupportRoutingModule { }