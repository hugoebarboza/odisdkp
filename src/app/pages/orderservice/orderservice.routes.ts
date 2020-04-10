import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENTS
import { OrderserviceComponent } from './components/orderservice/orderservice.component';

// Guards
import { AuthguardService } from '../../services/authguard.service';


const pagesRoutes: Routes = [
    {
        path: ':id',
        component: OrderserviceComponent,
        canActivate: [AuthguardService],
        data: { path: 'service', titulo: 'OCA Global - ODIS Órdenes', subtitle: '', descripcion: 'OCA Global - ODIS Services Managment' }
    },
    { path: '**', pathMatch: 'full', redirectTo: '/notfound', data: { titulo: 'OCA Global - ODIS 404', subtitle: '', descripcion: 'OCA Global - ODIS User 404'  } }
];

@NgModule({
    imports: [RouterModule.forChild(pagesRoutes)],
    exports: [RouterModule],
    providers: []
  })
  export class OrderServiceRoutingModule { }

