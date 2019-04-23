import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//MATERIAL
import {MaterialModule} from '../../material-module';

//COMPONENTS
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
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,    
        MaterialModule,
        PipesModule
    ],
    declarations: [
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
        FooterComponent,
        FootermainComponent,
        HeaderComponent,
        LoadingComponent,
        MenuComponent,
        MynavComponent,
        NotfoundComponent,
        ProgressSpinnerComponent
    ]
})
export class SharedModule { }
