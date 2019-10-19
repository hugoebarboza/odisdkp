import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// PRELOAD
import {QuicklinkStrategy, QuicklinkModule} from 'ngx-quicklink';
// import { PreloadAllModules } from "@angular/router";
// import { CustomPreloading } from './custompreloading';

// DEFAULT AND LOGIN
import { DefaultComponent } from './default/default.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { LoginComponent } from './login/login.component';
import { NotfoundComponent } from './components/shared/notfound/notfound.component';
import { RegisterComponent } from './register/register.component';

// PAGES
import { PagesComponent } from './pages/pages.component';

// Guards
import { AuthguardService } from './services/authguard.service';
import { LoginGuardGuard } from './services/guards/login-guard.guard';



//ROUTES
const appRoute: Routes = [
	{ path:'forgot', component: ForgotpasswordComponent, data: { titulo: 'OCA Global - ODIS Acceso', subtitle: 'Olvido Clave', descripcion: 'OCA Global - ODIS User Forgot Password' }},	
	{ path:'home', component: DefaultComponent, data: { titulo: 'OCA Global - ODIS Home', subtitle: '', descripcion: 'OCA Global - ODIS Home' } },	
	{ path:'login', 
		component: LoginComponent, 
		data: { titulo: 'OCA Global - ODIS Acceso', subtitle: 'Acceso', descripcion: 'OCA Global - ODIS User Login' }
	},
	{ path:'logout/:sure', component: LoginComponent, data: { titulo: 'OCA Global - ODIS Acceso', subtitle: '', descripcion: 'OCA Global - ODIS User Login' }},
	{ path:'notfound', component: NotfoundComponent, data: { titulo: 'OCA Global - ODIS 404', subtitle: '', descripcion: 'OCA Global - ODIS User 404'  }},
	{ path:'register', component: RegisterComponent, data: { titulo: 'OCA Global - ODIS Registro', subtitle: 'Registro', descripcion: 'OCA Global - ODIS User Register' }},
	{ 
		path:'calendar', 
    	canLoad: [ LoginGuardGuard ],
		loadChildren : () => import('./pages/calendar/calendario.module').then(m => m.CalendarioModule),
		data: { preload: false, delay: false }
	},    
	{ 
		path:'change', 
		canLoad: [ LoginGuardGuard ],
		loadChildren : () => import('./pages/changepassword/changepassword.module').then(m => m.ChangePasswordModule),
		data: { preload: false, delay: true }
	},	
	{
		path: 'dashboard',
		canLoad: [ LoginGuardGuard ],
		loadChildren : () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
		data: { preload: false, delay: false }
	},
	{
        path: 'formview',
        canLoad: [ LoginGuardGuard ],
		loadChildren : () => import('./pages/customform/customform.module').then(m => m.CustomformModule),
        data: { preload: false, delay: false }
    },	
	{
        path: 'formview/orderview/:serviceid/:orderid',
        canLoad: [ LoginGuardGuard ],
		loadChildren : () => import('./pages/customform/customform.module').then(m => m.CustomformModule),
        data: { preload: false, delay: false }
    },	
	{
		path: 'notification',
		canLoad: [ LoginGuardGuard ],
		loadChildren : () => import('./pages/notification/notification.module').then(m => m.NotificationModule),
		data: { preload: false, delay: false }
  	},
	{
		path: 'notification/read',
		canLoad: [ LoginGuardGuard ],
		loadChildren : () => import('./pages/notification/notification.module').then(m => m.NotificationModule),
		data: { preload: false, delay: false }
  	},
	{
		path: 'notification/unread',
		canLoad: [ LoginGuardGuard ],
		loadChildren : () => import('./pages/notification/notification.module').then(m => m.NotificationModule),
		data: { preload: false, delay: false }
	},
	{
		path: 'payments',
		canLoad: [ LoginGuardGuard ],
		loadChildren : () => import('./pages/payments/payments.module').then(m => m.PaymentsModule),
		data: { preload: false, delay: false }
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
		data: { preload: false, delay: false }
	},
	{
		path: 'project/:id/settings',
		canLoad: [ LoginGuardGuard ],
		loadChildren : () => import('./pages/service/service.module').then(m => m.ServiceModule),
		data: { preload: false, delay: false }
	},
	{
		path: 'service',
		canLoad: [ LoginGuardGuard ],
		loadChildren : () => import('./pages/orderservice/orderservice.module').then(m => m.OrderServiceModule),
		data: { preload: false, delay: false }
  	},
	  {
		path: 'support',
		canLoad: [ LoginGuardGuard ],
		loadChildren : () => import('./pages/support/support.module').then(m => m.SupportModule),
		data: { preload: false, delay: false }
  	},
	{ 	
		path: 'users', 
    	canLoad: [LoginGuardGuard],
		loadChildren : () => import('./pages/usuarios/usuarios.module').then(m => m.UsuariosModule),
		data: { preload: false, delay: false }
  	},
	{
		path: 'users/:id/settings',
		canLoad: [ LoginGuardGuard ],
		loadChildren : () => import('./pages/usuarios/usuarios.module').then(m => m.UsuariosModule),
		data: { preload: false, delay: false }
	},
	{
		path: 'users/:id/work',
		canLoad: [ LoginGuardGuard ],
		loadChildren : () => import('./pages/usuarios/usuarios.module').then(m => m.UsuariosModule),
		data: { preload: false, delay: false }
	},
	{
		path: '',
		component: PagesComponent,
		canLoad: [ LoginGuardGuard ],
		loadChildren : () => import('./pages/pages.module').then(m => m.PagesModule),
  	},
	{ path:'**', pathMatch: 'full', redirectTo: 'notfound', data: { titulo: 'OCA Global - ODIS 404', subtitle: '', descripcion: 'OCA Global - ODIS User 404'  } }

];


@NgModule({
	imports: [
	  QuicklinkModule,
	  RouterModule.forRoot(appRoute, { useHash:true,  enableTracing: false,  preloadingStrategy: QuicklinkStrategy })
	],
	exports: [QuicklinkModule, RouterModule],
	providers: [AuthguardService, LoginGuardGuard]
  })

export class AppRoutingModule { }



