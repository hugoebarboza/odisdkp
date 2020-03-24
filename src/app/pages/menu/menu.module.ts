import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// MATERIAL
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// COMPONENTS
import { MenuComponent } from './components/menu/menu.component';

// PIPE MODULE
import { PipesModule } from '../../pipes/pipes.module';


@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    PipesModule,
    RouterModule
  ],
  exports: [],
  providers: [],
  bootstrap: [MenuComponent]
})
export class MenuModule { }
