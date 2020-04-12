import { NgModule } from '@angular/core';

// COMPONENTS
import { TeamListComponent } from './team-list/team-list.component';

// MODULES
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../components/shared/shared.module';

// COMPONENTS

// DIALOG
import { AddUserTeamComponent } from './dialog/add-user-team/add-user-team.component';
import { EditTeamComponent } from './dialog/edit-team/edit-team.component';

// ROUTING
import { TeamRoutingModule } from './team.routing';


@NgModule({
  imports: [
    NgSelectModule,
    SharedModule,
    TeamRoutingModule,
  ],
  declarations: [
    // AddTeamComponent,
    AddUserTeamComponent,
    EditTeamComponent,
    TeamListComponent
  ],
  entryComponents: [
    // AddTeamComponent
    AddUserTeamComponent,
    EditTeamComponent
  ],
  providers: [
  ],
})
export class TeamModule { }
