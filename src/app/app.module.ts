import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common"
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';

//ROUTER
import { RouterModule } from '@angular/router';
import { routing } from './app.routing';


//FIREBASE
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';

//MATERIAL
import {MaterialModule} from './material-module';

//MODULES
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './components/shared/shared.module';

//MAPS
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule} from 'agm-direction'; 

//MODAL
import { ModalMapaComponent } from './components/modal/modalmapa/modalmapa.component';
import { ModalImageComponent } from './components/modal/modalimage/modalimage.component';
import { ModalUploadImageComponent } from './components/modal/modaluploadimage/modaluploadimage.component';



//SERVICE MODULES
import { ServiceModule } from './services/service.module';



//MAIN NG-BOOTSTRAP MODULE
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

//PROGRESS BAR
//import { NgProgressModule } from '@ngx-progressbar/core';
//import { NgProgressRouterModule } from '@ngx-progressbar/router';


//UTILITYS
import { AngularEditorModule } from '@kolkov/angular-editor';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { MarkdownModule } from 'ngx-markdown';
import { Ng5SliderModule } from 'ng5-slider';
import { RECAPTCHA_SETTINGS, RecaptchaModule,  RecaptchaSettings } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { TableModule } from 'ngx-easy-table';
import { VerticalTimelineModule } from 'angular-vertical-timeline';



//ANGULAR SPLIT
import { AngularSplitModule } from 'angular-split';


