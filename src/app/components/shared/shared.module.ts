import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxChartsModule } from '@swimlane/ngx-charts';

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
    DropdownNotificationComponent,
    EditServiceComponent,
    FilelistComponent,
    FileListComponent,
    FileUploadComponent,
    FooterComponent,
    FootermainComponent,
    HeaderComponent,
    KpiComponent,
    KpiProjectComponent,
    KpiProjectAmchartsComponent,
    KpiProjectDetailComponent,
    KpiProjectForecastComponent,
    KpiProjectHeatdayComponent,
    KpiProjectHeatmapComponent,
    KpiProjectLocationComponent,
    LoadingComponent,
    MenuComponent,
    MynavComponent,
    NotfoundComponent,
    ProgressSpinnerComponent,
    ReportkpiComponent,
    ShowComponent,
    TagUserComponent,
    UploaderComponent,
    UploadTaskComponent,
    ViewOrderTimeSpentComponent,
   } from './shared.index';

// Pipes
import { PipesModule } from '../../pipes/pipes.module';



@NgModule({
    imports: [
        CalendarModule,
        CommonModule,
        DirectiveModule,
        FormsModule,
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
        DropdownNotificationComponent,
        DropdownNotificationComponent,
        EditServiceComponent,
        FilelistComponent,
        FileListComponent,
        FileUploadComponent,
        FooterComponent,
        FootermainComponent,
        HeaderComponent,
        KpiComponent,
        KpiProjectComponent,
        KpiProjectAmchartsComponent,
        KpiProjectDetailComponent,
        KpiProjectForecastComponent,
        KpiProjectHeatmapComponent,
        KpiProjectHeatdayComponent,
        KpiProjectLocationComponent,
        LoadingComponent,
        MenuComponent,
        MynavComponent,
        NotfoundComponent,
        ProgressSpinnerComponent,
        ReportkpiComponent,
        ShowComponent,
        TagUserComponent,
        UploaderComponent,
        UploadTaskComponent,
        ViewOrderTimeSpentComponent,

    ],
    exports: [
        AddDocComponent,
        DropdownNotificationComponent,
        EditServiceComponent,
        FilelistComponent,
        FileListComponent,
        FileUploadComponent,
        FooterComponent,
        FootermainComponent,
        HeaderComponent,
        KpiComponent,
        KpiProjectComponent,
        KpiProjectAmchartsComponent,
        KpiProjectDetailComponent,
        KpiProjectForecastComponent,
        KpiProjectHeatdayComponent,
        KpiProjectHeatmapComponent,
        KpiProjectLocationComponent,
        LoadingComponent,
        MenuComponent,
        MynavComponent,
        NgxChartsModule,
        NotfoundComponent,
        ProgressSpinnerComponent,
        QuicklinkModule,
        ReportkpiComponent,
        ShowComponent,
        TagUserComponent,
        UploaderComponent,
        UploadTaskComponent,
        ViewOrderTimeSpentComponent
    ],
    providers: [  ],
    entryComponents: [
        AddDocComponent,
        EditServiceComponent,
        ShowComponent,
      ],
})
export class SharedModule { }
