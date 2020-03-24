import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENT
import { ForgotpasswordComponent } from './components/forgotpassword.component';


const routes: Routes = [
  {
    path: '',
    component: ForgotpasswordComponent,
    data: { titulo: 'OCA Global - ODIS Acceso', subtitle: 'Acceso', descripcion: 'OCA Global - ODIS User' }
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
export class ForgotRoutingModule { }