//ANGULAR UTILITY
import { CalendarModule } from 'primeng/calendar';
import { CalendarModule as AngularCalendar, DateAdapter as AngularDateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import 'hammerjs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ScrollingModule } from '@angular/cdk/scrolling';


//MOMENT
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


//DEFAULT AND LOGIN
import { DefaultComponent } from './default/default.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

//PAGES
import { CalendarComponent } from './pages/calendar/calendar.component';
//import { ChangepasswordComponent } from './pages/changepassword/changepassword.component';
//import { DashboardComponent } from './pages/dashboard/dashboard.component';
//import { ProfileComponent } from './pages/profile/profile.component';
import { ServiceComponent } from './pages/service/service.component';
//import { UsuariosComponent } from './pages/usuarios/usuarios.component';

//COMPONENT
import { AppComponent } from './app.component';
import { DateDialogComponent } from './components/date-dialog/date-dialog.component';
import { ExcelComponent, DialogOverviewDialog } from './components/excel/excel.component';
import { ExcelVehiculoComponent } from './components/excel-vehiculo/excel-vehiculo.component';
import { FileComponent } from './components/dialog/file/file.component';
import { FilelistComponent } from './components/dialog/filelist/filelist.component';
import { FileListComponent } from './components/file-list/file-list.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { GestionComponent } from './components/gestion/gestion.component';
import { MapaComponent } from './components/mapa/mapa/mapa.component';
import { MapaFullWidthComponent } from './components/mapa/mapafullwidth/mapafullwidth.component'; 
import { OrderserviceComponent } from './components/orderservice/orderservice.component';
import { TableroComponent } from './components/tablero/tablero.component';
import { UsertableComponent } from './components/usertable/usertable.component';
import { ViewOrderDetailComponent } from './components/views/vieworderdetail/vieworderdetail.component';
import { VieworderserviceComponent } from './components/views/vieworderservice/vieworderservice.component';
import { ViewOrderTimeSpentComponent } from './components/views/viewordertimespent/viewordertimespent.component';
import { ViewprojectcustomerComponent } from './components/views/viewprojectcustomer/viewprojectcustomer.component';
import { ViewprojectorderComponent } from './components/views/viewprojectorder/viewprojectorder.component';
import { ViewProjectDetailComponent } from './components/views/viewprojectdetail/viewprojectdetail.component';


//DIALOG
import { AddComponent } from './components/dialog/add/add.component';
import { AddCalendarComponent } from './components/dialog/addcalendar/addcalendar.component';
import { AddcustomerComponent } from './components/dialog/addcustomer/addcustomer.component';
import { AddUserComponent } from './components/dialog/adduser/adduser.component';
import { AddServiceComponent } from './components/dialog/addservice/addservice.component';
import { AddSupportComponent } from './components/dialog/widget/addsupport/addsupport.component';
import { CargaComponent } from './components/dialog/carga/carga.component';
import { CsvComponent } from './components/dialog/csv/csv.component';
import { CsvCustomerComponentComponent } from './components/dialog/csvcustomercomponent/csvcustomercomponent.component';
import { CsvServiceComponent } from './components/dialog/csvservice/csvservice.component';
import { DeleteComponent } from './components/dialog/delete/delete.component';
import { DeletecustomerComponent } from './components/dialog/deletecustomer/deletecustomer.component';
import { DeleteServiceComponent } from './components/dialog/deleteservice/deleteservice.component';
import { DownloadComponent } from './components/dialog/download/download.component';
import { EditComponent } from './components/dialog/edit/edit.component';
import { EditcustomerComponent } from './components/dialog/editcustomer/editcustomer.component';
import { EditServiceComponent } from './components/dialog/editservice/editservice.component';
import { EditUserComponent } from './components/dialog/edituser/edituser.component';
import { LogoutComponent } from './components/dialog/logout/logout.component';
import { ShowComponent } from './components/dialog/show/show.component';
import { ShowcustomerComponent } from './components/dialog/showcustomer/showcustomer.component';
import { ShowProfileSecurityComponent } from './components/dialog/showprofilesecurity/showprofilesecurity.component';
import { ShowProfileComponent } from './components/dialog/showprofile/showprofile.component';
import { SettingsComponent } from './components/dialog/settings/settings.component';
import { SettingscustomerComponent } from './components/dialog/settingscustomer/settingscustomer.component';
import { VehiculoOverviewDialog } from './components/excel-vehiculo/excel-vehiculo.component';
import { ZipComponent } from './components/dialog/zip/zip.component';


//PIPE MODULE
import { PipesModule } from './pipes/pipes.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


//SERVICES
import { AuthguardService } from './services/authguard.service';


//Import toast module
import { ToastModule } from 'primeng/toast';
import { ToastrModule } from 'ngx-toastr';
//import {ToasterModule, ToasterService} from 'angular2-toaster';

//ESPAÑOL DATE
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';



//ROUTE FOR LOADING
//import { RouterResolver } from './router.resolver';



//PWA
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

//DIRECTIVES
import { DropZoneDirective } from './directives/drop-zone.directive';
import { NgDropFilesDirective } from './directives/ng-drop-files.directive';


// Global vars
import { GLOBAL } from './services/global';
import { PagesComponent } from './pages/pages.component';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    AddComponent,
    AddCalendarComponent,
    AddcustomerComponent,
    AddServiceComponent,
    AddSupportComponent,
    AddUserComponent,
    CalendarComponent,
    CargaComponent,
    CsvComponent,
    CsvCustomerComponentComponent,
    CsvServiceComponent,
    DateDialogComponent,
    DefaultComponent,
    DeletecustomerComponent,
    DeleteComponent,
    DeleteServiceComponent,
    DialogOverviewDialog,
    DownloadComponent,
    DropZoneDirective,
    EditcustomerComponent,
    EditComponent,
    EditServiceComponent,
    EditUserComponent,  
    ExcelComponent,
    ExcelVehiculoComponent,
    FileComponent,
    FilelistComponent,
    FileListComponent,
    FileUploadComponent,
    ForgotpasswordComponent,
    GestionComponent,
    LoginComponent,
    LogoutComponent,
    MapaComponent, 
    MapaFullWidthComponent,
    ModalMapaComponent,
    ModalImageComponent,
    ModalUploadImageComponent,
    NgDropFilesDirective,
    OrderserviceComponent,
    RegisterComponent,
    ServiceComponent,
    SettingsComponent, 
    SettingscustomerComponent, 
    ShowComponent,
    ShowcustomerComponent,
    ShowProfileSecurityComponent,
    ShowProfileComponent,
    UsertableComponent,
    ViewOrderDetailComponent,
    VieworderserviceComponent,
    ViewprojectorderComponent,
    ViewprojectcustomerComponent, 
    VehiculoOverviewDialog,
    ZipComponent,
    TableroComponent,
    ViewOrderTimeSpentComponent,
    ViewProjectDetailComponent,
    PagesComponent,
  ],
  exports: [
  ],
  imports: [    
    AngularEditorModule,
    AgmDirectionModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AgmCoreModule.forRoot({
      apiKey: GLOBAL.agmapikey
    }),
    AngularSplitModule.forRoot(),
    AngularCalendar.forRoot({
      provide: AngularDateAdapter,
      useFactory: adapterFactory
    }),   
    BrowserModule,    
    BrowserAnimationsModule,    
    CalendarModule,    
    CommonModule,
    FlexLayoutModule,
    FormsModule,    
    HttpModule,
    HttpClientModule,    
    LoadingBarModule,
    MaterialModule,
    NgxMatSelectSearchModule,        
    MarkdownModule.forRoot(),
    MatProgressButtonsModule,
    Ng5SliderModule,    
    NgbModule,
    NgSelectModule,
    Ng2SearchPipeModule, 
    OwlDateTimeModule,
    OwlNativeDateTimeModule,    
    PipesModule,
    ReactiveFormsModule,    
    RecaptchaFormsModule,  
    RecaptchaModule,
    routing,
    RouterModule,
    PagesModule,
    SharedModule, 
    ScrollingModule,
    ServiceModule,
    TableModule,
    ToastModule,    
    ToastrModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    VerticalTimelineModule
  ],
  entryComponents: [
    AddComponent, 
    AddCalendarComponent, 
    AddcustomerComponent, 
    AddServiceComponent,
    AddSupportComponent,
    AddUserComponent,
    CsvComponent,
    CsvCustomerComponentComponent,
    CsvServiceComponent,
    DateDialogComponent,
    DeleteComponent, 
    DeletecustomerComponent, 
    DeleteServiceComponent, 
    DialogOverviewDialog, 
    DownloadComponent, 
    EditComponent,
    EditcustomerComponent, 
    EditServiceComponent,
    EditUserComponent,
    FileComponent, 
    LogoutComponent,
    ModalMapaComponent, 
    ModalImageComponent,
    ModalUploadImageComponent,
    ShowComponent, 
    ShowcustomerComponent,
    ShowProfileSecurityComponent,
    ShowProfileComponent,
    SettingsComponent, 
    SettingscustomerComponent, 
    VehiculoOverviewDialog,
    ZipComponent    
  ],
  providers: [
    AuthguardService, 
    NgbActiveModal, 
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: LOCALE_ID, useValue: 'es' },
    {provide: MAT_DATE_LOCALE, useValue: 'es'},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LdY_pwUAAAAANNCwxFDBNTGRDg2hrDvZSLTfxLl',
      } as RecaptchaSettings,
    }
  ],
  bootstrap: [
  	AppComponent
  ]
})



export class AppModule { 
    

}
