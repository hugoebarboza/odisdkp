import { NgModule } from '@angular/core';

// COMPONENTS
import { ViewProjectOrderComponent } from './components/viewprojectorder/viewprojectorder.component';

// DIRECTIVES
import { DirectiveModule } from 'src/app/directives/directive.module';

// MODULES
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../components/shared/shared.module';
import { ToastrModule } from 'ngx-toastr';

// ROUTER
import { ProjectOrderRoutingModule } from './projectorder.routes';


@NgModule({
  imports: [
    DirectiveModule,
    NgbModule,
    NgSelectModule,
    ProjectOrderRoutingModule,
    SharedModule,
    ToastrModule.forRoot(),
  ],
  declarations: [
    ViewProjectOrderComponent,
  ],
  exports: [
  ],
  entryComponents: [
  ],
  providers: [
    NgbActiveModal,
  ],
})
export class ProjectOrderModule { }
