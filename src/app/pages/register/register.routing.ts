import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENT
import { RegisterComponent } from './components/register.component';


const routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
    data: { titulo: 'OCA Global - ODIS Registro', subtitle: 'Registro', descripcion: 'OCA Global - ODIS User Register' }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { titulo: 'OCA Global - ODIS Registro', subtitle: 'Registro', descripcion: 'OCA Global - ODIS User Register' }
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
export class RegisterRoutingModule { }
