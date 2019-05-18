import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//MATERIAL
import {MaterialModule} from '../../material-module';

//MODULES
import { CalendarModule } from 'primeng/calendar';

//COMPONENTS
import {
    EditServiceComponent,
   } from './shared.index';
import { FooterComponent } from './footer/footer.component';
import { FootermainComponent } from './footermain/footermain.component';
import { HeaderComponent } from './header/header.component';
import { LoadingComponent } from './loading/loading.component';
import { MenuComponent } from './menu/menu.component';
import { MynavComponent } from './mynav/mynav.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';

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
        PipesModule
    ],
    declarations: [
        EditServiceComponent,
        FooterComponent,
        FootermainComponent,
        HeaderComponent,
        LoadingComponent,
        MenuComponent,
        MynavComponent,
        NotfoundComponent,
        ProgressSpinnerComponent
    ],
    exports: [
        EditServiceComponent,
        FooterComponent,
        FootermainComponent,
        HeaderComponent,
        LoadingComponent,
        MenuComponent,
        MynavComponent,
        NotfoundComponent,
        ProgressSpinnerComponent
    ],
    entryComponents: [
        EditServiceComponent,
      ],
    
})
export class SharedModule { }
