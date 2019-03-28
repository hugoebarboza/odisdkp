import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//COMPONENT
import { CalendarComponent } from './components/calendar/calendar.component';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';
import { DefaultComponent } from './components/default/default.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ServiceComponent } from './components/service/service.component';

import { NotfoundComponent } from './components/shared/notfound/notfound.component';
import { OrderserviceComponent } from './components/orderservice/orderservice.component';

//SERVICES
import { AuthguardService } from './services/authguard.service';


//ROUTES
const appRoute: Routes = [
	{ path:'', component: DefaultComponent, data: { titulo: 'OCA Global - ODIS Home', descripcion: 'OCA Global - ODIS Home' } },
	{ path:'home', component: DefaultComponent, data: { titulo: 'OCA Global - ODIS Home', descripcion: 'OCA Global - ODIS Home' } },
	{ path:'inicio', component: DefaultComponent, data: { titulo: 'OCA Global - ODIS Home', descripcion: 'OCA Global - ODIS Home' } },	
	{ path:'dashboard', 
	component: DashboardComponent, 
	canActivate: [AuthguardService],
	data: { titulo: 'OCA Global - ODIS Gestion', descripcion: 'OCA Global - ODIS Dashboard' }
	},
	{ path:'login', component: LoginComponent, data: { titulo: 'OCA Global - ODIS Acceso', descripcion: 'OCA Global - ODIS User Login' }},
	{ path:'logout/:sure', component: LoginComponent, data: { titulo: 'OCA Global - ODIS Acceso', descripcion: 'OCA Global - ODIS User Login' }},
	{ path:'register', component: RegisterComponent, data: { titulo: 'OCA Global - ODIS Registro', descripcion: 'OCA Global - ODIS User Register' }},	
	{ path:'projectorder/:id', 
	component: OrderserviceComponent,
	canActivate: [AuthguardService],
	data: { titulo: 'OCA Global - ODIS Proyectos', descripcion: 'OCA Global - ODIS Projects Managment' }
	},
	{ path:'projectcalendar/:id', 
	component: OrderserviceComponent,
	canActivate: [AuthguardService],
	data: { titulo: 'OCA Global - ODIS Calendario', descripcion: 'OCA Global - ODIS Calendar Managment' }
	},

	{ path:'project/:id', 
	component: ServiceComponent,
	canActivate: [AuthguardService],
	data: { titulo: 'OCA Global - ODIS Proyectos', descripcion: 'OCA Global - ODIS Project Managment' }
	},

	{ path:'projectservice/:id', 
	component: OrderserviceComponent,
	canActivate: [AuthguardService],
	data: { titulo: 'OCA Global - ODIS Proyectos', descripcion: 'OCA Global - ODIS Project Services Managment' }
	},


	{ path:'serviceorder/:id', 
	component: OrderserviceComponent,
	canActivate: [AuthguardService],
	data: { titulo: 'OCA Global - ODIS Ordenes', descripcion: 'OCA Global - ODIS Services Managment' }
	},
	{ path:'forgot', component: ForgotpasswordComponent, data: { titulo: 'OCA Global - ODIS Acceso', descripcion: 'OCA Global - ODIS User Forgot Password' }},	
	{ path:'change', component: ChangepasswordComponent, data: { titulo: 'OCA Global - ODIS Acceso', descripcion: 'OCA Global - ODIS User Change Password'  }},	
	{ path:'notfound', component: NotfoundComponent, data: { titulo: 'OCA Global - ODIS 404', descripcion: 'OCA Global - ODIS User 404'  }},	
	{ path:'**', pathMatch: 'full', redirectTo: 'notfound', data: { titulo: 'OCA Global - ODIS 404', descripcion: 'OCA Global - ODIS User 404'  } }

];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoute, { useHash:true });

