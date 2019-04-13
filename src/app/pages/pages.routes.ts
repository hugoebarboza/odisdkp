import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';

import { ProfileComponent } from './profile/profile.component';

//SERVICES
import { AuthguardService } from '../services/authguard.service';



const pagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [ AuthguardService ],
        children: [
            { path: 'profile', component: ProfileComponent, data: { titulo: 'OCA Global - ODIS Perfil de usuario' } },            
            { path:'**', pathMatch: 'full', redirectTo: 'notfound', data: { titulo: 'OCA Global - ODIS 404', descripcion: 'OCA Global - ODIS User 404'  } }            
        ]
    }
];


export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
