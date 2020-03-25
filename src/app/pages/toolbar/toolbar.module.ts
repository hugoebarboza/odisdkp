import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// COMPONENTS
import { ToolbarComponent } from './components/toolbar/toolbar.component';

// MATERIAL
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    RouterModule
  ],
  exports: [ToolbarComponent],
  providers: [],
  bootstrap: [ToolbarComponent]
})
export class ToolbarModule { }
