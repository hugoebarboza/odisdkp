import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// CORE
import { CoreModule } from 'src/app/core.module';

// DIRECTIVE
import { DirectiveModule } from 'src/app/directives/directive.module';

// MATERIAL
import {MaterialModule} from '../../material-module';

// MODULES
import { CalendarModule } from 'primeng/calendar';


// PROLOAD STRATEGY
import { QuicklinkModule } from 'ngx-quicklink';

// COMPONENTS
import {
    AddDocComponent,
    AddTeamComponent,
    EditServiceComponent,
    FilelistComponent,
    FileListComponent,
    FileUploadComponent,
    FooterComponent,
    KpiComponent,
    KpiProjectComponent,
    KpiProjectAmchartsComponent,
    KpiProjectDetailComponent,
    KpiProjectForecastComponent,
    KpiProjectHeatdayComponent,
    KpiProjectHeatmapComponent,
    KpiProjectLocationComponent,
    LoadingComponent,
    LoadingCompletedComponent,
    MynavComponent,
    ProgressSpinnerComponent,
    ReportkpiComponent,
    ShowComponent,
    TagUserComponent,
    TagUserDbComponent,
    TagUserMatSelectComponent,
    UploaderComponent,
    UploadTaskComponent,
    UserJobProfileComponent,
    ViewOrderTimeSpentComponent,
   } from './shared.index';

// Pipes
import { PipesModule } from '../../pipes/pipes.module';


@NgModule({
    imports: [
        CalendarModule,
        CommonModule,
        CoreModule,
        DirectiveModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        QuicklinkModule,
        RouterModule,
        ReactiveFormsModule,
        MaterialModule,
        NgSelectModule,
        NgxChartsModule,
        PipesModule
    ],
    declarations: [
        AddDocComponent,
        AddTeamComponent,
        EditServiceComponent,
        FilelistComponent,
        FileListComponent,
        FileUploadComponent,
        FooterComponent,
        KpiComponent,
        KpiProjectComponent,
        KpiProjectAmchartsComponent,
        KpiProjectDetailComponent,
        KpiProjectForecastComponent,
        KpiProjectHeatmapComponent,
        KpiProjectHeatdayComponent,
        KpiProjectLocationComponent,
        LoadingComponent,
        LoadingCompletedComponent,
        MynavComponent,
        ProgressSpinnerComponent,
        ReportkpiComponent,
        ShowComponent,
        TagUserComponent,
        TagUserDbComponent,
        TagUserMatSelectComponent,
        UploaderComponent,
        UploadTaskComponent,
        UserJobProfileComponent,
        ViewOrderTimeSpentComponent,
    ],
    exports: [
        AddDocComponent,
        AddTeamComponent,
        CommonModule,
        CoreModule,
        DirectiveModule,
        EditServiceComponent,
        FilelistComponent,
        FileListComponent,
        FileUploadComponent,
        FooterComponent,
        FormsModule,
        HttpModule,
        HttpClientModule,
        KpiComponent,
        KpiProjectComponent,
        KpiProjectAmchartsComponent,
        KpiProjectDetailComponent,
        KpiProjectForecastComponent,
        KpiProjectHeatdayComponent,
        KpiProjectHeatmapComponent,
        KpiProjectLocationComponent,
        LoadingComponent,
        LoadingCompletedComponent,
        MaterialModule,
        MynavComponent,
        NgxChartsModule,
        PipesModule,
        ProgressSpinnerComponent,
        QuicklinkModule,
        ReactiveFormsModule,
        ReportkpiComponent,
        ShowComponent,
        TagUserComponent,
        TagUserDbComponent,
        TagUserMatSelectComponent,
        UploaderComponent,
        UploadTaskComponent,
        UserJobProfileComponent,
        ViewOrderTimeSpentComponent
    ],
    providers: [  ],
    entryComponents: [
        AddDocComponent,
        AddTeamComponent,
        EditServiceComponent,
        ShowComponent,
      ],
})
export class SharedModule { }
