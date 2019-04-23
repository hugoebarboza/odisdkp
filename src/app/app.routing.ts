import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//DEFAULT AND LOGIN
import { DefaultComponent } from './default/default.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { LoginComponent } from './login/login.component';
import { NotfoundComponent } from './components/shared/notfound/notfound.component';
import { RegisterComponent } from './register/register.component';


//ROUTES
const appRoute: Routes = [
	{ path:'forgot', component: ForgotpasswordComponent, data: { titulo: 'OCA Global - ODIS Acceso', descripcion: 'OCA Global - ODIS User Forgot Password' }},	
	{ path:'login', component: LoginComponent, data: { titulo: 'OCA Global - ODIS Acceso', descripcion: 'OCA Global - ODIS User Login' }},
	{ path:'logout/:sure', component: LoginComponent, data: { titulo: 'OCA Global - ODIS Acceso', descripcion: 'OCA Global - ODIS User Login' }},
	{ path:'notfound', component: NotfoundComponent, data: { titulo: 'OCA Global - ODIS 404', descripcion: 'OCA Global - ODIS User 404'  }},
	{ path:'register', component: RegisterComponent, data: { titulo: 'OCA Global - ODIS Registro', descripcion: 'OCA Global - ODIS User Register' }},
	{ path:'home', component: DefaultComponent, data: { titulo: 'OCA Global - ODIS Home', descripcion: 'OCA Global - ODIS Home' } },	
	{ path:'**', pathMatch: 'full', redirectTo: 'notfound', data: { titulo: 'OCA Global - ODIS 404', descripcion: 'OCA Global - ODIS User 404'  } }

];


export const routing: ModuleWithProviders = RouterModule.forRoot(appRoute, { useHash:true });

