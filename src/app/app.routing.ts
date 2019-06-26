import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreloadAllModules } from "@angular/router";
import { CustomPreloading } from './custompreloading';

//DEFAULT AND LOGIN
import { DefaultComponent } from './default/default.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { LoginComponent } from './login/login.component';
import { NotfoundComponent } from './components/shared/notfound/notfound.component';
import { RegisterComponent } from './register/register.component';

//PAGES
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
    loadChildren: './pages/calendar/calendario.module#CalendarioModule',        
		data: { preload: true, delay: false }
	},    
	{ 
		path:'change', 
		canLoad: [ LoginGuardGuard ],
		loadChildren: './pages/changepassword/changepassword.module#ChangePasswordModule',
		data: { preload: true, delay: true }
	},	
	{
		path: 'dashboard',
		canLoad: [ LoginGuardGuard ],
		loadChildren: './pages/dashboard/dashboard.module#DashboardModule',
		data: { preload: true, delay: false }
	},
	{
        path: 'formview',
        canLoad: [ LoginGuardGuard ],
        loadChildren: './pages/customform/customform.module#CustomformModule',
        data: { preload: true, delay: false }
    },	
	{
		path: 'notification',
		canLoad: [ LoginGuardGuard ],
		loadChildren: './pages/notification/notification.module#NotificationModule',
		data: { preload: true, delay: false }
  	},
	{
		path: 'notification/read',
		canLoad: [ LoginGuardGuard ],
		loadChildren: './pages/notification/notification.module#NotificationModule',
		data: { preload: true, delay: false }
  	},
	{
		path: 'notification/unread',
		canLoad: [ LoginGuardGuard ],
		loadChildren: './pages/notification/notification.module#NotificationModule',
		data: { preload: true, delay: false }
  	},
	{
		path: 'profile',
		canLoad: [ LoginGuardGuard ],
		loadChildren: './pages/profile/profile.module#ProfileModule',
		data: { preload: true, delay: true }
	},
	{
		path: 'project',
		canLoad: [ LoginGuardGuard ],
		loadChildren: './pages/service/service.module#ServiceModule',
		data: { preload: true, delay: false }
	},
	{
		path: 'project/:id/settings',
		canLoad: [ LoginGuardGuard ],
		loadChildren: './pages/service/service.module#ServiceModule',
		data: { preload: true, delay: false }
	},
	{
		path: 'service',
		canLoad: [ LoginGuardGuard ],
		loadChildren: './pages/orderservice/orderservice.module#OrderServiceModule',
		data: { preload: true, delay: false }
  	},
	  {
		path: 'support',
		canLoad: [ LoginGuardGuard ],
		loadChildren: './pages/support/support.module#SupportModule',
		data: { preload: true, delay: false }
  	},
	{ 	
		path: 'users', 
    canLoad: [LoginGuardGuard],
		loadChildren: './pages/usuarios/usuarios.module#UsuariosModule',
		data: { preload: true, delay: false }
  	},
	{
		path: '',
		component: PagesComponent,
		canLoad: [ LoginGuardGuard ],
		loadChildren: './pages/pages.module#PagesModule'
  	},
	{ path:'**', pathMatch: 'full', redirectTo: 'notfound', data: { titulo: 'OCA Global - ODIS 404', subtitle: '', descripcion: 'OCA Global - ODIS User 404'  } }

];


@NgModule({
	imports: [
	  RouterModule.forRoot(appRoute, { useHash:true,  enableTracing: false,  preloadingStrategy: CustomPreloading })
	],
	exports: [RouterModule],
	providers: [AuthguardService, LoginGuardGuard, CustomPreloading]
  })

export class AppRoutingModule { }



