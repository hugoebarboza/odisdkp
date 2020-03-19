import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// COMPONENTS
import { DropdownNotificationComponent } from 'src/app/components/shared/dropdown-notification/dropdown-notification.component';
import { HeaderComponent } from './components/header/header.component';

// MATERIAL
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// PIPES
import { PipesModule } from 'src/app/pipes/pipes.module';



@NgModule({
  declarations: [
    DropdownNotificationComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    PipesModule,
    RouterModule,
  ],
  exports: [],
  providers: [],
  bootstrap: [HeaderComponent]
})
export class HeaderModule { }
