import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
    CopyDirective,
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
    CopyDirective,
    DropZoneDirective,
    NgDropFilesDirective
  ],
  declarations: [
    CopyDirective,
    DropZoneDirective,
    NgDropFilesDirective
  ]
})
export class DirectiveModule { }
