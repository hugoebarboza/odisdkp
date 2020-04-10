import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENT
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: { titulo: 'OCA Global - ODIS Acceso', subtitle: 'Acceso', descripcion: 'OCA Global - ODIS User Login' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { titulo: 'OCA Global - ODIS Acceso', subtitle: 'Acceso', descripcion: 'OCA Global - ODIS User Login' }
  },
  {
    path: 'logout/:sure',
    component: LoginComponent,
    data: { titulo: 'OCA Global - ODIS Acceso', subtitle: '', descripcion: 'OCA Global - ODIS User Login' }
  },
  {
    path: '**', pathMatch: 'full', redirectTo: '/notfound', data: { titulo: 'OCA Global - ODIS 404', subtitle: '', descripcion: 'OCA Global - ODIS User 404'  }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class LoginRoutingModule { }
