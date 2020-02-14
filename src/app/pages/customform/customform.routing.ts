import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENT
import { AtributoAlertComponent } from './atributo-alert/atributo-alert.component';
import { CreateFormComponent } from './create-form/create-form.component';
import { FormviewComponent } from './formview/formview.component';
import { OrderViewComponent } from './order-view/order-view.component';

// Guards
import { AuthguardService } from '../../services/authguard.service';


const routes: Routes = [
  {
    path: '',
    component: FormviewComponent,
    canActivate: [AuthguardService],
    data: { path: 'formview', titulo: 'OCA Global - ODIS Soporte de usuario', subtitle: 'Soporte del Usuario', descripcion: 'OCA Global - ODIS Support Managment'}
  },
  {
    path: 'notification/:id',
    component: AtributoAlertComponent,
    canActivate: [AuthguardService],
    data: { path: 'orderview', titulo: 'OCA Global - ODIS Crear Formulario', subtitle: 'Configuración de notificaciones y EDP', descripcion: 'OCA Global - ODIS Form Managment'}
  },
  {
    path: 'form/:id/settings/:formid',
    component: CreateFormComponent,
    canActivate: [AuthguardService],
    data: { path: 'orderview', titulo: 'OCA Global - ODIS Crear Formulario', subtitle: 'Configuración de Formularios', descripcion: 'OCA Global - ODIS Form Managment'}
  },
  {
    path: 'orderview/:serviceid/:orderid',
    component: OrderViewComponent,
    canActivate: [AuthguardService],
    data: { path: 'orderview', titulo: 'OCA Global - ODIS Ver Orden', subtitle: 'Ver Orden de Trabajo', descripcion: 'OCA Global - ODIS Order Managment'}
  },

  { path: '**', pathMatch: 'full', redirectTo: '/notfound', data: { titulo: 'OCA Global - ODIS 404', subtitle: '', descripcion: 'OCA Global - ODIS User 404'  } }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthguardService]
})

export class CustomformRoutingModule { }


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
