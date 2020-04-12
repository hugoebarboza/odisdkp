import { NgModule } from '@angular/core';

// MODULES
import { SharedModule } from '../../components/shared/shared.module';


import {
  ViewProjectDetailComponent,
 } from './view.index';


@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [

    ViewProjectDetailComponent,
  ],
  providers: [
    ViewProjectDetailComponent,
  ],
  declarations: [
    ViewProjectDetailComponent
  ]
})
export class ViewModule { }
