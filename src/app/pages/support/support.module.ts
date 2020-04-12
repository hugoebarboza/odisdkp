import { NgModule } from '@angular/core';

// COMPONENTS
import { AddcaseComponent } from './dialog/addcase/addcase.component';
import { CategorysettingsComponent } from './support-settings/components/categorysettings/categorysettings.component';
import { ShowcaseComponent } from './dialog/showcase/showcase.component';
import { SupportComponent } from './support-list/support.component';
import { SupportUsersComponent } from './support-users/supportusers.component';
import { SupportsettingsComponent } from './support-settings/supportsettings.component';
import { StatussettingsComponent } from './support-settings/components/statussettings/statussettings.component';
import { TypesettingsComponent } from './support-settings/components/typesettings/typesettings.component';
import { ViewCaseComponent } from './components/view-case/view-case.component';

// MODULES
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../components/shared/shared.module';

// ROUTING
import { SupportRoutingModule } from './support.routing';



@NgModule({
  imports: [
    SupportRoutingModule,
    NgSelectModule,
    SharedModule,
    NgbTypeaheadModule,
  ],
  exports: [],
  declarations: [
    AddcaseComponent,
    CategorysettingsComponent,
    ShowcaseComponent,
    SupportComponent,
    SupportsettingsComponent,
    StatussettingsComponent,
    SupportUsersComponent,
    TypesettingsComponent,
    ViewCaseComponent
  ],
  entryComponents: [
    AddcaseComponent, ShowcaseComponent
  ],
})

export class SupportModule { }
