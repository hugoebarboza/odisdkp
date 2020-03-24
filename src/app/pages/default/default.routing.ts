import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENT
import { DefaultComponent } from './components/default.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    data: { titulo: 'OCA Global - ODIS', subtitle: 'Default', descripcion: 'OCA Global - ODIS Default' }
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
export class DefaultRoutingModule { }
