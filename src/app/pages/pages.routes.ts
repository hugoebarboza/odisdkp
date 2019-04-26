import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarComponent } from './calendar/calendar.component';
//import { ChangepasswordComponent } from './changepassword/changepassword.component';
//import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderserviceComponent } from '../components/orderservice/orderservice.component';
//import { ProfileComponent } from './profile/profile.component';
//import { ServiceComponent } from './service/service.component';
//import { UsuariosComponent } from './usuarios/usuarios.component';

// Guards
import { AuthguardService } from '../services/authguard.service';


const pagesRoutes: Routes = [
    { path:'calendar/:id', 
    component: CalendarComponent,
    canActivate: [AuthguardService],
    data: { path: 'calendar', titulo: 'OCA Global - ODIS Calendario', subtitle: 'Calendario', descripcion: 'OCA Global - ODIS Calendar Managment' }
    },
/*
    { path:'change', 
    component: ChangepasswordComponent, 
    canActivate: [AuthguardService],
    data: { titulo: 'OCA Global - ODIS Acceso', subtitle: 'Cambiar Clave', descripcion: 'OCA Global - ODIS User Change Password'  }},	
*/

/*
    { path:'projectservice/:id', 
    component: ServiceComponent,
    canActivate: [AuthguardService],
    data: { titulo: 'OCA Global - ODIS Proyectos', subtitle: 'Proyectos', descripcion: 'OCA Global - ODIS Project Services Managment' }
    },
*/
    { path:'serviceorder/:id', 
    component: OrderserviceComponent,
    canActivate: [AuthguardService],
    data: { path: 'serviceorder', titulo: 'OCA Global - ODIS Ordenes', subtitle: '', descripcion: 'OCA Global - ODIS Services Managment' }
    },
    
    /*
    { path: 'profile', 
    component: ProfileComponent, 
    canActivate: [AuthguardService],
    data: { titulo: 'OCA Global - ODIS Perfil de usuario', subtitle: 'Perfil del Usuario', descripcion: 'OCA Global - ODIS Profile Managment'} 
    },*/	

    /*
    { path: 'users/:id', 
    component: UsuariosComponent,
    canActivate: [AuthguardService],
    data: { titulo: 'OCA Global - ODIS Users Managment', subtitle: 'Usuarios', descripcion: 'OCA Global - ODIS Users Managment' } 
    },*/
    
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }


];

@NgModule({
    imports: [RouterModule.forChild(pagesRoutes)],
    exports: [RouterModule],
    providers: [AuthguardService]
  })
  export class PagesRoutingModule { }

