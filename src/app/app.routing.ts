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

// Guards
import { LoginGuardGuard } from './services/guards/login-guard.guard';



//ROUTES
const appRoute: Routes = [
	{ path:'forgot', component: ForgotpasswordComponent, data: { titulo: 'OCA Global - ODIS Acceso', subtitle: 'Olvido Clave', descripcion: 'OCA Global - ODIS User Forgot Password' }},	
	{ path:'home', component: DefaultComponent, data: { titulo: 'OCA Global - ODIS Home', subtitle: '', descripcion: 'OCA Global - ODIS Home' } },	
	{ path:'login', component: LoginComponent, data: { titulo: 'OCA Global - ODIS Acceso', subtitle: 'Acceso', descripcion: 'OCA Global - ODIS User Login' }},
	{ path:'logout/:sure', component: LoginComponent, data: { titulo: 'OCA Global - ODIS Acceso', subtitle: '', descripcion: 'OCA Global - ODIS User Login' }},
	{ path:'notfound', component: NotfoundComponent, data: { titulo: 'OCA Global - ODIS 404', subtitle: '', descripcion: 'OCA Global - ODIS User 404'  }},
	{ path:'register', component: RegisterComponent, data: { titulo: 'OCA Global - ODIS Registro', subtitle: 'Registro', descripcion: 'OCA Global - ODIS User Register' }},
    { 
		path:'change', 
		canActivate: [ LoginGuardGuard ],
		loadChildren: './pages/changepassword/changepassword.module#ChangePasswordModule',
		data: { preload: true, delay: true }
	},	
	{
		path: 'dashboard',
		canActivate: [ LoginGuardGuard ],
		loadChildren: './pages/dashboard/dashboard.module#DashboardModule',
		data: { preload: true, delay: false }
	},
	{
		path: 'profile',
		canActivate: [ LoginGuardGuard ],
		loadChildren: './pages/profile/profile.module#ProfileModule',
		data: { preload: true, delay: true }
	},
	{
		path: 'projectservice',
		canActivate: [ LoginGuardGuard ],
		loadChildren: './pages/service/service.module#ServiceModule',
		data: { preload: true, delay: true }
	},
  { 	
		path: 'users', 
    canActivate: [LoginGuardGuard],
		loadChildren: './pages/usuarios/usuarios.module#UsuariosModule',
		data: { preload: true, delay: false }
  },
	{
		path: '',
		canActivate: [ LoginGuardGuard ],
		loadChildren: './pages/pages.module#PagesModule',
		data: { preload: true, delay: false }
	},
	{ path:'**', pathMatch: 'full', redirectTo: 'notfound', data: { titulo: 'OCA Global - ODIS 404', subtitle: '', descripcion: 'OCA Global - ODIS User 404'  } }

];


@NgModule({
	imports: [
	  RouterModule.forRoot(appRoute, { useHash:true,  enableTracing: false,  preloadingStrategy: CustomPreloading })
	],
	exports: [RouterModule],
	providers: [LoginGuardGuard, CustomPreloading]
  })

export class AppRoutingModule { }



