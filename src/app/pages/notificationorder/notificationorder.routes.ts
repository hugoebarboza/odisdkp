import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENTS
import { NotificationOrderComponent } from './components/notificationorder/notificationorder.component';

// Guards
import { AuthguardService } from '../../services/authguard.service';


const pagesRoutes: Routes = [
    {
        path: ':id',
        component: NotificationOrderComponent,
        canActivate: [AuthguardService],
        data: { path: 'notificationorder', titulo: 'OCA Global - ODIS Notification Order', subtitle: 'Notification Order', descripcion: 'OCA Global - ODIS Notification Managment' }
    },
    { path: '**', pathMatch: 'full', redirectTo: '/notfound', data: { titulo: 'OCA Global - ODIS 404', subtitle: '', descripcion: 'OCA Global - ODIS User 404'  } }
];

@NgModule({
    imports: [RouterModule.forChild(pagesRoutes)],
    exports: [RouterModule],
    providers: []
  })
  export class NotificactionOrderRoutingModule { }
