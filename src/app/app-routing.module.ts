import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// GUARDS
import { LoginGuardGuard } from './services/guards/login-guard.guard';

// PRELOAD
import {QuicklinkStrategy, QuicklinkModule} from 'ngx-quicklink';
// import { PreloadAllModules } from "@angular/router";
// import { CustomPreloading } from './custompreloading';


// ROUTES
const appRoute: Routes = [
    { path: 'forgot',
        loadChildren : () => import('./pages/forgot/forgot.module').then(m => m.ForgotModule),
        data: { titulo: 'OCA Global - ODIS Acceso', subtitle: 'Olvido Clave', descripcion: 'OCA Global - ODIS User Forgot Password' }
    },
    { path: 'home',
        loadChildren : () => import('./pages/default/default.module').then(m => m.DefaultModule),
        data: { titulo: 'OCA Global - ODIS Home', subtitle: '', descripcion: 'OCA Global - ODIS Home' }
    },
    { path: 'login',
        loadChildren : () => import('./pages/login/login.module').then(m => m.LoginModule),
        data: { titulo: 'OCA Global - ODIS Acceso', subtitle: 'Acceso', descripcion: 'OCA Global - ODIS User Login' }
    },
    { path: 'logout/:sure',
        loadChildren : () => import('./pages/login/login.module').then(m => m.LoginModule),
        data: { titulo: 'OCA Global - ODIS Acceso', subtitle: '', descripcion: 'OCA Global - ODIS User Login' }
    },
    { path: 'notfound',
      loadChildren: () => import('./pages/notfound/notfound.module').then(m => m.NotfoundModule)
    },
    { path: 'register',
        loadChildren : () => import('./pages/register/register.module').then(m => m.RegisterModule),
        data: { titulo: 'OCA Global - ODIS Registro', subtitle: 'Registro', descripcion: 'OCA Global - ODIS User Register' }
    },
    {
      path: 'calendar',
      canLoad: [ LoginGuardGuard ],
        loadChildren : () => import('./pages/calendar/calendario.module').then(m => m.CalendarioModule),
        data: { preload: false }
    },
    {
      path: 'change',
      canLoad: [ LoginGuardGuard ],
        loadChildren : () => import('./pages/changepassword/changepassword.module').then(m => m.ChangePasswordModule),
        data: { preload: false }
    },
    {
      path: 'dashboard',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
      data: { preload: false }
    },
    {
      path: 'formview',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/customform/customform.module').then(m => m.CustomformModule),
      data: { preload: false }
    },
    {
      path: 'formview/createform/:id',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/customform/customform.module').then(m => m.CustomformModule),
      data: { preload: false }
    },
    {
      path: 'formview/orderview/:serviceid/:orderid',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/customform/customform.module').then(m => m.CustomformModule),
      data: { preload: false }
    },
    {
      path: 'notification',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/notification/notification.module').then(m => m.NotificationModule),
      data: { preload: false }
    },
    {
      path: 'notification/read',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/notification/notification.module').then(m => m.NotificationModule),
      data: { preload: false }
    },
    {
      path: 'notification/unread',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/notification/notification.module').then(m => m.NotificationModule),
      data: { preload: false }
    },
    {
      path: 'notificationorder',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/notificationorder/notificationorder.module').then(m => m.NotificationOrderModule),
      data: { preload: false }
    },
    {
      path: 'payments',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/payments/payments.module').then(m => m.PaymentsModule),
      data: { preload: false }
    },
    {
      path: 'profile',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/profile/profile.module').then(m => m.ProfileModule),
      data: { preload: false, delay: true }
    },
    {
      path: 'project',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/service/service.module').then(m => m.ServiceModule),
      data: { preload: false }
    },
    {
      path: 'project/:id/settings',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/service/service.module').then(m => m.ServiceModule),
      data: { preload: false }
    },
    {
      path: 'projectorder',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/projectorder/projectorder.module').then(m => m.ProjectOrderModule),
      data: { preload: false }
    },
    {
      path: 'service',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/orderservice/orderservice.module').then(m => m.OrderServiceModule),
      data: { preload: false }
    },
    {
      path: 'support',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/support/support.module').then(m => m.SupportModule),
      data: { preload: false }
    },
    {
      path: 'support/settings',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/support/support.module').then(m => m.SupportModule),
      data: { preload: false }
    },
    {
      path: 'support/users',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/support/support.module').then(m => m.SupportModule),
      data: { preload: false }
    },
    {
      path: 'support/viewcase',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/support/support.module').then(m => m.SupportModule),
      data: { preload: false }
    },
    {
      path: 'team',
      canLoad: [LoginGuardGuard],
      loadChildren : () => import('./pages/team/team.module').then(m => m.TeamModule),
      data: { preload: false }
    },
    {
      path: 'users',
      canLoad: [LoginGuardGuard],
      loadChildren : () => import('./pages/usuarios/usuarios.module').then(m => m.UsuariosModule),
      data: { preload: false }
    },
    {
      path: 'users/:id/settings',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/usuarios/usuarios.module').then(m => m.UsuariosModule),
      data: { preload: false }
    },
    {
      path: 'users/:id/work',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/usuarios/usuarios.module').then(m => m.UsuariosModule),
      data: { preload: false }
    },
    {
      path: '',
      canLoad: [ LoginGuardGuard ],
      loadChildren : () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
      data: { preload: false }
    },
    { path: '**', pathMatch: 'full', redirectTo: 'notfound', data: { titulo: 'OCA Global - ODIS 404', subtitle: '', descripcion: 'OCA Global - ODIS User 404'  } }

];



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    QuicklinkModule,
    RouterModule.forRoot(appRoute, { useHash: true, enableTracing: false, preloadingStrategy: QuicklinkStrategy, initialNavigation: 'enabled' })
  ],
  exports: [QuicklinkModule, RouterModule],
  providers: [LoginGuardGuard]
})
export class AppRoutingModule { }
