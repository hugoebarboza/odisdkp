import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENTS
import { ViewProjectOrderComponent } from './components/viewprojectorder/viewprojectorder.component';

// Guards
import { AuthguardService } from '../../services/authguard.service';


const pagesRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthguardService],
        children: [
            {
                path: ':id',
                component: ViewProjectOrderComponent,
                data: { path: 'projectorder', titulo: 'OCA Global - ODIS Project Order', subtitle: 'Project Order', descripcion: 'OCA Global - ODIS Project Services Managment' }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(pagesRoutes)],
    exports: [RouterModule],
    providers: []
  })
  export class ProjectOrderRoutingModule { }
