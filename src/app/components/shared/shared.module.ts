import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


//DIRECTIVE
import { DirectiveModule } from 'src/app/directives/directive.module';

//MATERIAL
import {MaterialModule} from '../../material-module';

//MODULES
import { CalendarModule } from 'primeng/calendar';

//COMPONENTS
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
    LoadingComponent,
    MenuComponent,
    MynavComponent,
    NotfoundComponent,
    ProgressSpinnerComponent,
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
        RouterModule,
        ReactiveFormsModule,    
        MaterialModule,
        NgSelectModule,
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
        LoadingComponent,
        MenuComponent,
        MynavComponent,
        NotfoundComponent,
        ProgressSpinnerComponent,
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
        LoadingComponent,
        MenuComponent,
        MynavComponent,
        NotfoundComponent,
        ProgressSpinnerComponent,
        TagUserComponent,
        UploaderComponent,
        UploadTaskComponent,
        ViewOrderTimeSpentComponent
    ],
    entryComponents: [
        AddDocComponent,
        EditServiceComponent,
      ],
    
})
export class SharedModule { }
