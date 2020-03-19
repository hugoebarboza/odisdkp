import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { LOCALE_ID, NgModule, ErrorHandler  } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// MATERIAL
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

// COMPONENT
import { AppComponent } from './app.component';
import { DefaultComponent } from './default/default.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { LogoutComponent } from './components/dialog/logout/logout.component';
import { MenuComponent } from './components/shared/menu/menu.component';
// import { PagesComponent } from './pages/pages.component';
import { RegisterComponent } from './register/register.component';


// MODULES
import { AppRoutingModule } from './app-routing.module';
import { LoadableModule, matcher } from 'ngx-loadable';
import { ServiceModule } from './services/service.module';
// import { SharedModule } from './components/shared/shared.module';


// MOMENT
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

// NEW IMPORT
import { AngularFireModule } from '@angular/fire';
import { AngularFirePerformanceModule } from '@angular/fire/performance';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FirestoreSettingsToken} from '@angular/fire/firestore';
import { AuthService } from './services/firebase/auth.service';


// ROUTER
// import { RouterModule } from '@angular/router';

// UTILITYS
import { NgxCaptchaModule } from 'ngx-captcha';


// ANGULAR UTILITY
// import { MatProgressButtonsModule } from 'mat-progress-buttons';


// PIPE MODULE
import { PipesModule } from './pipes/pipes.module';

// SERVICES
// import { AuthguardService } from './services/authguard.service';
// import { LoginGuardGuard } from './services/guards/login-guard.guard';

// Import toast module
import { ToastrModule } from 'ngx-toastr';

// ESPAÑOL DATE
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

// PWA
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


// Providers
import { ErrorsHandler } from './providers/error/error-handler';
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from './providers/interceptor/index';

// REDUX
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { appReducers } from './app.reducers';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    ForgotpasswordComponent,
    // LoginComponent,
    LogoutComponent,
    MenuComponent,
    // PagesComponent,
    RegisterComponent
  ],
  imports: [
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirePerformanceModule,
    // AngularFirestoreModule.enablePersistence(),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    CommonModule,
    // DirectiveModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    LoadableModule.forRoot(
      {
        moduleConfigs: [{
          name: 'footermain',
          loadChildren : () => import('./pages/footer/footer.module').then(m => m.FooterModule),
          matcher
        },
        {
          name: 'header',
          loadChildren : () => import('./pages/header/header.module').then(m => m.HeaderModule),
          matcher
        }]
      }
    ),
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    // MatFormFieldModule,
    MatIconModule,
    // MatInputModule,
    MatListModule,
    MatSidenavModule,
    // MatSlideToggleModule,
    MatSnackBarModule,
    MatToolbarModule,
    // MatProgressButtonsModule.forRoot(),
    NgxCaptchaModule,
    PipesModule,
    ReactiveFormsModule,
    // RouterModule,
    // SharedModule,
    ServiceModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 5,
      logOnly: environment.production
    }),
    ToastrModule.forRoot(),
  ],
  entryComponents: [
    LogoutComponent,
  ],
  exports: [

  ],
  providers: [
    AuthService,
    // AuthguardService,
    httpInterceptorProviders,
    { provide: FirestoreSettingsToken, useValue: {}},
    // LoginGuardGuard,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: MAT_DATE_LOCALE, useValue: 'es'},
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    { provide: ErrorHandler, useClass: ErrorsHandler },
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule { }
