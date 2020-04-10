import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// COMPONENTS
import { TeamListComponent } from './team-list/team-list.component';

// MODULES
import { CoreModule } from '../../core.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

// COMPONENTS

// DIALOG
import { AddUserTeamComponent } from './dialog/add-user-team/add-user-team.component';
import { EditTeamComponent } from './dialog/edit-team/edit-team.component';

// ROUTING
import { TeamRoutingModule } from './team.routing';


@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    HttpClientModule,
    NgSelectModule,
    ReactiveFormsModule,
    PipesModule,
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
