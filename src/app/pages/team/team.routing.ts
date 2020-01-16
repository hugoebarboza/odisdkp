import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENT
import { TeamListComponent } from './team-list/team-list.component';

// Guards
import { AuthguardService } from '../../services/authguard.service';



const routes: Routes = [
  {
    path: ':id',
    component: TeamListComponent,
    canActivate: [AuthguardService],
    data: { path: 'team', titulo: 'OCA Global - ODIS Team Managment', subtitle: 'Equipos', descripcion: 'OCA Global - ODIS Team Managment' }
  },
  { path: '**', pathMatch: 'full', redirectTo: '/notfound', data: { titulo: 'OCA Global - ODIS 404', subtitle: '', descripcion: 'OCA Global - ODIS User 404'  } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthguardService]
})
export class TeamRoutingModule { }


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
