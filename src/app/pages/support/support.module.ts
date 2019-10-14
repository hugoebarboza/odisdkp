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
import { SupportsettingsComponent } from './support-settings/supportsettings.component';
import { TypesettingsComponent } from './support-settings/components/typesettings/typesettings.component';
import { CategorysettingsComponent } from './support-settings/components/categorysettings/categorysettings.component';
import { StatussettingsComponent } from './support-settings/components/statussettings/statussettings.component';


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
    NgbTypeaheadModule,
    
  ],
  exports: [CommonModule],
  // tslint:disable-next-line:max-line-length
  declarations: [SupportComponent,
    AddcaseComponent,
    ShowcaseComponent,
    SupportsettingsComponent,
    TypesettingsComponent,
    CategorysettingsComponent,
    StatussettingsComponent],
  entryComponents: [
    AddcaseComponent, ShowcaseComponent
  ],
})

export class SupportModule { }
