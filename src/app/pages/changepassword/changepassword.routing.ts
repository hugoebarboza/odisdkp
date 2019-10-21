import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangepasswordComponent } from './changepassword-list/changepassword.component';

// Guards
import { AuthguardService } from '../../services/authguard.service';


const routes: Routes = [
  {
    path: '',
    component: ChangepasswordComponent,
    canActivate: [AuthguardService],
    data: { path: 'change', titulo: 'OCA Global - ODIS Acceso', subtitle: 'Cambiar Clave', descripcion: 'OCA Global - ODIS User Change Password'  }
  },
  { path: '**', pathMatch: 'full', redirectTo: '/notfound', data: { titulo: 'OCA Global - ODIS 404', subtitle: '', descripcion: 'OCA Global - ODIS User 404'  } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthguardService]
})
export class ChangePasswordRoutingModule { }
