import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from "@angular/common"
import { HttpModule } from '@angular/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//COMPONENT
import { AppComponent } from './app.component';
import { DefaultComponent } from './default/default.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './components/dialog/logout/logout.component';
import { PagesComponent } from './pages/pages.component';
import { RegisterComponent } from './register/register.component';



//MATERIAL
import {MaterialModule} from './material-module';

//MODULES
import { AppRoutingModule } from './app.routing';
import { ServiceModule } from './services/service.module';
import { SharedModule } from './components/shared/shared.module';

//MOMENT
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


//FIREBASE
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { FirestoreSettingsToken} from '@angular/fire/firestore';


//ROUTER
import { RouterModule } from '@angular/router';


//MAIN NG-BOOTSTRAP MODULE
//import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


//UTILITYS
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AngularSplitModule } from 'angular-split';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { RECAPTCHA_SETTINGS, RecaptchaModule,  RecaptchaSettings } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';


//ANGULAR UTILITY
import { MatProgressButtonsModule } from 'mat-progress-buttons';


//PIPE MODULE
import { PipesModule } from './pipes/pipes.module';

//SERVICES
import { AuthguardService } from './services/authguard.service';
import { LoginGuardGuard } from './services/guards/login-guard.guard';

//Import toast module
import { ToastrModule } from 'ngx-toastr';

//ESPAÑOL DATE
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

//PWA
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from './http-interceptors/my.interceptor';
import { httpInterceptorProviders } from './http-interceptors/index';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    ForgotpasswordComponent,
    LoginComponent,
    LogoutComponent,
    PagesComponent,
    RegisterComponent,
  ],
  imports: [    
    AppRoutingModule,
    AngularEditorModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularSplitModule.forRoot(),
    BrowserModule,    
    BrowserAnimationsModule,    
    CommonModule,
    FormsModule,    
    HttpModule,
    HttpClientModule,
    LoadingBarModule,
    MaterialModule,
    MatProgressButtonsModule,
    //NgbModule,
    PipesModule,
    ReactiveFormsModule,    
    RecaptchaFormsModule,  
    RecaptchaModule,
    RouterModule,
    SharedModule, 
    ServiceModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ToastrModule.forRoot(),
  ],
  entryComponents: [
    LogoutComponent,
  ],
  exports: [
  ],
  providers: [
    AuthguardService,
    { provide: FirestoreSettingsToken, useValue: {}},
    LoginGuardGuard,
    //NgbActiveModal, 
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: LOCALE_ID, useValue: 'es' },
    {provide: MAT_DATE_LOCALE, useValue: 'es'},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LdY_pwUAAAAANNCwxFDBNTGRDg2hrDvZSLTfxLl',
      } as RecaptchaSettings,
    },
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true },
    
  ],
  bootstrap: [
  	AppComponent
  ]
})



export class AppModule { 
    

}
