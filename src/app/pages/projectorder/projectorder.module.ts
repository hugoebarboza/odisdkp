import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';


// COMPONENTS
import { ViewProjectOrderComponent } from './components/viewprojectorder/viewprojectorder.component';

// DIRECTIVES
import { DirectiveModule } from 'src/app/directives/directive.module';

// MODULES
import { CoreModule } from '../../core.module';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';
import { ToastrModule } from 'ngx-toastr';

// ROUTER
import { ProjectOrderRoutingModule } from './projectorder.routes';


@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    DirectiveModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    NgbModule,
    NgSelectModule,
    PipesModule,
    ReactiveFormsModule,
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
