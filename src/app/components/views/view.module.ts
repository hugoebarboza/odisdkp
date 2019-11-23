import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// COMPONENTS

// DIRECTIVES
import { DirectiveModule } from 'src/app/directives/directive.module';

// MODULES
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';


import {
  ViewProjectDetailComponent,
 } from './view.index';


@NgModule({
  imports: [
    CommonModule,
    DirectiveModule,
    FormsModule,
    PipesModule,
    ReactiveFormsModule,
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
