import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PROVIDERS
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from '../../providers/interceptor/my.interceptor';


// MODULES
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

// COMPONENTS

// DIALOG
// import { AddTeamComponent } from '../usuarios/dialog/add-team/add-team.component';

// ROUTING
import { TeamRoutingModule } from './team.routing';


// SERVICES
import { ServiceModule } from 'src/app/services/service.module';
import { TeamListComponent } from './team-list/team-list.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgSelectModule,
    ReactiveFormsModule,
    PipesModule,
    ServiceModule,
    SharedModule,
    TeamRoutingModule,
  ],
  declarations: [
    // AddTeamComponent,
  TeamListComponent],
  entryComponents: [
    // AddTeamComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true },
  ],
})
export class TeamModule { }
