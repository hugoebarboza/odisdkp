import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderserviceComponent } from '../components/orderservice/orderservice.component';

// Guards
import { AuthguardService } from '../services/authguard.service';


const pagesRoutes: Routes = [
    { 
        path:':id', 
        component: OrderserviceComponent,
        canActivate: [AuthguardService],
        data: { path: 'service', titulo: 'OCA Global - ODIS Órdenes', subtitle: '', descripcion: 'OCA Global - ODIS Services Managment' }
    },    
];

@NgModule({
    imports: [RouterModule.forChild(pagesRoutes)],
    exports: [RouterModule],
    providers: [AuthguardService]
  })
  export class PagesRoutingModule { }

