import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { HttpModule } from '@angular/http';

// COMPONENTS
import { ViewProjectOrderComponent } from './components/viewprojectorder/viewprojectorder.component';

// DIRECTIVES
import { DirectiveModule } from 'src/app/directives/directive.module';

// MODULES
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';
import { ToastrModule } from 'ngx-toastr';

// SERVICES
import { ServiceModule } from 'src/app/services/service.module';


// MOMENT
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


// ROUTER
import { ProjectOrderRoutingModule } from './projectorder.routes';



// ESPAÑOL DATE
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';


// PROVIDERS
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from '../../providers/interceptor/my.interceptor';


registerLocaleData(localeEs);

@NgModule({
  imports: [
    CommonModule,
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
    ServiceModule,
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
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: LOCALE_ID, useValue: 'es' },
    {provide: MAT_DATE_LOCALE, useValue: 'es'},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true },
  ],
})
export class ProjectOrderModule { }
