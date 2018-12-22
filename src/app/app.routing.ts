import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//COMPONENT
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DefaultComponent } from './components/default/default.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';

import { NotfoundComponent } from './components/shared/notfound/notfound.component';
import { OrderserviceComponent } from './components/orderservice/orderservice.component';

//SERVICES
import { AuthguardService } from './services/authguard.service';


//ROUTES
const appRoute: Routes = [
	{ path:'', component: DefaultComponent },
	{ path:'home', component: DefaultComponent },
	{ path:'inicio', component: DefaultComponent },	
	{ path:'dashboard', 
	component: DashboardComponent, 
	canActivate: [AuthguardService]
	},
	{ path:'login', component: LoginComponent},
	{ path:'logout/:sure', component: LoginComponent},
	{ path:'register', component: RegisterComponent},	
	{ path:'projectorder/:id', 
	component: OrderserviceComponent,
	canActivate: [AuthguardService]
	},
	{ path:'serviceorder/:id', 
	component: OrderserviceComponent,
	canActivate: [AuthguardService]
	},
	{ path:'forgot', component: ForgotpasswordComponent},	
	{ path:'change', component: ChangepasswordComponent},	
	{ path:'notfound', component: NotfoundComponent},	
	{ path:'**', pathMatch: 'full', redirectTo: 'notfound' }

];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoute, { useHash:true });

