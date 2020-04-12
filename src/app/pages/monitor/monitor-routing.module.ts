import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENTS
import { MonitorListComponent } from './components/monitor-list/monitor-list.component';

// Guards
import { AuthguardService } from '../../services/authguard.service';


const pagesRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthguardService],
        children: [
            {
                path: ':id',
                component: MonitorListComponent,
                data: { path: 'monitor', titulo: 'OCA Global - ODIS Monitoring Project Order', subtitle: 'Monitoring Project Order', descripcion: 'OCA Global - ODIS Monitoring Project Order Managment' }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(pagesRoutes)],
    exports: [RouterModule],
    providers: []
  })
  export class MonitorRoutingModule { }
