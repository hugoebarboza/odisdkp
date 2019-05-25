import { NgModule } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
    DropZoneDirective,
    NgDropFilesDirective,
 } from './directive.index';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,

  ],
  providers: [
  ],
  exports: [
    DropZoneDirective,
    NgDropFilesDirective
  ],
  declarations: [
    DropZoneDirective,
    NgDropFilesDirective
  ]
})
export class DirectiveModule { }
