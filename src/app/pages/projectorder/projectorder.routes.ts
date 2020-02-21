import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENTS
import { ViewProjectOrderComponent } from './components/viewprojectorder/viewprojectorder.component';

// Guards
import { AuthguardService } from '../../services/authguard.service';


const pagesRoutes: Routes = [
    {
        path: ':id',
        component: ViewProjectOrderComponent,
        canActivate: [AuthguardService],
        data: { path: 'projectorder', titulo: 'OCA Global - ODIS Project Order', subtitle: 'Project Order', descripcion: 'OCA Global - ODIS Project Services Managment' }
    },
    { path: '**', pathMatch: 'full', redirectTo: '/notfound', data: { titulo: 'OCA Global - ODIS 404', subtitle: '', descripcion: 'OCA Global - ODIS User 404'  } }
];

@NgModule({
    imports: [RouterModule.forChild(pagesRoutes)],
    exports: [RouterModule],
    providers: [AuthguardService]
  })
  export class ProjectOrderRoutingModule { }
