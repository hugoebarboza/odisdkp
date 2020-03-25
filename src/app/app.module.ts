import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { LOCALE_ID, NgModule, ErrorHandler  } from '@angular/core';
import { HttpModule } from '@angular/http';

// COMPONENT
import { AppComponent } from './app.component';
import { LogoutComponent } from './components/dialog/logout/logout.component';

// DATE
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

// ENVIROMENT
import { environment } from '../environments/environment';

// FIREBASE
import { AngularFireModule } from '@angular/fire';
import { AngularFirePerformanceModule } from '@angular/fire/performance';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FirestoreSettingsToken} from '@angular/fire/firestore';
import { AuthService } from './services/firebase/auth.service';

// MATERIAL
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// MODULES
import { AppRoutingModule } from './app-routing.module';
import { LoadableModule, matcher } from 'ngx-loadable';
import { MenuModule } from './pages/menu/menu.module';
import { ServiceModule } from './services/service.module';
import { ToastrModule } from 'ngx-toastr';
import { ToolbarModule } from './pages/toolbar/toolbar.module';

// MOMENT
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

// PIPE MODULE
import { PipesModule } from './pipes/pipes.module';

// PWA
import { ServiceWorkerModule } from '@angular/service-worker';

// PROVIDERS
import { ErrorsHandler } from './providers/error/error-handler';
import { httpInterceptorProviders } from './providers/interceptor/index';

// REDUX
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { appReducers } from './app.reducers';

// SOCKET SERVER
import { SocketIoModule } from 'ngx-socket-io';
import { socketConfig } from 'src/app/providers/socket/index';


registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    LogoutComponent,
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
    HttpModule,
    LoadableModule.forRoot(
      {
        moduleConfigs:
      [
        {
          name: 'activeusers',
          loadChildren : () => import('./pages/active-users/active-users.module').then(m => m.ActiveUsersModule),
          matcher
        },
        {
          name: 'footermain',
          loadChildren : () => import('./pages/footer/footer.module').then(m => m.FooterModule),
          matcher
        },
        {
          name: 'header',
          loadChildren : () => import('./pages/header/header.module').then(m => m.HeaderModule),
          matcher
        },
      ]
      }
    ),
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatSnackBarModule,
    MenuModule,
    PipesModule,
    ServiceModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 5,
      logOnly: environment.production
    }),
    SocketIoModule.forRoot(socketConfig),
    ToastrModule.forRoot(),
    ToolbarModule
  ],
  entryComponents: [
    LogoutComponent,
  ],
  exports: [],
  providers: [
    AuthService,
    httpInterceptorProviders,
    { provide: FirestoreSettingsToken, useValue: {}},
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
