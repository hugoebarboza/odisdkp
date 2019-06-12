import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//COMPONENTS
import { AddcaseComponent } from './dialog/addcase/addcase.component';
import { ShowcaseComponent } from './dialog/showcase/showcase.component';
import { SupportComponent } from './support-list/support.component';

//MODULES
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../material-module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

//ROUTING
import { SupportRoutingModule } from './support.routing';



//DIRECTIVES
import { DirectiveModule } from 'src/app/directives/directive.module';



//DIRECTIVE


@NgModule({
  imports: [
    CommonModule,
    DirectiveModule,
    FormsModule,
    MaterialModule,
    PipesModule,
    ReactiveFormsModule,
    SupportRoutingModule,
    NgSelectModule,
    SharedModule,
    NgbTypeaheadModule
  ],
  exports: [CommonModule],
  declarations: [SupportComponent, AddcaseComponent, ShowcaseComponent],
  entryComponents: [
    AddcaseComponent, ShowcaseComponent
  ],
})

export class SupportModule { }
