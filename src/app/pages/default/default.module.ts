import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// COMPONENTS
import { DefaultComponent } from './components/default.component';

// ROUTING
import { DefaultRoutingModule } from './default.routing';


@NgModule({
  declarations: [DefaultComponent],
  imports: [
    DefaultRoutingModule,
    RouterModule
  ],
  exports: [],
  providers: [],
  bootstrap: [DefaultComponent]
})
export class DefaultModule { }
