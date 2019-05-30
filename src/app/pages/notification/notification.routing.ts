import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//COMPONENT
import { NotificationComponent } from './notification-list/notification.component';
import { NotificationReadComponent } from './components/notification-read/notificationread.component';
import { NotificationUnreadComponent } from './components/notification-unread/notification-unread.component';

//Guards
import { AuthguardService } from '../../services/authguard.service';

const routes: Routes = [
  {
    path: '',
    component: NotificationComponent,
    canActivate: [AuthguardService],
    data: { path: 'profile', titulo: 'OCA Global - ODIS Notificaciones', subtitle: 'Notificaciones', descripcion: 'OCA Global - ODIS Notification Managment'} 
  },
  {
    path: 'read',
    component: NotificationReadComponent,
    canActivate: [AuthguardService],
    data: { path: 'profile', titulo: 'OCA Global - ODIS Notificaciones', subtitle: 'Notificaciones', descripcion: 'OCA Global - ODIS Notification Managment'} 
  },
  {
    path: 'unread',
    component: NotificationUnreadComponent,
    canActivate: [AuthguardService],
    data: { path: 'profile', titulo: 'OCA Global - ODIS Notificaciones', subtitle: 'Notificaciones', descripcion: 'OCA Global - ODIS Notification Managment'} 
  },
  { path:'**', pathMatch: 'full', redirectTo: '/notfound', data: { titulo: 'OCA Global - ODIS 404', subtitle: '', descripcion: 'OCA Global - ODIS User 404'  } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthguardService]
})
export class NotificationRoutingModule { }