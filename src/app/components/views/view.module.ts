import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//COMPONENTS
import { FileListComponent } from '../../components/file-list/file-list.component';
import { FileUploadComponent } from '../../components/file-upload/file-upload.component';


//MODULES
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MaterialModule } from '../../material-module';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

import {
  ViewProjectDetailComponent,
 } from './view.index';


@NgModule({
  imports: [
    AngularEditorModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    PipesModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    ViewProjectDetailComponent,
  ],
  providers: [
    ViewProjectDetailComponent,
  ],
  declarations: [
    FileListComponent,
    FileUploadComponent,
    ViewProjectDetailComponent
  ]
})
export class ViewModule { }
