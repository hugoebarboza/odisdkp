import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//PROVIDERS
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from '../../providers/interceptor/my.interceptor';


//COMPONENTS
import { AddUserServiceComponent } from './components/adduserservice/adduserservice.component';
import { ProjectCategorieListComponent } from './dialog/project-categorie-list/project-categorie-list.component';
import { ProjectTypeListComponent } from './dialog/project-type-list/project-type-list.component';
import { RemoveUserComponent } from './components/removeuser/removeuser.component';
import { ServiceComponent } from './service-list/service.component';


//DIALOG
import { AddServiceComponent } from './dialog/addservice/addservice.component';
import { AddProjectTypeComponent } from './dialog/add-project-type/add-project-type.component';
import { AddProjectCategorieComponent } from './dialog/add-project-categorie/add-project-categorie.component';
import { CsvServiceComponent } from './dialog/csvservice/csvservice.component';
import { SettingServiceComponent } from './components/settingservice/settingservice.component';
//import { EditServiceComponent } from './dialog/editservice/editservice.component';
import { DeleteServiceComponent } from './dialog/deleteservice/deleteservice.component';
import { UserComponent } from './dialog/user/user.component';

//MODULES
import { AngularSplitModule } from 'angular-split';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CalendarModule } from 'primeng/calendar';
import { MaterialModule } from '../../material-module';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TableModule } from 'ngx-easy-table';
import { ViewModule } from '../../components/views/view.module';


//MOMENT
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

//ROUTING
import { ServiceRoutingModule } from './service.routing';



@NgModule({
  imports: [
    AngularSplitModule.forRoot(),
    AngularEditorModule,
    CalendarModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    MatProgressButtonsModule,
    NgSelectModule,
    NgxMatSelectSearchModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    PipesModule,
    ReactiveFormsModule,
    ServiceRoutingModule,
    SharedModule,
    ScrollingModule,
    TableModule,
    ViewModule
  ],
  declarations: 
  [
    AddProjectTypeComponent,
    AddProjectCategorieComponent,
    AddServiceComponent,
    AddUserServiceComponent,
    CsvServiceComponent,
    DeleteServiceComponent,
    RemoveUserComponent,    
    ServiceComponent,
    SettingServiceComponent,
    UserComponent,
    ProjectCategorieListComponent,
    ProjectTypeListComponent,
  ],
  entryComponents: [
    AddProjectTypeComponent,
    AddProjectCategorieComponent,
    AddServiceComponent,
    AddUserServiceComponent,
    CsvServiceComponent,
    DeleteServiceComponent, 
    UserComponent
  ],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: LOCALE_ID, useValue: 'es' },
    {provide: MAT_DATE_LOCALE, useValue: 'es'},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true },
  ],
})
export class ServiceModule { }


