import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

import { DefaultComponent } from '../default/default.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderserviceComponent } from '../components/orderservice/orderservice.component';
import { ProfileComponent } from './profile/profile.component';
import { ServiceComponent } from './service/service.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

// Guards
import { AuthguardService } from '../services/authguard.service';


const pagesRoutes: Routes = [
    { path:'calendar/:id', 
    component: CalendarComponent,
    canActivate: [AuthguardService],
    data: { titulo: 'OCA Global - ODIS Calendario', descripcion: 'OCA Global - ODIS Calendar Managment' }
    },

    { path:'change', 
    component: ChangepasswordComponent, 
    canActivate: [AuthguardService],
    data: { titulo: 'OCA Global - ODIS Acceso', descripcion: 'OCA Global - ODIS User Change Password'  }},	

    { path:'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthguardService],
    data: { titulo: 'OCA Global - ODIS Gestion', descripcion: 'OCA Global - ODIS Dashboard' }
    },

    { path:'projectorder/:id', 
    component: OrderserviceComponent,
    canActivate: [AuthguardService],
    data: { titulo: 'OCA Global - ODIS Proyectos', descripcion: 'OCA Global - ODIS Projects Managment' }
    },


    { path:'projectservice/:id', 
    component: ServiceComponent,
    canActivate: [AuthguardService],
    data: { titulo: 'OCA Global - ODIS Proyectos', descripcion: 'OCA Global - ODIS Project Services Managment' }
    },

    { path:'serviceorder/:id', 
    component: OrderserviceComponent,
    canActivate: [AuthguardService],
    data: { titulo: 'OCA Global - ODIS Ordenes', descripcion: 'OCA Global - ODIS Services Managment' }
    },
    
    { path: 'profile', 
    component: ProfileComponent, 
    canActivate: [AuthguardService],
    data: { titulo: 'OCA Global - ODIS Perfil de usuario' } },	


    { path: 'users/:id', 
    component: UsuariosComponent,
    canActivate: [AuthguardService],
    data: { titulo: 'OCA Global - ODIS Users Managment' } 
    },
    
    { path:'', component: DefaultComponent, data: { titulo: 'OCA Global - ODIS Home', descripcion: 'OCA Global - ODIS Home' } }


];


export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
