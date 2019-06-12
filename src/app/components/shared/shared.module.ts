import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

//MATERIAL
import {MaterialModule} from '../../material-module';

//MODULES
import { CalendarModule } from 'primeng/calendar';

//COMPONENTS
import {
    DropdownNotificationComponent,
    EditServiceComponent,
    FooterComponent,
    FootermainComponent,
    HeaderComponent,
    LoadingComponent,
    MenuComponent,
    MynavComponent,
    NotfoundComponent,
    ProgressSpinnerComponent,
    TagUserComponent
   } from './shared.index';

// Pipes
import { PipesModule } from '../../pipes/pipes.module';





@NgModule({
    imports: [
        CalendarModule,
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,    
        MaterialModule,
        NgSelectModule,
        PipesModule
    ],
    declarations: [
        DropdownNotificationComponent,
        EditServiceComponent,
        FooterComponent,
        FootermainComponent,
        HeaderComponent,
        LoadingComponent,
        MenuComponent,
        MynavComponent,
        NotfoundComponent,
        ProgressSpinnerComponent,
        TagUserComponent,
        DropdownNotificationComponent
    ],
    exports: [
        DropdownNotificationComponent,
        EditServiceComponent,
        FooterComponent,
        FootermainComponent,
        HeaderComponent,
        LoadingComponent,
        MenuComponent,
        MynavComponent,
        NotfoundComponent,
        ProgressSpinnerComponent,
        TagUserComponent
    ],
    entryComponents: [
        EditServiceComponent,
      ],
    
})
export class SharedModule { }
