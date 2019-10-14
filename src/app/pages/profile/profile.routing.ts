import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//COMPONENT
import { ProfileComponent } from './profile-list/profile.component';

//Guards
import { AuthguardService } from '../../services/authguard.service';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    canActivate: [AuthguardService],
    data: { path: 'profile', titulo: 'OCA Global - ODIS Perfil de usuario', subtitle: 'Perfil del Usuario', descripcion: 'OCA Global - ODIS Profile Managment'} 
  },
  { path:'**', pathMatch: 'full', redirectTo: '/notfound', data: { titulo: 'OCA Global - ODIS 404', subtitle: '', descripcion: 'OCA Global - ODIS User 404'  } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthguardService]
})
export class ProfileRoutingModule { }