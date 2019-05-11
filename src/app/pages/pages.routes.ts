import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Guards
import { LoginGuardGuard } from '../services/guards/login-guard.guard';


const pagesRoutes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(pagesRoutes)],
    exports: [RouterModule],
    providers: [LoginGuardGuard]
  })
  export class PagesRoutingModule { }

